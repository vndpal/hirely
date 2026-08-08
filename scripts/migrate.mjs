// scripts/migrate.mjs
// Minimal forward-only migration runner.
// Applies every migrations/*.sql file, in filename order, exactly once.
import Database from 'better-sqlite3'
import { readdirSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'

const DB_PATH = process.env.DATABASE_PATH || 'data/hirely.db'
const MIGRATIONS_DIR = 'migrations'

const dir = dirname(DB_PATH)
if (dir && dir !== '.' && !existsSync(dir)) {
  mkdirSync(dir, { recursive: true })
}

const db = new Database(DB_PATH)
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    name       TEXT PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

const applied = new Set(
  db.prepare('SELECT name FROM schema_migrations').all().map((r) => r.name)
)

const files = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith('.sql'))
  .sort()

const record = db.prepare('INSERT INTO schema_migrations (name) VALUES (?)')

let count = 0
for (const file of files) {
  if (applied.has(file)) continue
  const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8')
  db.transaction(() => {
    db.exec(sql)
    record.run(file)
  })()
  console.log(`applied ${file}`)
  count++
}

console.log(count ? `\n${count} migration(s) applied.` : 'No pending migrations.')
db.close()
