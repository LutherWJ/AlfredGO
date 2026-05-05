import { db } from "../db";
import { ServiceSchema, type Service } from "./schemas";
import type { Statement } from "bun:sqlite";

// Prepared Statements (Lazy Initialized)
let _selectServicesByCategoryIdStmt: Statement | null = null;
const getSelectServicesByCategoryIdStmt = () => (_selectServicesByCategoryIdStmt ??= db.prepare("SELECT * FROM services WHERE category_id = ? ORDER BY name ASC"));

let _searchServicesStmt: Statement | null = null;
const getSearchServicesStmt = () => (_searchServicesStmt ??= db.prepare("SELECT * FROM services WHERE name LIKE ? OR description LIKE ? ORDER BY name ASC"));

let _selectServiceByIdStmt: Statement | null = null;
const getSelectServiceByIdStmt = () => (_selectServiceByIdStmt ??= db.prepare("SELECT * FROM services WHERE id = ?"));

let _insertServiceStmt: Statement | null = null;
const getInsertServiceStmt = () => (_insertServiceStmt ??= db.prepare(`
  INSERT INTO services (category_id, name, description, url)
  VALUES (?, ?, ?, ?)
  RETURNING *
`));

let _updateServiceStmt: Statement | null = null;
const getUpdateServiceStmt = () => (_updateServiceStmt ??= db.prepare(`
  UPDATE services 
  SET category_id = ?, name = ?, description = ?, url = ?, date_modified = CURRENT_TIMESTAMP
  WHERE id = ?
  RETURNING *
`));

let _deleteServiceStmt: Statement | null = null;
const getDeleteServiceStmt = () => (_deleteServiceStmt ??= db.prepare("DELETE FROM services WHERE id = ?"));

export const ServiceModel = {
  findByCategory(categoryId: number | string): Service[] {
    const data = getSelectServicesByCategoryIdStmt().all(categoryId);
    return data.map(row => ServiceSchema.parse(row));
  },

  search(query: string): Service[] {
    const searchTerm = `%${query}%`;
    const data = getSearchServicesStmt().all(searchTerm, searchTerm);
    return data.map(row => ServiceSchema.parse(row));
  },

  findById(id: number | string): Service | null {
    const data = getSelectServiceByIdStmt().get(id);
    if (!data) return null;
    return ServiceSchema.parse(data);
  },

  findAll(): Service[] {
    const data = db.prepare("SELECT * FROM services ORDER BY name ASC").all();
    return data.map(row => ServiceSchema.parse(row));
  },

  create(service: Omit<Service, "id" | "date_created" | "date_modified">): Service {
    const data = getInsertServiceStmt().get(
      service.category_id ?? null,
      service.name,
      service.description ?? null,
      service.url
    );
    return ServiceSchema.parse(data);
  },

  update(id: number | string, service: Partial<Omit<Service, "id" | "date_created" | "date_modified">>): Service | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const data = getUpdateServiceStmt().get(
      service.category_id ?? existing.category_id,
      service.name ?? existing.name,
      service.description ?? existing.description,
      service.url ?? existing.url,
      id
    );
    if (!data) return null;
    return ServiceSchema.parse(data);
  },

  delete(id: number | string): boolean {
    const info = getDeleteServiceStmt().run(id);
    return info.changes > 0;
  }
};
