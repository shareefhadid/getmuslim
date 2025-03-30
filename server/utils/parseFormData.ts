import { z } from "zod";

/**
 * Parses form data and validates it against a Zod schema
 */
export async function parseFormData<T extends z.ZodType>(
  event: any,
  schema: T,
): Promise<z.infer<T>> {
  const formData = await readFormData(event);

  const data: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (key in data) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }

  return schema.parse(data);
}
