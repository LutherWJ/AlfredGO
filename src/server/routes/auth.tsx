import { Hono } from "hono";
import { setSignedCookie, deleteCookie } from "hono/cookie";
import { UserModel } from "../models/user";
import { CONFIG } from "../util/config";
import { Login } from "../views/Login";

const authRoutes = new Hono();

// Prototype Mock Login Page
authRoutes.get("/login", (c) => {
  return c.render(<Login />, { title: 'Login - AlfredGo' });
});

// Prototype Mock Auth Logic
authRoutes.get("/dev-login", async (c) => {
  if (CONFIG.NODE_ENV === "production") {
    return c.text("Not Found", 404);
  }

  const role = c.req.query('role') === 'admin' ? 'admin' : 'student';
  const sso_id = `mock-sso-${role}`;
  
  let user = UserModel.findBySsoId(sso_id);

  if (!user) {
    user = UserModel.create({
      sso_id,
      email: `${role}@alfredstate.edu`,
      display_name: role === 'admin' ? "Mock Admin" : "Mock Student",
      role
    });
  }

  // Use a signed cookie for the session ID
  await setSignedCookie(c, "session_id", user.id.toString(), CONFIG.COOKIE_SECRET, {
    path: "/",
    httpOnly: true,
    secure: CONFIG.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return c.redirect('/');
});

authRoutes.get("/logout", (c) => {
  deleteCookie(c, "session_id", { path: '/' });
  return c.redirect('/auth/login');
});

export { authRoutes };
