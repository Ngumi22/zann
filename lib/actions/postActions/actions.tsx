"use server";

import { z } from "zod";

// Zod schema for form validation
const schema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  shortDescription: z
    .string()
    .max(200, "Short description must be 200 characters or less"),
  price: z.coerce.number().positive("Price must be a positive number"),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Quantity must be a non-negative integer"),
  discount: z.coerce
    .number()
    .min(0)
    .max(100, "Discount must be between 0 and 100"),
  brandId: z.string().optional(),
  newBrand: z.string().optional(),
  categoryId: z.string().optional(),
  newCategory: z.string().optional(),
  subCategoryId: z.string().optional(),
  newSubCategory: z.string().optional(),
  tags: z.array(z.string()),
  specifications: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

type ProductData = z.infer<typeof schema>;

export type FormState = {
  message: string;
  fields?: Partial<ProductData>;
  issues?: string[];
};

export async function onSubmitAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  console.log(formData);
  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  return { message: "User registered" };
}
