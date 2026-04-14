import { Database } from "bun:sqlite";
import { mkdir } from "node:fs/promises";
import { PATHS } from "../util/paths";

// Database Singleton
export const db = new Database(PATHS.DB);

export async function initDb() {
  try {
    await mkdir(PATHS.DATA, { recursive: true });
  } catch (e) {}

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sso_id TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student'
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon_name TEXT,
      sort_order INTEGER DEFAULT 0
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      name TEXT NOT NULL,
      description TEXT,
      url TEXT NOT NULL,
      date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
      date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );
  `);

  console.log("Database initialized at:", PATHS.DB);
}
