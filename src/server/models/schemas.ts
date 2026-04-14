import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int(),
  sso_id: z.string().min(1),
  email: z.string().email(),
  display_name: z.string().min(1),
  role: z.enum(["student", "admin"]),
});

export const CategorySchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  icon_name: z.string().optional().nullable(),
  sort_order: z.number().int().default(0),
});

export const ServiceSchema = z.object({
  id: z.number().int(),
  category_id: z.number().int().optional().nullable(),
  name: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  url: z.string().url(),
  date_created: z.string(), // SQL timestamps are strings
  date_modified: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Service = z.infer<typeof ServiceSchema>;
