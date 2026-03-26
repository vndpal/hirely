// app/api/interview/route.ts
import { getJob } from '@/lib/notion'
import { interviewPrompt } from '@/lib/prompts'

const openAiApiKey = process.env.OPEN_AI_API_KEY

export async function POST(req: Request) {
  const { messages, jobId } = await req.json()
  if (!jobId) return Response.json({ error: 'Missing jobId' }, { status: 400 })
  if (!openAiApiKey) {
    return Response.json({ error: 'Missing OPEN_AI_API_KEY' }, { status: 500 })
  }

  // MCP READ ② — fetch live JD from Notion before every single message
  const job = await getJob(jobId)
  const system = interviewPrompt(job)

  const openAiMessages = [
    { role: 'system', content: system },
    ...(messages ?? []),
  ]

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      stream: true,
      messages: openAiMessages,
      max_tokens: 1024,
    }),
  })

  if (!response.ok || !response.body) {
    const errorText = await response.text()
    return Response.json(
      { error: `OpenAI request failed: ${errorText}` },
      { status: 502 },
    )
  }

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
