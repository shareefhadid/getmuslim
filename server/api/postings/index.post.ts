import { serverSupabaseServiceRole } from "#supabase/server";
import { Resend } from "resend";
import { z } from "zod";
import { Database } from "~/types/database.types";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters."),
  address: z.string().min(3, "Address must be at least 3 characters"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  show_address: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === true || val === "true"),
  featured_image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size > 0, {
      message: "File must have a positive size",
    }),
  website: z
    .string()
    .url("Must be a valid URL (should start with https://)")
    .optional()
    .nullable(),
  email: z.string().email("Invalid email").optional().nullable(),
  phone: z.string().optional().nullable(),
  google_maps: z
    .string()
    .url("Must be a valid Google Maps URL (should start with https://)")
    .optional()
    .nullable(),
  category: z.preprocess(
    (val) => {
      const arr = Array.isArray(val) ? val : [val];
      return arr.map((v) => {
        const num = parseInt(String(v), 10);
        return isNaN(num) ? 0 : num;
      });
    },
    z
      .array(z.number())
      .min(1, "At least one category is required")
      .max(3, "Maximum 3 categories allowed")
      .refine((val) => val.every((v) => v > 0), {
        message: "All category values must be valid positive numbers",
      }),
  ),
});

export default defineEventHandler(async (event) => {
  try {
    const validatedData = await parseFormData(event, schema);

    const imageFile = validatedData.featured_image;

    let imagePath;

    if (imageFile) {
      ensureBlob(imageFile, {
        maxSize: "1MB",
        types: ["image"],
      });

      const blob = await hubBlob().put(imageFile.name, imageFile, {
        addRandomSuffix: true,
        prefix: "images",
      });

      imagePath = blob.pathname;
    }

    const client = await serverSupabaseServiceRole<Database>(event);

    const response = await client.rpc("insert_posting", {
      title: validatedData.title,
      description: validatedData.description,
      address: validatedData.address,
      website: validatedData.website ?? undefined,
      category_ids: validatedData.category,
      phone: validatedData.phone ?? undefined,
      show_address: validatedData.show_address,
      email: validatedData.email ?? undefined,
      google_maps: validatedData.google_maps ?? undefined,
      featured_image: imagePath,
      lat: validatedData.latitude,
      long: validatedData.longitude,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    try {
      const data = await resend.emails.send({
        from: "getmuslim <no-reply@transactional.getmuslim.com>",
        text: Object.entries(validatedData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
        to: ["shareefhadid@gmail.com"],
        subject: "New submission",
      });

      if (data.error) throw new Error(data.error.message);
    } catch (error) {
      logError(getRequestURL(event).pathname, error);
    }

    return { success: true };
  } catch (error) {
    handleServerError(event, error);
  }
});
