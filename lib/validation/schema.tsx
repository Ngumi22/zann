import { z } from "zod";

const imageSchema = z
  .custom<FileList>()
  .transform((val) => {
    if (val instanceof File) return val;
    if (val instanceof FileList) return val[0];
    return null;
  })
  .superRefine((file, ctx) => {
    if (!(file instanceof File)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
        message: "Not a file",
      });

      return z.NEVER;
    }

    if (file.size > 5 * 1024 * 1024) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Max file size allowed is 5MB",
      });
    }

    if (
      !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
        file.type
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File must be an image (jpeg, jpg, png, webp)",
      });
    }
  })
  .pipe(z.custom<File>());

export const schema = z.object({
  product_name: z.string().trim().min(1, {
    message: "Product name is required.",
  }),
  product_sku: z.string().trim().min(1, {
    message: "SKU is required.",
  }),
  product_description: z.string().trim().min(1, {
    message: "Description is required.",
  }),
  product_price: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive().min(1)
  ),
  product_quantity: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive().min(1)
  ),
  product_discount: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive().min(1)
  ),
  image: imageSchema,
  tags: z.array(z.string()).optional(),
  brand_name: z.string().trim().min(1, {
    message: "Brand name is required.",
  }),
});

// Define the structure for a category as an interface
interface Category {
  category_id?: number;
  category_name: string;
  category_description?: string;
  parent_id?: number | null;
  subcategories?: Category[];
}

// Define a recursive Zod schema for Category
export const categorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    category_id: z.number().optional(),
    category_name: z.string().min(1, "Category name is required"),
    category_description: z.string().optional(),
    parent_id: z.number().nullable().optional(),
    subcategories: z.array(categorySchema).optional(), // Recursive reference
  })
);

// Main schema for category creation, without recursion
export const createCategorySchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
  category_description: z.string().optional(),
  parent_id: z.number().nullable().optional(),
});
