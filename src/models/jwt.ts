import z from "zod";

export const jwtSchema = z.object({
  aud: z.string(),
  jti: z.string(),
  iat: z.number(),
  nbf: z.number(),
  exp: z.number(),
  sub: z.string(),
  scopes: z.array(z.string()),
  permissions: z.record(z.string(), z.string()).optional(),
});
export type DecodedToken = z.infer<typeof jwtSchema>;
