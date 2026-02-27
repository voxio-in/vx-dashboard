import { z } from "zod";
import { Role } from "../constants/roles";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(Role),
  parentId: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  isActive: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
  uiOverrides: z.array(z.string()).optional(),
});

export const updateUIConfigSchema = z.object({
  hiddenComponents: z.array(z.string()).optional(),
  sidebarItems: z
    .array(
      z.object({
        label: z.string(),
        path: z.string(),
        icon: z.string().optional(),
        componentId: z.string(),
      }),
    )
    .optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateUIConfigInput = z.infer<typeof updateUIConfigSchema>;
