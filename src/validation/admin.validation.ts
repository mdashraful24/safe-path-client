import { z } from "zod";

const reasonsSchema = z
  .string()
  .trim()
  .min(5, "Reason must be at least 5 characters long.")
  .max(500, "Reason must be at most 500 characters long.");

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(254, "Email must be at most 254 characters long.")
  .toLowerCase()
  .email("Please provide a valid email address.");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(72, "Password must be at most 72 characters long.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character.",
  );

export const adminReasonSchema = z.object({
  reason: reasonsSchema,
});

export const adminChangeRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("EMAIL"),
    reason: reasonsSchema,
    requestedEmail: emailSchema,
  }),
  z.object({
    type: z.literal("PASSWORD"),
    reason: reasonsSchema,
    newPassword: passwordSchema,
  }),
]);

export const reviewIncidentSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"]),
    note: z
      .string()
      .trim()
      .max(500, "Review note must be at most 500 characters long.")
      .optional(),
  })
  .refine((data) => data.status !== "REJECTED" || Boolean(data.note), {
    path: ["note"],
    message: "A review note is required when rejecting an incident.",
  });

export const updateIncidentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters long.")
      .max(120, "Title must be at most 120 characters long.")
      .optional(),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters long.")
      .max(2000, "Description must be at most 2000 characters long.")
      .optional(),
    category: z
      .enum([
        "HARASSMENT",
        "THEFT",
        "SUSPICIOUS_ACTIVITY",
        "UNSAFE_AREA",
        "OTHER",
      ])
      .optional(),
    area: z
      .string()
      .trim()
      .min(2, "Area must be at least 2 characters long.")
      .max(100, "Area must be at most 100 characters long.")
      .optional(),
    location: z
      .string()
      .trim()
      .max(200, "Location must be at most 200 characters long.")
      .optional(),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    incidentDate: z
      .string()
      .optional()
      .refine(
        (value) => !value || new Date(value).getTime() <= Date.now(),
        "Incident date cannot be in the future.",
      ),
  })
  .refine(
    (data) => (data.latitude === undefined) === (data.longitude === undefined),
    {
      path: ["longitude"],
      message: "Latitude and longitude must be provided together.",
    },
  );
