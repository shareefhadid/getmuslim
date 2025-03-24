import { z } from "zod";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readValidatedBody(
      event,
      z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        description: z
          .string()
          .min(10, "Description must be at least 10 characters")
          .max(500, "Description cannot exceed 500 characters."),
        address: z.string().min(3, "Address must be at least 3 characters"),
        location: z
          .string()
          .regex(/^POINT\((-?\d+(\.\d+)?) (-?\d+(\.\d+)?)\)$/),
        show_address: z.boolean().default(true),
        featured_image: z.any().optional(),
        website: z
          .string()
          .url("Must be a valid URL (should start with https://)")
          .optional(),
        email: z.string().email("Invalid email").optional(),
        phone: z.string().optional(),
        google_maps: z
          .string()
          .url("Must be a valid Google Maps URL (should start with https://)")
          .optional(),
        category: z
          .array(z.number())
          .min(1, "At least one category is required")
          .max(3, "Maximum 3 categories allowed"),
      }).parse,
    );

    console.log(formData);

    return { success: true };
  } catch (error) {
    handleServerError(event, error);
  }
});
