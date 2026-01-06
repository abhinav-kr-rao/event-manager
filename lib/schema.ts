import * as z from "zod";

export const eventFormInputSchema = z.object({
  title: z.string().min(2, "Title is required"),
  date: z
    .string()
    .refine((val) => new Date(val) > new Date(), "Date must be in future"),
  capacity: z
    .string()
    .min(1, "Capacity is required")
    .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, "Capacity must be a positive number"),
  description: z.string().optional(),
});

export const eventFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  date: z
    .string()
    .refine((val) => new Date(val) > new Date(), "Date must be in future"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  description: z.string().optional(),
});


export const attendeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().min(1, "Email is required"),
});

// Type for Event with attendee count
export type EventWithCount = {
  id: string;
  title: string;
  date: string | Date;
  description: string;
  capacity: number;
  createdAt: string | Date;
  _count: {
    attendees: number;
  };
};