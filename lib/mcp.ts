import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"

const MCP_BASE = "https://mcp.notion.com"

// In-memory cache for the access token
let cachedAccessToken: string | null = null
let tokenExpiresAt = 0

async function getAccessToken(): Promise<string> {
  // If cached token is still valid (with 60s buffer), reuse it
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedAccessToken
  }

  const refreshToken = process.env.NOTION_MCP_REFRESH_TOKEN
  const clientId = process.env.NOTION_MCP_CLIENT_ID

  // If we have a refresh token, use it to get a fresh access token
  if (refreshToken && clientId) {
    const res = await fetch(`${MCP_BASE}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        refresh_token: refreshToken,
      }),
    })

    if (!res.ok) {
      throw new Error(`Token refresh failed (${res.status}): ${await res.text()}`)
    }

    const data = await res.json()
    cachedAccessToken = data.access_token
    tokenExpiresAt = Date.now() + data.expires_in * 1000
    return cachedAccessToken!
  }

  // Fallback: use a pre-set access token (short-lived, for dev/testing)
  const accessToken = process.env.NOTION_MCP_ACCESS_TOKEN
  if (accessToken) {
    return accessToken
  }

  throw new Error(
    "Missing Notion MCP credentials. Run: node scripts/notion-mcp-auth.mjs"
  )
}

export async function callNotionTool(toolName: string, args: any) {
  const token = await getAccessToken()

  const transport = new StreamableHTTPClientTransport(
    new URL(`${MCP_BASE}/mcp`),
    {
      requestInit: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  )

  const client = new Client(
    { name: "hirely-mcp-client", version: "1.0.0" },
    { capabilities: {} }
  )

  try {
    await client.connect(transport)

    const response = await client.callTool({
      name: toolName,
      arguments: args,
    })

    if (response.isError) {
      throw new Error(`MCP Tool Error (${toolName}): ${JSON.stringify(response.content)}`)
    }

    return response.content
  } finally {
    await client.close()
  }
}
