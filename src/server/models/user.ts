import { db } from "../db";
import { UserSchema, type User } from "./schemas";

// Prepared Statements at Module Level
const selectUserBySsoIdStmt = db.prepare("SELECT * FROM users WHERE sso_id = ?");
const selectUserByIdStmt = db.prepare("SELECT * FROM users WHERE id = ?");
const insertUserStmt = db.prepare(`
  INSERT INTO users (sso_id, email, display_name, role)
  VALUES (?, ?, ?, ?)
  RETURNING *
`);

export const UserModel = {
  /**
   * Find a user by their SSO ID
   */
  findBySsoId(ssoId: string): User | null {
    const data = selectUserBySsoIdStmt.get(ssoId);
    if (!data) return null;
    return UserSchema.parse(data);
  },

  /**
   * Find a user by their internal Database ID
   */
  findById(id: string | number): User | null {
    const data = selectUserByIdStmt.get(id);
    if (!data) return null;
    return UserSchema.parse(data);
  },

  /**
   * Create a new user (or mock user for dev)
   */
  create(user: Omit<User, "id">): User {
    const data = insertUserStmt.get(
      user.sso_id,
      user.email,
      user.display_name,
      user.role
    );
    return UserSchema.parse(data);
  }
};
