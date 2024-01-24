import {userSchema} from "@/entities/user";
import * as api from "@/services/api";
import {z} from "zod";

const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const permissionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const accountSchema = z.object({
  user: userSchema,
  roles: z.array(roleSchema),
  permissions: z.array(permissionSchema),
});
export type Account = z.infer<typeof accountSchema>;
