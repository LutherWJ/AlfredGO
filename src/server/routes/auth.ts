import { Hono } from "hono";
import { setSignedCookie, deleteCookie } from "hono/cookie";
import { UserModel } from "../models/user";
import { CONFIG } from "../util/config";

const authRoutes = new Hono();

// Prototype Mock Auth Route
authRoutes.get("/dev-login", async (c) => {
  const sso_id = "mock-sso-123";
  
  let user = UserModel.findBySsoId(sso_id);

  if (!user) {
    user = UserModel.create({
      sso_id,
      email: "student@alfredstate.edu",
      display_name: "Mock Student",
      role: "student"
    });
  }

  // Use a signed cookie for the session ID
  await setSignedCookie(c, "session_id", user.id.toString(), CONFIG.COOKIE_SECRET, {
    path: "/",
    httpOnly: true,
    secure: CONFIG.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return c.html(`
    <div style="padding: 1rem; background-color: #d1fae5; color: #065f46; border-radius: 0.5rem; font-family: sans-serif;">
      <p>Logged in successfully (Signed) as <strong>${user.display_name}</strong> (${user.role}).</p>
      <a href="/" style="color: #2563eb; text-decoration: underline; margin-top: 0.5rem; display: inline-block;">Return to Directory</a>
    </div>
  `);
});

authRoutes.get("/logout", (c) => {
  deleteCookie(c, "session_id");
  return c.html(`
    <div style="padding: 1rem; background-color: #dbeafe; color: #1e40af; border-radius: 0.5rem; font-family: sans-serif;">
      <p>Logged out successfully.</p>
      <a href="/" style="color: #2563eb; text-decoration: underline; margin-top: 0.5rem; display: inline-block;">Return to Directory</a>
    </div>
  `);
});

export { authRoutes };
