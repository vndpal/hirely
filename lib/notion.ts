// lib/notion.ts
import { callNotionTool } from './mcp'

function getPlainTextFromRichText(richText: any[] = []) {
  return richText.map((t) => t?.plain_text || '').join('').trim()
}

function extractTextFromProperty(prop: any): string {
  if (!prop || typeof prop !== 'object') return ''

  if (prop.type === 'rich_text') return getPlainTextFromRichText(prop.rich_text)
  if (prop.type === 'title') return getPlainTextFromRichText(prop.title)
  return ''
}

// MCP READ ① — called at the start of every interview session
export async function getJob(pageId: string) {
  // Strip dashes and any URL prefix — pass the raw page ID
  const id = pageId.replace(/-/g, '').replace(/^https?:\/\/.*\//, '')

  const toolResult = (await callNotionTool('notion-fetch', { id })) as any[]
  
  // toolResult is an array of content objects. The first one is typically the page data.
  // We expect a text content item that might contain JSON or Markdown.
  const firstContent = toolResult?.[0]
  if (!firstContent || firstContent.type !== 'text') {
    throw new Error('Unexpected response format from notion-fetch tool')
  }

  // Parse the properties and content. 
  // Depending on the server implementation, this might be a single string or JSON.
  // Official Notion MCP returns a comprehensive representation.
  let data: any = {}
  try {
    // Attempt to parse if it's JSON-wrapped
    data = JSON.parse(firstContent.text)
  } catch {
    // Fallback if it's raw text; in some implementations, we might need a different tool
    // but the official notion-fetch usually returns properties in the metadata/header.
    // For now, we'll log it and try to extract what we can.
    console.warn('MCP notion-fetch result is not JSON, might require custom parsing')
    data = { properties: {}, content: firstContent.text }
  }

  const p = data.properties || {}
  
  // Extract text fields using the same logic, adjusting for potential MCP structure differences
  const description =
    extractTextFromProperty(p['Description']) ||
    extractTextFromProperty(p['JD']) ||
    extractTextFromProperty(p['Job Description'])
  
  const body = data.content || ''
  const jdText = [description, body].filter(Boolean).join('\n\n').trim()

  return {
    id:             pageId,
    title:          p['Role title']?.title?.[0]?.plain_text || p['Role title']?.text || '',
    requiredSkills: p['Required skills']?.multi_select?.map((x:any) => x.name) || [],
    minExperience:  p['Min experience']?.number || 0,
    salaryMin:      p['Salary min']?.number || 0,
    salaryMax:      p['Salary max']?.number || 0,
    threshold:      p['Match threshold']?.number || 40,
    hrEmail:        p['HR Email']?.email || '',
    jdText,
  }
}
 
// MCP WRITE ③ — called after scoring is complete
export async function createCandidate(data: any) {
  const databaseId = process.env.NOTION_CANDIDATES_DB_ID
  if (!databaseId) throw new Error('Missing NOTION_CANDIDATES_DB_ID')

  return callNotionTool('notion-create-pages', {
    parent: databaseId,
    properties: {
      'Candidate name':  { title: [{ text: { content: data.name || 'Unknown' } }] },
      'Status':          { select: { name: 'New' } },
      'Match score':     { number: data.matchScore || 0 },
      'Below threshold': { checkbox: data.belowThreshold || false },
      'Skills matched':  { multi_select: (data.skillsMatched||[]).map((s:string)=>({name:s})) },
      'Skills missing':  { multi_select: (data.skillsMissing||[]).map((s:string)=>({name:s})) },
      'Salary ask':      { number: data.salaryAsk || 0 },
      'Salary fit':      { select: { name: data.salaryFit || 'Within' } },
      'Quick take':      { rich_text: [{ text: { content: data.quickTake || '' } }] },
      'Red flags':       { rich_text: [{ text: { content: data.redFlags || '' } }] },
      'Transcript':      { rich_text: [{ text: { content: (data.transcript||'').slice(0, 2000) } }] },
      'Job ID':          { rich_text: [{ text: { content: data.jobId || '' } }] },
      'Candidate email': { email: data.email || null },
    }
  })
}
