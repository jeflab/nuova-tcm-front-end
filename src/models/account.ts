import {brokerSchema} from "@/models/entities/broker";
import {contractorSchema} from "@/models/entities/personalData";
import {userSchema} from "@/models/entities/user";
import {z} from "zod";
import {agentSchema} from "./entities/agent";

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type Role = z.infer<typeof roleSchema>;

export const permissionSchema = z.object({
  id: z.number(),
  name: z.string(),
});
export type Permission = z.infer<typeof permissionSchema>;

export const accountSchema = z.object({
  user: userSchema,
  roles: z.array(roleSchema),
  permissions: z.array(permissionSchema),
  broker: brokerSchema.nullish(),
});
export type Account = z.infer<typeof accountSchema>;

export const profileSchema = z.object({
  user: userSchema,
  agent: agentSchema.nullable(),
  contractor: contractorSchema.nullable(),
});
export type Profile = z.infer<typeof profileSchema>;
