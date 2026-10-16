// Applies src/db/schema.sql to the database.
// Idempotent: uses IF NOT EXISTS so it can be run repeatedly.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from '../db/pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, '..', 'db', 'schema.sql');

async function migrate() {
  const sql = readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
  console.log('✅ Schema applied');
}

migrate()
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
