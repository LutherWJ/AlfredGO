import { Database } from "bun:sqlite";
import { mkdir, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PATHS } from "../util/paths";
import { logger } from "../util/logger";

// Database Singleton
export const db = new Database(PATHS.DB);
db.run("PRAGMA foreign_keys = ON;");
db.run("PRAGMA journal_mode = WAL;");

// Creates SQLite connection and checks for migrations
export async function initDb() {
  try {
    await mkdir(PATHS.DATA, { recursive: true });
  } catch (e) {}

  db.run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const migrationsDir = join(import.meta.dir, "migrations");
  const files = (await readdir(migrationsDir))
    .filter(f => f.endsWith(".sql"))
    .sort();

  const applied = new Set(
    db.query("SELECT name FROM _migrations").all().map((m: any) => m.name)
  );

  for (const file of files) {
    if (!applied.has(file)) {
      logger.info({ file }, "Applying database migration");
      const sql = await readFile(join(migrationsDir, file), "utf8");
      
      // Execute migration in a transaction
      const transaction = db.transaction(() => {
        db.run(sql);
        db.run("INSERT INTO _migrations (name) VALUES (?)", [file]);
      });

      try {
        transaction();
        logger.info({ file }, "Successfully applied migration");
      } catch (err) {
        logger.error({ err, file }, "Failed to apply migration");
        throw err; // Stop startup if migration fails
      }
    }
  }
}
