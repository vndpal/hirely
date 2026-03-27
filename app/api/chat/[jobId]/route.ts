// app/api/chat/[jobId]/route.ts
import { createOpenAI } from '@ai-sdk/openai'
import { streamText, convertToModelMessages } from 'ai'
import { getJob } from '@/lib/notion'
import { interviewPrompt } from '@/lib/prompts'

export async function POST(req: Request, { params }: { params: { jobId: string } }) {
  const { jobId } = params
  const body = await req.json().catch(() => ({}))
  const messages = body.messages || []

  console.log("Chat API Request (Dynamic Path):", { jobId, hasMessages: !!messages.length })

  if (!jobId || jobId === 'undefined') {
    return Response.json({ error: 'Missing jobId' }, { status: 400 })
  }
  
  if (!messages.length) {
    return Response.json({ error: 'Missing messages' }, { status: 400 })
  }

  const openAiApiKey = process.env.OPEN_AI_API_KEY
  if (!openAiApiKey) {
    return Response.json({ error: 'Missing OPEN_AI_API_KEY' }, { status: 500 })
  }

  const openai = createOpenAI({ apiKey: openAiApiKey })

  // MCP READ ② — fetch live JD from Notion before every single message
  const job = await getJob(jobId)
  const system = interviewPrompt(job)

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system,
    messages: await convertToModelMessages(messages),
  })

  // useChat (AI SDK 6) expects a UI message stream, not a raw text stream.
  return result.toUIMessageStreamResponse({ originalMessages: messages })
}
