import { z } from "zod";

const categorySchema = z.enum([
  "HARASSMENT",
  "THEFT",
  "SUSPICIOUS_ACTIVITY",
  "UNSAFE_AREA",
  "OTHER",
]);

const incidentFields = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long.")
    .max(120, "Title must be at most 120 characters long."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters long.")
    .max(2000, "Description must be at most 2000 characters long."),
  category: categorySchema,
  area: z
    .string()
    .trim()
    .min(2, "Area must be at least 2 characters long.")
    .max(100, "Area must be at most 100 characters long."),
  location: z
    .string()
    .trim()
    .max(200, "Location must be at most 200 characters long.")
    .optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  incidentDate: z
    .string()
    .min(1, "Incident date is required.")
    .refine(
      (value) =>
        !Number.isNaN(Date.parse(value)) &&
        new Date(value).getTime() <= Date.now() + 5 * 60 * 1000,
      "Incident date cannot be in the future.",
    ),
});

const validateCoordinates = (
  data: { latitude?: number; longitude?: number },
  ctx: z.RefinementCtx,
) => {
  if ((data.latitude === undefined) !== (data.longitude === undefined)) {
    ctx.addIssue({
      code: "custom",
      path: [data.latitude === undefined ? "latitude" : "longitude"],
      message: "Latitude and longitude must be provided together.",
    });
  }
};

export const incidentCreateSchema =
  incidentFields.superRefine(validateCoordinates);

export const incidentUpdateSchema = incidentFields
  .partial()
  .superRefine(validateCoordinates);
