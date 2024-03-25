import {personalDataSchema} from "@/models/entities/personalData";
import {userSchema} from "@/models/entities/user";
import {z} from "zod";
import {agentSchema} from "./entities/agent";

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

export const profileSchema = z.object({
  user: userSchema,
  agent: agentSchema.nullable(),
  contractor: personalDataSchema.nullable(),
});
export type Profile = z.infer<typeof profileSchema>;
