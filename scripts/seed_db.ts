import { Database } from "bun:sqlite";
import { PATHS } from "../src/server/util/paths";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const db = new Database(PATHS.DB);

const ICONS: Record<string, string> = {
  Academics: "BookOpen",
  "Campus Life": "Coffee",
  Finance: "DollarSign",
  "IT Resources": "Monitor",
  "Career Services": "Briefcase",
  "Campus Resources": "Building2",
};

function parseCSV(content: string) {
  const lines = content.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parser handling quotes
    const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
    const matches = line.match(/"[^"]*"|[^,]+/g);
    
    if (matches) {
      const values = matches.map(v => v.trim().replace(/^"|"$/g, ''));
      data.push({
        category: values[0],
        name: values[1],
        description: values[2],
        url: values[3]
      });
    }
  }
  return data;
}

async function seed() {
  console.log("Seeding database...");

  // Clear tables
  db.run("DELETE FROM user_recent_services");
  db.run("DELETE FROM user_favorites");
  db.run("DELETE FROM services");
  db.run("DELETE FROM categories");
  
  // Reset autoincrement
  db.run("DELETE FROM sqlite_sequence WHERE name IN ('services', 'categories')");

  const csvPath = join(PATHS.DATA, "links.csv");
  const csvContent = readFileSync(csvPath, "utf-8");
  const links = parseCSV(csvContent);

  const categories = new Set(links.map((l) => l.category));
  const categoryMap: Record<string, number> = {};

  let sortOrder = 0;
  for (const catName of categories) {
    const icon = ICONS[catName] || "Link";
    const result = db.prepare(
      "INSERT INTO categories (name, icon_name, sort_order) VALUES (?, ?, ?) RETURNING id"
    ).get(catName, icon, sortOrder++) as { id: number };
    
    categoryMap[catName] = result.id;
  }

  for (const link of links) {
    db.prepare(
      "INSERT INTO services (category_id, name, description, url) VALUES (?, ?, ?, ?)"
    ).run(categoryMap[link.category], link.name, link.description, link.url);
  }

  console.log(`Seeded ${categories.size} categories and ${links.length} services.`);
}

seed().catch(console.error);
