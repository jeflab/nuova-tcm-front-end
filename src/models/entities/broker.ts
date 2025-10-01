import {stringToJSON} from "@/helpers/stringToJSON";
import {backendUrl} from "@/services/const";
import {z} from "zod";

const informationSchema = z
  .object({
    FE_logo: z
      .object({
        url: z.string(),
        width: z.coerce.number<string | number>(),
        height: z.coerce.number<string | number>(),
      })
      .transform(({height, width, ...logo}) => ({
        url: backendUrl + logo.url,
        width: (width / height) * 30,
        height: 30,
      })),
    FE_footer: z.string(),
    FE_manuale_operativo: z.string(),
  })
  .transform(({FE_logo, FE_footer, FE_manuale_operativo, ...information}) => ({
    ...information,
    logo: FE_logo,
    footer: FE_footer,
    manualeOperativo: FE_manuale_operativo,
  }));

export const brokerSchema = z
  .object({
    name: z.string(),
    json_information: stringToJSON().pipe(informationSchema),
  })
  .transform(({json_information, ...broker}) => ({
    ...broker,
    information: json_information,
  }));
export type Broker = z.infer<typeof brokerSchema>;
