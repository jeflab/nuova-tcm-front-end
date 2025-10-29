import {z} from "zod";

export const molliePaymentSchema = z
  .object({
    resource: z.string(),
    id: z.string(),
    amount: z.object({value: z.string(), currency: z.string()}),
    description: z.string(),
    status: z.string(),
    expiresAt: z.string(),
    sequenceType: z.string(),
    redirectUrl: z.string(),
    webhookUrl: z.string(),
    metadata: z.object({lip_id: z.coerce.number()}),
    _links: z.object({
      checkout: z.object({href: z.string(), type: z.string()}),
    }),
    customerId: z.string(),
  })
  .transform(({_links, ...rest}) => ({
    ...rest,
    links: _links,
  }));
export type MolliePayment = z.infer<typeof molliePaymentSchema>;

export const mollieSubscriptionSchema = z.object({
  resource: z.string(),
  id: z.string(),
  nextPaymentDate: z.string(),
});
