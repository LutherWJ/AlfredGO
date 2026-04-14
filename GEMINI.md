# AlfredGo Project Conventions

This document serves as the foundational mandate for all development within the AlfredGo codebase. Adhere strictly to these patterns to ensure architectural integrity and maintainability.

## 📚 Documentation & Specifications
Comprehensive system analysis, design documents, and project specifications are located in the `docs/` directory:
- **Primary Spec:** `docs/Alfred State Campus Software Directory - System Analysis & Design V2.md`

## 🏗️ Architectural Standards

### 1. Templating & Views (Hono/JSX)
- **Engine:** Use Hono JSX (`jsxImportSource: hono/jsx`).
- **Layouts:** Do NOT wrap components manually in a "Base" component. Use the `jsxRenderer` middleware located in `src/server/middleware/renderer.tsx`.
- **Rendering:** Use `c.render(<Component />, { title: '...' })` in routes to leverage the global layout.
- **Fragments:** Treat components as fragments that can be returned as partials (via `c.html()`) for HTMX requests or as full pages (via `c.render()`).

### 2. Styling (Tailwind CSS)
- **Class Extraction Pattern:** To maintain JSX readability, extract complex Tailwind utility strings into module-level constants.
  ```tsx
  const BUTTON_STYLE = "px-4 py-2 bg-blue-600 text-white rounded-lg..."
  export const MyComponent: FC = () => <button class={BUTTON_STYLE}>Click Me</button>
  ```
- **Build:** Styles are processed from `src/client/input.css` into `public/css/style.css` using the Tailwind CLI.

### 3. Interactivity (HTMX & PWA)
- **HTMX:** Use HTMX for all dynamic updates and server interactions.
- **PWA:** The application is a Progressive Web App.
  - **Service Worker:** Located in `src/client/sw.ts` (transpiled to `public/sw.js`).
  - **Strategy:** Uses **Stale-While-Revalidate** to ensure instant loads for the "link dump" directory.
  - **Manifest:** Located in `public/manifest.json`.

### 4. Backend & Database
- **Runtime:** Bun.
- **Database:** SQLite via `bun:sqlite`.
- **Pattern:** Uses a Singleton pattern for the database instance in `src/server/db/index.ts`.
- **Initialization:** Database schema is managed in `src/server/db/index.ts` via `initDb()`.

### 5. Environment Configuration
- **Fail-Fast:** The application validates all environment variables on startup using Zod in `src/server/util/config.ts`.
- **Validation:** If any required variable (like `COOKIE_SECRET`) is missing or invalid, the process will log the specific error and exit immediately.
- **Type Safety:** Use the `CONFIG` object instead of `process.env` throughout the application for typed access.

### 6. Type Safety
- **Components:** Always use the `FC` (Function Component) type from `hono/jsx`.
- **Validation:** Use `zod` for schema validation and `@hono/zod-validator` for API route protection.
- **Global Types:** Augment Hono's `ContextVariableMap` in `src/server/types/index.ts` for any variables injected into the request context.

## 🚀 Development Workflow
- **Build:** `bun run build` (Compiles CSS, Client JS, and Service Worker).
- **Dev:** `bun run dev` (Runs server with hot-reload and watches client assets).
