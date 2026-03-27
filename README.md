# Hirely

This project now uses OpenAI (ChatGPT) for interview generation and streaming responses.

## Environment variables

Set the following required environment variable:

- `OPEN_AI_API_KEY` — your OpenAI API key.

> `ANTHROPIC_API_KEY` is no longer used anywhere in this project.

## API behavior

- `app/api/chat/route.ts` calls OpenAI Chat Completions (`gpt-4o-mini`) with streaming enabled.
- The route injects the interview system prompt and the incoming user/assistant messages.
- If `OPEN_AI_API_KEY` is missing, the route returns a server error.
