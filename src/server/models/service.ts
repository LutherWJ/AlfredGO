import { db } from "../db";
import { ServiceSchema, type Service } from "./schemas";

const selectServicesByCategoryIdStmt = db.prepare("SELECT * FROM services WHERE category_id = ? ORDER BY name ASC");
const searchServicesStmt = db.prepare("SELECT * FROM services WHERE name LIKE ? OR description LIKE ? ORDER BY name ASC");
const selectServiceByIdStmt = db.prepare("SELECT * FROM services WHERE id = ?");
const insertServiceStmt = db.prepare(`
  INSERT INTO services (category_id, name, description, url)
  VALUES (?, ?, ?, ?)
  RETURNING *
`);

export const ServiceModel = {
  findByCategory(categoryId: number | string): Service[] {
    const data = selectServicesByCategoryIdStmt.all(categoryId);
    return data.map(row => ServiceSchema.parse(row));
  },

  search(query: string): Service[] {
    const searchTerm = `%${query}%`;
    const data = searchServicesStmt.all(searchTerm, searchTerm);
    return data.map(row => ServiceSchema.parse(row));
  },

  findById(id: number | string): Service | null {
    const data = selectServiceByIdStmt.get(id);
    if (!data) return null;
    return ServiceSchema.parse(data);
  },

  create(service: Omit<Service, "id" | "date_created" | "date_modified">): Service {
    const data = insertServiceStmt.get(
      service.category_id ?? null,
      service.name,
      service.description ?? null,
      service.url
    );
    return ServiceSchema.parse(data);
  }
};
