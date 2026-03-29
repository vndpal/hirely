# Hirely

> Post jobs in Notion. AI runs the interviews.

Hirely is an AI-first hiring workflow built on **Next.js + Notion MCP**. It lets teams publish roles from Notion, run candidate chat interviews automatically, and write scored candidate summaries back to Notion for fast decision-making.

## What Hirely does

- **For HR teams**: publish jobs from Notion and share one interview link.
- **For candidates**: apply through a conversational interview experience (no long forms).
- **For hiring managers**: review structured candidate cards (match score, skill signals, salary fit, summary) directly in Notion.

## Core workflow

1. **Define role in Notion** (title, required skills, experience, salary range, threshold).
2. **Publish role** and share the generated interview link.
3. **AI interviews candidates** with job-aware questions sourced live from Notion.
4. **Transcript is sent to n8n** for scoring.
5. **Candidate card is written to Notion** with key decision data.

## Architecture

```text
Notion (Jobs + Candidates DB)
        ↑             ↓
      MCP read      MCP write
        │             │
      Hirely (Next.js on Vercel)
                ↓
              n8n webhook (scoring + automation)
```

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18
- **LLM runtime**: Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai`)
- **LLM provider**: OpenAI (`gpt-4o-mini`)
- **Data layer**: Notion MCP server (`mcp.notion.com`)
- **Automation**: n8n webhook for transcript scoring/write-back orchestration

## Repository structure

```text
app/
  page.tsx                     # Landing page
  apply/[jobId]/page.tsx       # Candidate interview chat UI
  api/chat/route.ts            # Chat endpoint (jobId via body/header/referrer)
  api/chat/[jobId]/route.ts    # Chat endpoint (jobId in path)
  api/complete/route.ts        # Sends transcript to n8n
lib/
  mcp.ts                       # Notion MCP auth + tool invocation
  notion.ts                    # Job read + candidate write helpers
  prompts.ts                   # Interview/scoring prompt templates
scripts/
  notion-mcp-auth.mjs          # One-time Notion MCP OAuth helper
```

## Quick start

### 1) Clone and install

```bash
git clone <your-fork-or-repo-url>
cd hirely
npm install
```

### 2) Configure environment

Create `.env.local` in repo root:

```bash
OPEN_AI_API_KEY=
NOTION_MCP_CLIENT_ID=
NOTION_MCP_ACCESS_TOKEN=
NOTION_MCP_REFRESH_TOKEN=
NOTION_CANDIDATES_DB_ID=
N8N_TRANSCRIPT_WEBHOOK=
```

### 3) Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `OPEN_AI_API_KEY` | Yes | OpenAI API key used by chat endpoints. |
| `NOTION_MCP_CLIENT_ID` | Yes (recommended) | OAuth client id for refreshing Notion MCP tokens. |
| `NOTION_MCP_REFRESH_TOKEN` | Yes (recommended) | Long-lived token used to fetch fresh MCP access tokens. |
| `NOTION_MCP_ACCESS_TOKEN` | Optional fallback | Direct short-lived access token for local testing. |
| `NOTION_CANDIDATES_DB_ID` | Yes | Notion database id where candidate cards are created. |
| `N8N_TRANSCRIPT_WEBHOOK` | Yes | n8n endpoint that receives transcript + jobId after interview completion. |

## Notion MCP setup

Run the one-time OAuth helper:

```bash
node scripts/notion-mcp-auth.mjs
```

The script registers a client, opens browser auth, exchanges code for tokens, and prints values to copy into `.env.local`.

## API endpoints

### `POST /api/chat/[jobId]`
Primary interview endpoint.

- Reads live role details from Notion via MCP
- Builds role-specific interview system prompt
- Streams AI responses back to client

Request body (simplified):

```json
{
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

### `POST /api/chat`
Compatibility endpoint. Resolves `jobId` from request body, `x-job-id` header, or referrer path.

### `POST /api/complete`
Sends final transcript to n8n webhook:

```json
{
  "transcript": "...",
  "jobId": "..."
}
```

## Prompting and interview behavior

The interview prompt enforces a structured first-round flow:

- warm intro + candidate context
- targeted technical screening (3–5 questions)
- short practical scenario
- logistics collection (salary, availability, email)
- polite close with `[SESSION_COMPLETE]` tag

When the session completes in the UI, Hirely forwards transcript data to `/api/complete` for downstream scoring and Notion write-back.

## Production deployment

Hirely is designed for deployment on **Vercel**.

Recommended steps:

1. Create a Vercel project from this repository.
2. Add all environment variables from the table above.
3. Deploy.
4. Test one full flow: publish role → complete interview → verify candidate card in Notion.

## Operational notes

- Token handling in `lib/mcp.ts` prefers refresh-token based access-token rotation.
- Job requirements are fetched live before each interview request to avoid stale role context.
- Candidate creation requires a correctly configured Notion database schema.

## Roadmap ideas

- Add linting/formatting/test scripts and CI checks
- Add typed shared contracts for API request/response payloads
- Add first-class observability for interview/session outcomes
- Add sample Notion database template export

## Contributing

1. Fork the repo and create a feature branch.
2. Make focused changes with clear commit messages.
3. Test locally (`npm run dev`, complete an end-to-end flow).
4. Open a PR describing user impact and setup notes.

## License

Add a `LICENSE` file (MIT/Apache-2.0/etc.) before open-source distribution.
