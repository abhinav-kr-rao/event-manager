import * as z from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  date: z
    .string()
    .refine((val) => new Date(val) > new Date(), "Date must be in future"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  description: z.string().optional(),
});
