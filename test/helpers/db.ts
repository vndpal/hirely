// test/helpers/db.ts
// Spin up an isolated, migrated SQLite database for a test run.
import { mkdtempSync, readdirSync, readFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { getDb } from '@/lib/db'

// Points DATABASE_PATH at a fresh temp DB, then migrates and seeds it through
// the app's own getDb() singleton — so the route handlers under test share the
// very same connection. Must run before any handler calls getDb().
export function setupTestDb() {
  const dir = mkdtempSync(join(tmpdir(), 'hirely-test-'))
  const dbPath = join(dir, 'test.db')
  process.env.DATABASE_PATH = dbPath

  const db = getDb()

  const migrations = readdirSync('migrations')
    .filter((f) => f.endsWith('.sql'))
    .sort()
  for (const file of migrations) {
    db.exec(readFileSync(join('migrations', file), 'utf8'))
  }

  const postId = Number(
    db.prepare("INSERT INTO posts (title) VALUES ('Seed post')").run()
      .lastInsertRowid
  )
  const userId = Number(
    db.prepare("INSERT INTO users (name) VALUES ('Seed user')").run()
      .lastInsertRowid
  )

  return { dbPath, postId, userId }
}
