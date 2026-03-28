/**
 * One-time OAuth setup script for Notion MCP server.
 *
 * Run:  node scripts/notion-mcp-auth.mjs
 *
 * This will:
 *  1. Register a dynamic OAuth client with mcp.notion.com
 *  2. Open your browser for authorization
 *  3. Capture the callback and exchange for tokens
 *  4. Print the tokens — store them in your .env.local / Vercel env vars
 */

import http from "node:http"
import crypto from "node:crypto"
import { execSync } from "node:child_process"

const MCP_BASE = "https://mcp.notion.com"
const LOCAL_PORT = 9876
const REDIRECT_URI = `http://localhost:${LOCAL_PORT}/callback`

// --- helpers ---
function base64url(buf) {
  return buf.toString("base64url")
}

function generatePKCE() {
  const verifier = base64url(crypto.randomBytes(32))
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest())
  return { verifier, challenge }
}

function openBrowser(url) {
  try {
    const cmd =
      process.platform === "win32" ? `start "" "${url}"` :
      process.platform === "darwin" ? `open "${url}"` :
      `xdg-open "${url}"`
    execSync(cmd)
  } catch {
    console.log(`\nOpen this URL manually:\n${url}\n`)
  }
}

// --- step 1: dynamic client registration ---
async function registerClient() {
  const res = await fetch(`${MCP_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_name: "hirely-mcp-client",
      redirect_uris: [REDIRECT_URI],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",   // public client
    }),
  })
  if (!res.ok) throw new Error(`Registration failed: ${res.status} ${await res.text()}`)
  return res.json()
}

// --- step 2+3: authorize + capture code ---
function waitForCode(clientId, pkce) {
  return new Promise((resolve, reject) => {
    const state = base64url(crypto.randomBytes(16))

    const authUrl = new URL(`${MCP_BASE}/authorize`)
    authUrl.searchParams.set("client_id", clientId)
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI)
    authUrl.searchParams.set("response_type", "code")
    authUrl.searchParams.set("code_challenge", pkce.challenge)
    authUrl.searchParams.set("code_challenge_method", "S256")
    authUrl.searchParams.set("state", state)

    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, `http://localhost:${LOCAL_PORT}`)
      if (url.pathname !== "/callback") {
        res.writeHead(404); res.end(); return
      }

      const code = url.searchParams.get("code")
      const returnedState = url.searchParams.get("state")

      if (returnedState !== state) {
        res.writeHead(400); res.end("State mismatch"); reject(new Error("state mismatch")); return
      }

      res.writeHead(200, { "Content-Type": "text/html" })
      res.end("<h2>Authorization successful! You can close this tab.</h2>")
      server.close()
      resolve(code)
    })

    server.listen(LOCAL_PORT, () => {
      console.log(`\nOpening browser for Notion authorization...\n`)
      openBrowser(authUrl.toString())
    })
  })
}

// --- step 4: exchange code for tokens ---
async function exchangeCode(clientId, code, pkce) {
  const res = await fetch(`${MCP_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: pkce.verifier,
    }),
  })
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`)
  return res.json()
}

// --- main ---
async function main() {
  console.log("=== Notion MCP OAuth Setup ===\n")

  console.log("1. Registering OAuth client...")
  const client = await registerClient()
  console.log(`   Client ID: ${client.client_id}`)

  const pkce = generatePKCE()

  console.log("2. Waiting for browser authorization...")
  const code = await waitForCode(client.client_id, pkce)

  console.log("3. Exchanging code for tokens...")
  const tokens = await exchangeCode(client.client_id, code, pkce)

  console.log("\n=== SUCCESS ===\n")
  console.log("Add these to your .env.local and Vercel environment variables:\n")
  console.log(`NOTION_MCP_CLIENT_ID=${client.client_id}`)
  console.log(`NOTION_MCP_ACCESS_TOKEN=${tokens.access_token}`)
  console.log(`NOTION_MCP_REFRESH_TOKEN=${tokens.refresh_token}`)
  console.log()
  console.log(`Access token expires in: ${tokens.expires_in} seconds`)
  console.log("The app will auto-refresh using the refresh token.\n")
}

main().catch((err) => {
  console.error("Error:", err.message)
  process.exit(1)
})
