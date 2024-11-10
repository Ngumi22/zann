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
  newBrand: z.string().optional(),
  categoryId: z.string().optional(),
  newCategory: z.string().optional(),
  subCategoryId: z.string().optional(),
  newSubCategory: z.string().optional(),
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
const categorySchema = z.object({
  category_id: z.number().optional(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  parent_id: z.number().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Brands schema
const brandSchema = z.object({
  brand_id: z.number().optional(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  logo: z.string().optional(),
  created_at: z.date().optional(),
});

// Suppliers schema
const supplierSchema = z.object({
  supplier_id: z.number().optional(),
  name: z.string().min(1).max(255),
  contact_info: z.record(z.string(), z.any()).optional(),
  created_at: z.date().optional(),
});

// Customers schema
const customerSchema = z.object({
  customer_id: z.number().optional(),
  first_name: z.string().min(1).max(255),
  last_name: z.string().min(1).max(255),
  email: z.string().email(),
  password_hash: z.string(),
  contact_info: z.record(z.string(), z.any()).optional(),
  created_at: z.date().optional(),
});

// Tags schema
const tagSchema = z.object({
  tag_id: z.number().optional(),
  name: z.string().min(1).max(100),
  created_at: z.date().optional(),
});

// Product Tags schema
const productTagSchema = z.object({
  product_tag_id: z.number().optional(),
  product_id: z.number(),
  tag_id: z.number(),
});

// Orders schema
const orderSchema = z.object({
  order_id: z.number().optional(),
  customer_id: z.number().optional(),
  total_price: z.number().positive(),
  order_date: z.date().optional(),
  status: z
    .enum(["pending", "shipped", "delivered", "canceled"])
    .default("pending"),
  shipping_address: z.record(z.string(), z.any()).optional(),
});

// Order Items schema
const orderItemSchema = z.object({
  order_item_id: z.number().optional(),
  order_id: z.number(),
  product_id: z.number(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

// Admin Users schema
const adminUserSchema = z.object({
  admin_id: z.number().optional(),
  username: z.string().min(1).max(50),
  password_hash: z.string(),
  role: z.enum(["admin", "manager", "viewer"]),
  created_at: z.date().optional(),
  last_login: z.date().optional(),
});

// Product Reviews schema
const productReviewSchema = z.object({
  review_id: z.number().optional(),
  product_id: z.number(),
  customer_id: z.number(),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().optional(),
  review_date: z.date().optional(),
});

// Carousels schema
const carouselSchema = z.object({
  carousel_id: z.number().optional(),
  title: z.string().min(1).max(255),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Carousel Items schema
const carouselItemSchema = z.object({
  item_id: z.number().optional(),
  carousel_id: z.number(),
  image_path: z.string().min(1).max(255),
  alt_text: z.string().optional(),
  text_content: z.string().optional(),
  button_text: z.string().optional(),
  button_link: z.string().optional(),
  button_style: z.record(z.string(), z.any()).optional(),
  position: z.number().int().optional(),
});

// Banners schema
const bannerSchema = z.object({
  banner_id: z.number().optional(),
  image_path: z.string().min(1).max(255),
  alt_text: z.string().optional(),
  link_url: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Inventory Logs schema
const inventoryLogSchema = z.object({
  log_id: z.number().optional(),
  product_id: z.number(),
  change_amount: z.number().int(),
  change_type: z.enum(["purchase", "sale", "return", "adjustment"]),
  change_date: z.date().optional(),
  admin_id: z.number().optional(),
});

// Settings schema
const settingSchema = z.object({
  setting_key: z.string(),
  setting_value: z.record(z.string(), z.any()),
});

// Audit Logs schema
const auditLogSchema = z.object({
  log_id: z.number().optional(),
  admin_id: z.number().optional(),
  action: z.string().min(1).max(255),
  log_date: z.date().optional(),
  affected_table: z.string().optional(),
  affected_id: z.number().optional(),
  previous_values: z.record(z.string(), z.any()).optional(),
  new_values: z.record(z.string(), z.any()).optional(),
});
