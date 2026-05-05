---
name: app-sec-analyzer
description: Performs in-depth application-level security analysis, particularly for the BETH stack (Bun, Hono, HTMX). Use this skill to review authentication flows, input validation, database security, and HTMX-specific hypermedia vulnerabilities.
---

# Application Security Analyzer

This skill provides a structured workflow for auditing and securing modern web applications, with specialized expertise in the BETH stack (Bun, Hono, HTMX).

## Workflow

### 1. Research & Discovery
- Identify the authentication mechanism (OIDC, SSO, Session cookies).
- Map all entry points: API routes (`/api/*`), UI routes, and HTMX partial endpoints.
- Identify the data persistence layer (SQLite, PostgreSQL) and how queries are constructed.

### 2. Targeted Auditing
Use the following references for specific guidance:
- **Core Checklist**: Use [references/checklist.md](references/checklist.md) for a comprehensive review.
- **BETH Stack Patterns**: See [references/hono-htmx-patterns.md](references/hono-htmx-patterns.md) for secure implementation of Hono middleware, Zod validation, and HTMX security.

### 3. Analysis Categories
- **Broken Access Control**: Check if `/api` or `/admin` routes lack `requireAuth` or `requireAdmin` middleware.
- **Injection Attacks**: Search for non-parameterized SQL queries or unescaped user data in JSX/HTMX fragments.
- **Session Security**: Verify that session cookies are signed, `httpOnly`, and `secure`.
- **CSRF & XSS**: Ensure `csrf()` middleware is global and that user input is never rendered via `raw()` or `dangerouslySetInnerHTML`.

## Tool Usage
- Use `grep_search` to find dangerous patterns (e.g., `.run(\`` for SQL injection, `raw(` for XSS).
- Use `read_file` to analyze middleware and route handlers.

## Reporting
When reporting findings, categorize them by:
1. **Critical**: Immediate risk of data breach or account takeover.
2. **High**: Significant risk of unauthorized access or data manipulation.
3. **Medium**: Security misconfigurations or lack of best practices.
4. **Low**: Defensive improvements or style concerns.
