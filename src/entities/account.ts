import {personalDataSchema} from "@/entities/personalData";
import {userSchema} from "@/entities/user";
import * as api from "@/services/api";
import {z} from "zod";
import {agentSchema} from "./agent";

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

export const profileSchema = z.object({
  user: userSchema,
  roles: z.array(roleSchema),
  permissions: z.array(permissionSchema),
  agent: agentSchema.nullable(),
  contractor: personalDataSchema.nullable(),
});
export type Profile = z.infer<typeof profileSchema>;
