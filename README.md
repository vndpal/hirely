# Hirely

This project uses OpenAI (ChatGPT) for interview generation and streaming responses.

## Environment variable

Set the following required environment variable:

- `OPEN_AI_API_KEY` — your OpenAI API key.

## API behavior

- `app/api/interview/route.ts` calls OpenAI Chat Completions (`gpt-4o-mini`) with streaming enabled.
- The route injects the interview system prompt and the incoming user/assistant messages.
- If `OPEN_AI_API_KEY` is missing, the route returns a server error.
