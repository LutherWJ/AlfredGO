# Application Security Review Checklist

## 1. Authentication & Authorization
- [ ] Is there a secure login flow?
- [ ] Are passwords hashed (if stored)? (Note: Prefer SSO/OIDC for BETH stack).
- [ ] Are sessions protected with signed, HTTP-only, secure cookies?
- [ ] Is RBAC (Role-Based Access Control) enforced on all sensitive routes?
- [ ] Does the application fail closed (e.g., unauthorized access is denied by default)?

## 2. Input & Data Handling
- [ ] Are all inputs (query, params, body, headers) validated with schemas (Zod)?
- [ ] Is database access exclusively via parameterized queries?
- [ ] Are file uploads restricted by type and size?
- [ ] Is data sanitized before being stored or reflected in the UI?

## 3. Communication & Infrastructure
- [ ] Is HTTPS enforced (via proxy or Hono)?
- [ ] Are secure headers (CSP, HSTS, X-Frame-Options) applied?
- [ ] Is CSRF protection active for all state-changing requests?
- [ ] Are rate limits applied to sensitive endpoints (Login, API)?
- [ ] Are secrets (API keys, DB secrets) stored in environment variables, never in code?

## 4. HTMX Specifics
- [ ] Are all HTMX partials escaping user data?
- [ ] Are sensitive partials protected by the same auth middleware as full pages?
- [ ] Is `hx-headers` used securely for any client-side state?

## 5. Error Handling & Logging
- [ ] Are internal stack traces hidden from users in production?
- [ ] Is sensitive information (PII, tokens) stripped from logs?
- [ ] Are security-relevant events (failed logins, admin actions) logged?
