// app/api/interview/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { getJob } from '@/lib/notion'
import { interviewPrompt } from '@/lib/prompts'
 
const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
 
export async function POST(req: Request) {
  const { messages, jobId } = await req.json()
  if (!jobId) return Response.json({ error: 'Missing jobId' }, { status: 400 })
 
  // MCP READ ② — fetch live JD from Notion before every single message
  const job = await getJob(jobId)
  const system = interviewPrompt(job)
 
  const stream = await claude.messages.stream({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system,
    messages,
  })
 
  return new Response(stream.toReadableStream())
}
