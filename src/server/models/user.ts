import { db } from "../db";
import { UserSchema, type User, ServiceSchema, type Service } from "./schemas";
import type { Statement } from "bun:sqlite";

// Prepared Statements (Lazy Initialized)
let _selectUserBySsoIdStmt: Statement | null = null;
const getSelectUserBySsoIdStmt = () => (_selectUserBySsoIdStmt ??= db.prepare("SELECT * FROM users WHERE sso_id = ?"));

let _selectUserByIdStmt: Statement | null = null;
const getSelectUserByIdStmt = () => (_selectUserByIdStmt ??= db.prepare("SELECT * FROM users WHERE id = ?"));

let _insertUserStmt: Statement | null = null;
const getInsertUserStmt = () => (_insertUserStmt ??= db.prepare(`
  INSERT INTO users (sso_id, email, display_name, role)
  VALUES (?, ?, ?, ?)
  RETURNING *
`));

let _selectFavoritesStmt: Statement | null = null;
const getSelectFavoritesStmt = () => (_selectFavoritesStmt ??= db.prepare(`
  SELECT s.* FROM services s
  JOIN user_favorites f ON s.id = f.service_id
  WHERE f.user_id = ?
  ORDER BY f.created_at DESC
`));

let _selectRecentServicesStmt: Statement | null = null;
const getSelectRecentServicesStmt = () => (_selectRecentServicesStmt ??= db.prepare(`
  SELECT s.* FROM services s
  JOIN user_recent_services r ON s.id = r.service_id
  WHERE r.user_id = ?
  ORDER BY r.last_accessed DESC
  LIMIT 10
`));

let _upsertRecentServiceStmt: Statement | null = null;
const getUpsertRecentServiceStmt = () => (_upsertRecentServiceStmt ??= db.prepare(`
  INSERT INTO user_recent_services (user_id, service_id, last_accessed)
  VALUES (?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(user_id, service_id) DO UPDATE SET last_accessed = CURRENT_TIMESTAMP
`));

let _isFavoriteStmt: Statement | null = null;
const getIsFavoriteStmt = () => (_isFavoriteStmt ??= db.prepare("SELECT 1 FROM user_favorites WHERE user_id = ? AND service_id = ?"));

let _addFavoriteStmt: Statement | null = null;
const getAddFavoriteStmt = () => (_addFavoriteStmt ??= db.prepare("INSERT OR IGNORE INTO user_favorites (user_id, service_id) VALUES (?, ?)"));

let _removeFavoriteStmt: Statement | null = null;
const getRemoveFavoriteStmt = () => (_removeFavoriteStmt ??= db.prepare("DELETE FROM user_favorites WHERE user_id = ? AND service_id = ?"));

export const UserModel = {
  /**
   * Find a user by their SSO ID
   */
  findBySsoId(ssoId: string): User | null {
    const data = getSelectUserBySsoIdStmt().get(ssoId);
    if (!data) return null;
    return UserSchema.parse(data);
  },

  /**
   * Find a user by their internal Database ID
   */
  findById(id: string | number): User | null {
    const data = getSelectUserByIdStmt().get(id);
    if (!data) return null;
    return UserSchema.parse(data);
  },

  /**
   * Create a new user (or mock user for dev)
   */
  create(user: Omit<User, "id">): User {
    const data = getInsertUserStmt().get(
      user.sso_id,
      user.email,
      user.display_name,
      user.role
    );
    return UserSchema.parse(data);
  },

  /**
   * Get favorite services for a user
   */
  getFavorites(userId: number): Service[] {
    const data = getSelectFavoritesStmt().all(userId);
    return data.map(row => ServiceSchema.parse(row));
  },

  /**
   * Get recently accessed services for a user
   */
  getRecentServices(userId: number): Service[] {
    const data = getSelectRecentServicesStmt().all(userId);
    return data.map(row => ServiceSchema.parse(row));
  },

  /**
   * Record a service access for a user (upsert)
   */
  recordAccess(userId: number, serviceId: number): void {
    getUpsertRecentServiceStmt().run(userId, serviceId);
  },

  /**
   * Check if a service is favorited by a user
   */
  isFavorite(userId: number, serviceId: number): boolean {
    return getIsFavoriteStmt().get(userId, serviceId) !== null;
  },

  /**
   * Add a service to user favorites
   */
  addFavorite(userId: number, serviceId: number): void {
    getAddFavoriteStmt().run(userId, serviceId);
  },

  /**
   * Remove a service from user favorites
   */
  removeFavorite(userId: number, serviceId: number): void {
    getRemoveFavoriteStmt().run(userId, serviceId);
  }
};
