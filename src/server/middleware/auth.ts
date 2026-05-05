import type { MiddlewareHandler } from "hono";
import { getSignedCookie } from "hono/cookie";
import { UserModel } from "../models/user";
import { CONFIG } from "../util/config";

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const sessionId = await getSignedCookie(c, CONFIG.COOKIE_SECRET, "session_id");

  if (!sessionId) {
    return c.redirect("/auth/login");
  }

  const user = UserModel.findById(sessionId);

  if (!user) {
    return c.redirect("/auth/login");
  }

  // Bind the validated user to the request context
  c.set("user", user);
  await next();
};

export const requireAdmin: MiddlewareHandler = async (c, next) => {
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    return c.text("Forbidden - Admins Only", 403);
  }
  await next();
};
