// lib/db.ts
// Single shared SQLite connection for the app.
import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

function dbPath(): string {
  return process.env.DATABASE_PATH || 'data/hirely.db'
}

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (db) return db

  const path = dbPath()
  const dir = dirname(path)
  if (dir && dir !== '.' && !existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  db = new Database(path)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  return db
}
