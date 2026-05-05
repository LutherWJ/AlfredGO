import { db } from "../db";
import { CategorySchema, type Category } from "./schemas";
import type { Statement } from "bun:sqlite";

// Prepared Statements (Lazy Initialized)
let _selectAllCategoriesStmt: Statement | null = null;
const getSelectAllCategoriesStmt = () => (_selectAllCategoriesStmt ??= db.prepare(`
  SELECT c.*, COUNT(s.id) as service_count 
  FROM categories c 
  LEFT JOIN services s ON c.id = s.category_id 
  GROUP BY c.id 
  ORDER BY c.sort_order DESC, c.name ASC
`));

let _selectCategoryByIdStmt: Statement | null = null;
const getSelectCategoryByIdStmt = () => (_selectCategoryByIdStmt ??= db.prepare("SELECT * FROM categories WHERE id = ?"));

let _insertCategoryStmt: Statement | null = null;
const getInsertCategoryStmt = () => (_insertCategoryStmt ??= db.prepare(`
  INSERT INTO categories (name, icon_name, sort_order)
  VALUES (?, ?, ?)
  RETURNING *
`));

let _updateCategoryStmt: Statement | null = null;
const getUpdateCategoryStmt = () => (_updateCategoryStmt ??= db.prepare(`
  UPDATE categories 
  SET name = ?, icon_name = ?, sort_order = ?
  WHERE id = ?
  RETURNING *
`));

let _deleteCategoryStmt: Statement | null = null;
const getDeleteCategoryStmt = () => (_deleteCategoryStmt ??= db.prepare("DELETE FROM categories WHERE id = ?"));

export type CategoryWithCount = Category & { service_count: number };

export const CategoryModel = {
  findAll(): CategoryWithCount[] {
    const data = getSelectAllCategoriesStmt().all();
    return data.map(row => ({
      ...CategorySchema.parse(row),
      service_count: (row as any).service_count
    }));
  },

  findById(id: number | string): Category | null {
    const data = getSelectCategoryByIdStmt().get(id);
    if (!data) return null;
    return CategorySchema.parse(data);
  },

  create(category: Omit<Category, "id">): Category {
    const data = getInsertCategoryStmt().get(
      category.name,
      category.icon_name ?? null,
      category.sort_order
    );
    return CategorySchema.parse(data);
  },

  update(id: number | string, category: Partial<Omit<Category, "id">>): Category | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const data = getUpdateCategoryStmt().get(
      category.name ?? existing.name,
      category.icon_name ?? existing.icon_name,
      category.sort_order ?? existing.sort_order,
      id
    );
    if (!data) return null;
    return CategorySchema.parse(data);
  },

  delete(id: number | string): boolean {
    const info = getDeleteCategoryStmt().run(id);
    return info.changes > 0;
  }
};
