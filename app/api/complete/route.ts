// app/api/complete/route.ts
export async function POST(req: Request) {
  const { transcript, jobId } = await req.json()
 
  // Post transcript to n8n for scoring and Notion write-back
  const webhook = process.env.N8N_TRANSCRIPT_WEBHOOK
  if (!webhook) return Response.json({ error: 'No webhook' }, { status: 500 })
 
  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, jobId }),
  })
 
  return Response.json({ ok: true })
}
