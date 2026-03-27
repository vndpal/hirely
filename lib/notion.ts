// lib/notion.ts
import { Client } from '@notionhq/client'
 
const notion = new Client({ auth: process.env.NOTION_API_KEY })

function getPlainTextFromRichText(richText: any[] = []) {
  return richText.map((t) => t?.plain_text || '').join('').trim()
}

function extractTextFromProperty(prop: any): string {
  if (!prop || typeof prop !== 'object') return ''

  if (prop.type === 'rich_text') return getPlainTextFromRichText(prop.rich_text)
  if (prop.type === 'title') return getPlainTextFromRichText(prop.title)
  return ''
}

function extractTextFromBlock(block: any): string {
  if (!block || typeof block !== 'object' || !block.type) return ''
  const content = block[block.type]
  if (!content) return ''

  if (Array.isArray(content.rich_text) && content.rich_text.length > 0) {
    return getPlainTextFromRichText(content.rich_text)
  }

  // Handle list and heading blocks where text can still be represented as rich_text.
  if (Array.isArray(content.children) && content.children.length > 0) {
    return content.children.map((child: any) => extractTextFromBlock(child)).filter(Boolean).join('\n')
  }

  return ''
}

async function getPageBodyText(pageId: string): Promise<string> {
  let cursor: string | undefined = undefined
  const lines: string[] = []

  do {
    const response: any = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
      start_cursor: cursor,
    })

    for (const block of response.results || []) {
      const text = extractTextFromBlock(block)
      if (text) lines.push(text)
    }

    cursor = response.has_more ? response.next_cursor || undefined : undefined
  } while (cursor)

  return lines.join('\n').trim()
}
 
// MCP READ ① — called at the start of every interview session
export async function getJob(pageId: string) {
  const page = await notion.pages.retrieve({ page_id: pageId }) as any
  const p = page.properties
  const description =
    extractTextFromProperty(p['Description']) ||
    extractTextFromProperty(p['JD']) ||
    extractTextFromProperty(p['Job Description'])
  const body = await getPageBodyText(pageId)
  const jdText = [description, body].filter(Boolean).join('\n\n').trim()

  return {
    id:             page.id,
    title:          p['Role title']?.title?.[0]?.plain_text || '',
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
  return notion.pages.create({
    parent: { database_id: process.env.NOTION_CANDIDATES_DB_ID! },
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
