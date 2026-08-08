// lib/comments.ts
// Data access for comments. Thin wrappers over the SQLite connection.
import { getDb } from './db'

export interface Comment {
  id: number
  post_id: number
  author_id: number
  body: string
  created_at: string
  updated_at: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CommentList {
  comments: Comment[]
  pagination: Pagination
}

export function postExists(postId: number): boolean {
  return !!getDb().prepare('SELECT 1 FROM posts WHERE id = ?').get(postId)
}

export function userExists(userId: number): boolean {
  return !!getDb().prepare('SELECT 1 FROM users WHERE id = ?').get(userId)
}

export function createComment(input: {
  post_id: number
  author_id: number
  body: string
}): Comment {
  const db = getDb()
  const info = db
    .prepare('INSERT INTO comments (post_id, author_id, body) VALUES (?, ?, ?)')
    .run(input.post_id, input.author_id, input.body)
  return db
    .prepare('SELECT * FROM comments WHERE id = ?')
    .get(info.lastInsertRowid) as Comment
}

export function listComments(
  postId: number,
  page: number,
  limit: number
): CommentList {
  const db = getDb()
  const total = (
    db.prepare('SELECT COUNT(*) AS c FROM comments WHERE post_id = ?').get(postId) as {
      c: number
    }
  ).c
  const offset = (page - 1) * limit
  const comments = db
    .prepare(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC, id ASC LIMIT ? OFFSET ?'
    )
    .all(postId, limit, offset) as Comment[]

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    },
  }
}
