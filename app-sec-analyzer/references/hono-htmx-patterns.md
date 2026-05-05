# Hono & HTMX Security Patterns

## Hono Security Best Practices

### 1. Middleware & Headers
Always use `secureHeaders()` and `csrf()` middleware.
```typescript
import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import { csrf } from 'hono/csrf'

const app = new Hono()
app.use('*', secureHeaders())
app.use('*', csrf())
```

### 2. Input Validation (Zod)
Never trust `c.req.param()`, `c.req.query()`, or `c.req.parseBody()` without validation. Use `@hono/zod-validator`.
```typescript
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

app.post('/api/user', zValidator('form', z.object({
  email: z.string().email(),
  age: z.number().min(18)
})), (c) => {
  const data = c.req.valid('form')
  // ...
})
```

### 3. Session Management
- Use `getSignedCookie` and `setSignedCookie` with a strong secret.
- Set `httpOnly: true`, `secure: true` (in production), and `sameSite: 'Strict'`.

## HTMX Security Best Practices

### 1. XSS in Hypermedia
HTMX swaps HTML fragments. If user-generated content is injected into these fragments without escaping, it leads to XSS.
- **Rule:** Always escape data before rendering fragments. Hono's JSX/html template literal escapes by default, but be careful with `raw()`.

### 2. Request Forgery
HTMX requests (`hx-post`, `hx-put`, etc.) must be verified. Hono's `csrf()` middleware checks the `Origin` or `Referer` headers, which HTMX sends by default.

### 3. Response Splitting
Ensure headers like `HX-Redirect` or `HX-Push-Url` are not set with unvalidated user input to prevent open redirects or header injection.

## Bun & SQLite Security

### 1. Parameterized Queries
Always use placeholders (`?` or `$name`) with `bun:sqlite`.
```typescript
// SECURE
db.prepare("SELECT * FROM users WHERE id = ?").get(userId);

// INSECURE
db.run(`INSERT INTO logs VALUES ('${userInput}')`); 
```

### 2. File Permissions
SQLite files should be owned by the app user with `600` permissions.
