import { z } from "zod";

export const contactTopicSchema = z.enum(
  ["GENERAL", "REPORT_ISSUE", "ACCOUNT", "SAFETY", "PARTNERSHIP", "OTHER"],
  "Please choose a valid topic.",
);

export const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name must be at most 100 characters long."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(254, "Email must be at most 254 characters long.")
    .email("Please provide a valid email address."),
  topic: contactTopicSchema,
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters long.")
    .max(150, "Subject must be at most 150 characters long."),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters long.")
    .max(5000, "Message must be at most 5000 characters long."),
});

export type ContactMessageFormValues = z.infer<typeof contactMessageSchema>;
