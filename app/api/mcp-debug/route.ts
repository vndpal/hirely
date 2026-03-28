import { listNotionTools } from '@/lib/mcp'

export async function GET() {
  try {
    const tools = await listNotionTools()
    return Response.json(tools, { status: 200 })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
