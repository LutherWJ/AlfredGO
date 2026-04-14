import type { User } from "../models/schemas";

declare module "hono" {
  interface ContextVariableMap {
    user: User;
  }
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { title?: string }): Response | Promise<Response>
  }
}

export type { User };
