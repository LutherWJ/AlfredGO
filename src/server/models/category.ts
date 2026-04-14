import { db } from "../db";
import { CategorySchema, type Category } from "./schemas";

const selectAllCategoriesStmt = db.prepare("SELECT * FROM categories ORDER BY sort_order ASC, name ASC");
const selectCategoryByIdStmt = db.prepare("SELECT * FROM categories WHERE id = ?");
const insertCategoryStmt = db.prepare(`
  INSERT INTO categories (name, icon_name, sort_order)
  VALUES (?, ?, ?)
  RETURNING *
`);

export const CategoryModel = {
  findAll(): Category[] {
    const data = selectAllCategoriesStmt.all();
    return data.map(row => CategorySchema.parse(row));
  },

  findById(id: number | string): Category | null {
    const data = selectCategoryByIdStmt.get(id);
    if (!data) return null;
    return CategorySchema.parse(data);
  },

  create(category: Omit<Category, "id">): Category {
    const data = insertCategoryStmt.get(
      category.name,
      category.icon_name ?? null,
      category.sort_order
    );
    return CategorySchema.parse(data);
  }
};
