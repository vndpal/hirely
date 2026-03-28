import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"

export async function callNotionTool(toolName: string, args: any) {
  const token = process.env.NOTION_API_KEY
  if (!token) {
    throw new Error("Missing NOTION_API_KEY environment variable")
  }

  // Use the official Notion MCP Streamable HTTP endpoint
  const transport = new StreamableHTTPClientTransport(
    new URL("https://mcp.notion.com/mcp"),
    {
      requestInit: {
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
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
    
    // Some MCP servers might have different naming conventions
    // Official Notion tools use notion-fetch, notion-create-pages, etc.
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
