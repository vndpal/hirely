// app/api/posts/[id]/comments/route.ts
import {
  createComment,
  listComments,
  postExists,
  userExists,
} from '@/lib/comments'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

function parsePositiveInt(value: unknown): number | null {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : null
}

// GET /posts/:id/comments — list comments for a post, paginated.
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const postId = parsePositiveInt(params.id)
  if (postId === null) {
    return Response.json({ error: 'Invalid post id' }, { status: 400 })
  }
  if (!postExists(postId)) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }

  const url = new URL(req.url)
  const page = parsePositiveInt(url.searchParams.get('page')) ?? 1
  const rawLimit = parsePositiveInt(url.searchParams.get('limit')) ?? DEFAULT_LIMIT
  const limit = Math.min(rawLimit, MAX_LIMIT)

  return Response.json(listComments(postId, page, limit))
}

// POST /posts/:id/comments — create a comment on a post.
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const postId = parsePositiveInt(params.id)
  if (postId === null) {
    return Response.json({ error: 'Invalid post id' }, { status: 400 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const authorId = parsePositiveInt((body as Record<string, unknown>).author_id)
  const text =
    typeof (body as Record<string, unknown>).body === 'string'
      ? ((body as Record<string, unknown>).body as string).trim()
      : ''

  if (authorId === null) {
    return Response.json(
      { error: 'author_id is required and must be a positive integer' },
      { status: 400 }
    )
  }
  if (!text) {
    return Response.json({ error: 'body is required' }, { status: 400 })
  }

  if (!postExists(postId)) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }
  if (!userExists(authorId)) {
    return Response.json({ error: 'Author not found' }, { status: 404 })
  }

  const comment = createComment({
    post_id: postId,
    author_id: authorId,
    body: text,
  })
  return Response.json(comment, { status: 201 })
}
