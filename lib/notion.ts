// lib/notion.ts
import { Client } from '@notionhq/client'
 
const notion = new Client({ auth: process.env.NOTION_API_KEY })
 
// MCP READ ① — called at the start of every interview session
export async function getJob(pageId: string) {
  const page = await notion.pages.retrieve({ page_id: pageId }) as any
  const p = page.properties
  return {
    id:             page.id,
    title:          p['Role title']?.title?.[0]?.plain_text || '',
    requiredSkills: p['Required skills']?.multi_select?.map((x:any) => x.name) || [],
    minExperience:  p['Min experience']?.number || 0,
    salaryMin:      p['Salary min']?.number || 0,
    salaryMax:      p['Salary max']?.number || 0,
    threshold:      p['Match threshold']?.number || 40,
    hrEmail:        p['HR Email']?.email || '',
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
