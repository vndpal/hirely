// lib/notion.ts
import { callNotionTool } from './mcp'

// MCP READ — called at the start of every interview session
export async function getJob(pageId: string) {
  const id = pageId.replace(/-/g, '').replace(/^https?:\/\/.*\//, '')

  const toolResult = (await callNotionTool('notion-fetch', { id })) as any[]

  const firstContent = toolResult?.[0]
  if (!firstContent || firstContent.type !== 'text') {
    throw new Error('Unexpected response format from notion-fetch tool')
  }

  const rawText = firstContent.text

  // The Notion MCP server returns JSON: { metadata, title, url, text }
  // where `text` contains XML-like <properties> and <content> sections
  let outer: any = {}
  try {
    outer = JSON.parse(rawText)
  } catch {
    outer = { text: rawText }
  }

  const pageText = outer.text || rawText

  // Extract flat properties JSON from <properties>...</properties>
  let props: any = {}
  const propsMatch = pageText.match(/<properties>\s*([\s\S]*?)\s*<\/properties>/)
  if (propsMatch) {
    try {
      props = JSON.parse(propsMatch[1])
    } catch {
      console.warn('Failed to parse <properties> JSON')
    }
  }

  // Extract page body content from <content>...</content>
  let content = ''
  const contentMatch = pageText.match(/<content>\s*([\s\S]*?)\s*<\/content>/)
  if (contentMatch) {
    content = contentMatch[1].trim()
  }

  // Properties from Notion MCP are flat key-value pairs, not Notion API format
  const title = props['Role title'] || outer.title || ''
  const requiredSkills = Array.isArray(props['Required skills'])
    ? props['Required skills']
    : []
  const minExperience = props['Min experience'] || 0
  const salaryMin = props['Salary min'] || 0
  const salaryMax = props['Salary max'] || 0
  const threshold = props['Match threshold'] || 40
  const hrEmail = props['HR Email'] || ''

  const jdText = content || ''

  console.log('Parsed job from MCP:', { title, requiredSkills, minExperience, salaryMin, salaryMax, jdTextLength: jdText.length })

  return {
    id: pageId,
    title,
    requiredSkills,
    minExperience,
    salaryMin,
    salaryMax,
    threshold,
    hrEmail,
    jdText,
  }
}

// MCP WRITE — called after scoring is complete
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
