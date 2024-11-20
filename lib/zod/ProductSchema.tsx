import { z } from "zod";

// Products schema
// Zod schema for form validation
export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  shortDescription: z
    .string()
    .max(200, "Short description must be 200 characters or less"),
  price: z.number().positive("Price must be a positive number"),
  quantity: z
    .number()
    .int()
    .nonnegative("Quantity must be a non-negative integer"),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100"),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  image: z.instanceof(File).optional(),
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

// Categories schema
export const categorySchema = z.object({
  category_id: z.number().optional(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  parent_id: z.number().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
