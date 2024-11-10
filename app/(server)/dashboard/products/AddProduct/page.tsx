"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, X } from "lucide-react";
import { onSubmitAction } from "@/lib/actions/postActions/actions";

const productSchema = z.object({
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

type ProductFormValues = z.infer<typeof productSchema>;

const brands = [
  { id: "1", name: "MedTech" },
  { id: "2", name: "HealthCare Solutions" },
];

const categories = [
  {
    id: "1",
    name: "Diagnostic Equipment",
    subCategories: [
      {
        id: "1-1",
        name: "Imaging Systems",
        subCategories: [
          { id: "1-1-1", name: "Adult Patient Monitors" },
          { id: "1-1-2", name: "Paediatric Patient Monitors" },
        ],
      },
      { id: "1-2", name: "Patient Monitors" },
    ],
  },
  {
    id: "2",
    name: "Surgical Instruments",
    subCategories: [
      { id: "2-1", name: "Scalpels" },
      {
        id: "2-2",
        name: "Forceps",
        subCategories: [
          { id: "2-2-1", name: "Long Forceps" },
          { id: "2-2-2", name: "Surgery Forceps" },
        ],
      },
    ],
  },
];

export default function ProductCreationForm() {
  const [state, formAction] = useFormState(onSubmitAction, {
    message: "",
  });
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      shortDescription: "",
      price: 0,
      quantity: 0,
      discount: 0,
      tags: [],
      specifications: [],
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const submitForm = async (data: ProductFormValues) => {
    const formData = new FormData();

    // Append string fields
    formData.append("name", data.name);
    formData.append("sku", data.sku);
    formData.append("shortDescription", data.shortDescription);
    formData.append("brandId", data.brandId || "");
    formData.append("newBrand", data.newBrand || "");
    formData.append("categoryId", data.categoryId || "");
    formData.append("newCategory", data.newCategory || "");
    formData.append("subCategoryId", data.subCategoryId || "");
    formData.append("newSubCategory", data.newSubCategory || "");

    // Append number fields as numbers
    formData.append("price", data.price.toString());
    formData.append("quantity", data.quantity.toString());
    formData.append("discount", data.discount.toString());

    // Append tags as an array
    data.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // Append specifications array if it exists
    if (data.specifications && data.specifications.length > 0) {
      data.specifications.forEach((spec, index) => {
        formData.append(`specifications[${index}][name]`, spec.name);
        formData.append(`specifications[${index}][value]`, spec.value);
      });
    }

    // Append image if it exists and is a File
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    // Perform form submission
    setIsSubmitting(true);
    try {
      const result = formAction(formData);
      console.log;
      toast({ description: "Submitted" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({ description: "Error creating product. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      {state?.message && (
        <div className="text-green-500 mb-4">{state.message}</div>
      )}
      <form
        ref={formRef}
        className="space-y-8"
        onSubmit={form.handleSubmit(submitForm)}
      >
        <Card>
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
            <CardDescription>
              Add a new medical equipment or consumable to your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pricing and Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value, 10))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Categorization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newBrand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Or add a new brand</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategory(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {selectedCategory && (
                    <FormField
                      control={form.control}
                      name="subCategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sub-category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a sub-category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories
                                .find((cat) => cat.id === selectedCategory)
                                ?.subCategories.map((subCat) => (
                                  <SelectItem key={subCat.id} value={subCat.id}>
                                    {subCat.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="newCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Or add a new category</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newSubCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Or add a new sub-category</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageChange(e);
                              field.onChange(e.target.files?.[0]);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="mt-2 max-w-xs rounded-md"
                          />
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((tag, index) => (
                              <div
                                key={index}
                                className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                              >
                                <span>{tag}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="ml-2 h-4 w-4 p-0"
                                  onClick={() => {
                                    const newTags = [...field.value];
                                    newTags.splice(index, 1);
                                    field.onChange(newTags);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            <Input
                              placeholder="Add a tag"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  const input = e.target as HTMLInputElement;
                                  if (input.value) {
                                    field.onChange([
                                      ...field.value,
                                      input.value,
                                    ]);
                                    input.value = "";
                                  }
                                }
                              }}
                              className="w-32"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-4">
                        {field.value?.map((spec, index) => (
                          <div key={index} className="flex items-end space-x-2">
                            <FormItem className="flex-1">
                              <FormLabel
                                htmlFor={`specifications.${index}.name`}
                              >
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  id={`specifications.${index}.name`}
                                  value={spec.name}
                                  onChange={(e) => {
                                    const newSpecs = [...(field.value ?? [])];
                                    newSpecs[index].name = e.target.value;
                                    field.onChange(newSpecs);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className="flex-1">
                              <FormLabel
                                htmlFor={`specifications.${index}.value`}
                              >
                                Value
                              </FormLabel>
                              <FormControl>
                                <Input
                                  id={`specifications.${index}.value`}
                                  value={spec.value}
                                  onChange={(e) => {
                                    const newSpecs = [...(field.value ?? [])];
                                    newSpecs[index].value = e.target.value;
                                    field.onChange(newSpecs);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newSpecs = [...(field.value ?? [])];
                                newSpecs.splice(index, 1);
                                field.onChange(newSpecs);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          field.onChange([
                            ...(field.value ?? []),
                            { name: "", value: "" },
                          ]);
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Specification
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
