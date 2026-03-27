import { createOpenAI } from '@ai-sdk/openai'
import { convertToModelMessages, streamText } from 'ai'
import { getJob } from '@/lib/notion'
import { interviewPrompt } from '@/lib/prompts'

function getJobIdFromReferrer(referrer: string | null): string | null {
  if (!referrer) return null

  try {
    const url = new URL(referrer)
    const segments = url.pathname.split('/').filter(Boolean)
    const applyIdx = segments.indexOf('apply')
    if (applyIdx >= 0 && segments[applyIdx + 1]) {
      return segments[applyIdx + 1]
    }
  } catch {
    return null
  }

  return null
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const messages = body.messages || []

  const jobIdFromBody = typeof body.jobId === 'string' ? body.jobId : null
  const jobIdFromHeader = req.headers.get('x-job-id')
  const jobIdFromReferrer = getJobIdFromReferrer(req.headers.get('referer'))

  const jobId = jobIdFromBody || jobIdFromHeader || jobIdFromReferrer

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
  const job = await getJob(jobId)
  const system = interviewPrompt(job)

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system,
    messages: await convertToModelMessages(messages),
  })

  return result.toTextStreamResponse()
}
