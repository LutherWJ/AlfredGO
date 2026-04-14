import type { MiddlewareHandler } from "hono";

// Basic in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (options = { limit: 100, windowMs: 60000 }): MiddlewareHandler => {
  return async (c, next) => {
    // Determine the client IP. Check proxy headers first, fallback to remote address or a default string.
    const ip = c.req.header("x-forwarded-for") || "unknown-ip";
    const now = Date.now();

    let record = rateLimitMap.get(ip);
    
    // Create new record if none exists or window has expired
    if (!record || record.resetTime < now) {
      record = { count: 0, resetTime: now + options.windowMs };
    }

    record.count++;
    rateLimitMap.set(ip, record);

    if (record.count > options.limit) {
      return c.text("Too Many Requests", 429);
    }

    await next();
  };
};
