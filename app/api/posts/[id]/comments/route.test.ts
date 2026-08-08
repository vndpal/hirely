// app/api/posts/[id]/comments/route.test.ts
import { beforeAll, describe, expect, it } from 'vitest'
import { setupTestDb } from '@/test/helpers/db'

let postId: number
let userId: number

beforeAll(() => {
  ;({ postId, userId } = setupTestDb())
})

// Imported after setupTestDb has set DATABASE_PATH — the handlers open the DB
// lazily on first call, so a static import here is fine.
import { GET, POST } from './route'

function postReq(id: number | string, payload: unknown) {
  return new Request(`http://test/api/posts/${id}/comments`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

function getReq(id: number | string, query = '') {
  return new Request(`http://test/api/posts/${id}/comments${query}`)
}

describe('POST /posts/:id/comments', () => {
  it('creates a comment and returns 201', async () => {
    const res = await POST(postReq(postId, { author_id: userId, body: 'Hello' }), {
      params: { id: String(postId) },
    })
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json).toMatchObject({
      post_id: postId,
      author_id: userId,
      body: 'Hello',
    })
    expect(json.id).toBeGreaterThan(0)
    expect(json.created_at).toBeTruthy()
  })

  it('rejects an empty body with 400', async () => {
    const res = await POST(postReq(postId, { author_id: userId, body: '   ' }), {
      params: { id: String(postId) },
    })
    expect(res.status).toBe(400)
  })

  it('rejects a missing author_id with 400', async () => {
    const res = await POST(postReq(postId, { body: 'No author' }), {
      params: { id: String(postId) },
    })
    expect(res.status).toBe(400)
  })

  it('returns 404 when the post does not exist', async () => {
    const res = await POST(postReq(9999, { author_id: userId, body: 'Hi' }), {
      params: { id: '9999' },
    })
    expect(res.status).toBe(404)
  })

  it('returns 404 when the author does not exist', async () => {
    const res = await POST(postReq(postId, { author_id: 9999, body: 'Hi' }), {
      params: { id: String(postId) },
    })
    expect(res.status).toBe(404)
  })

  it('returns 400 for a non-numeric post id', async () => {
    const res = await POST(postReq('abc', { author_id: userId, body: 'Hi' }), {
      params: { id: 'abc' },
    })
    expect(res.status).toBe(400)
  })
})

describe('GET /posts/:id/comments', () => {
  it('paginates the comment list', async () => {
    // Seed a handful of comments.
    for (let i = 0; i < 5; i++) {
      await POST(postReq(postId, { author_id: userId, body: `c${i}` }), {
        params: { id: String(postId) },
      })
    }

    const res = await GET(getReq(postId, '?page=1&limit=2'), {
      params: { id: String(postId) },
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.comments).toHaveLength(2)
    expect(json.pagination.limit).toBe(2)
    expect(json.pagination.page).toBe(1)
    expect(json.pagination.total).toBeGreaterThanOrEqual(5)
    expect(json.pagination.totalPages).toBe(
      Math.ceil(json.pagination.total / 2)
    )
  })

  it('returns a later page with the remaining items', async () => {
    const res = await GET(getReq(postId, '?page=2&limit=2'), {
      params: { id: String(postId) },
    })
    const json = await res.json()
    expect(json.pagination.page).toBe(2)
    expect(json.comments.length).toBeGreaterThan(0)
  })

  it('returns 404 for a missing post', async () => {
    const res = await GET(getReq(9999), { params: { id: '9999' } })
    expect(res.status).toBe(404)
  })
})
