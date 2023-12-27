import {FieldValues, UseFormReturn} from "react-hook-form";
import {z} from "zod";

export const isSubmitErrors = <TFieldValues extends FieldValues>(
  data: TFieldValues,
) => {
  const keys = ["root", ...Object.keys(data)] as [string, ...string[]];

  const SubmitErrorsSchema = z.record(
    z.enum(keys),
    z.object({type: z.string(), message: z.string()}),
  );

  return (error: unknown): error is z.infer<typeof SubmitErrorsSchema> =>
    SubmitErrorsSchema.safeParse(error).success;
};
