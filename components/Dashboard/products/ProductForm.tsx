"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { schema } from "@/lib/validation/schema";
import { SubmitAction } from "@/lib/actions/product/SubmitProduct";
import { useToast } from "@/hooks/use-toast";

type Tag = {
  id: number;
  name: string;
};

type Brand = {
  brand_id: string;
  brand_name: string;
};

const CreateProduct = () => {
  const [state, formAction] = useFormState(SubmitAction, {
    message: "",
  });
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      product_name: "",
      product_sku: "",
      product_description: "",
      product_price: 0,
      product_quantity: 0,
      product_discount: 0,
      image: undefined,
      tags: [],
      brand_name: "",
      ...(state?.fields ?? {}),
    },
  });

  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = form.register("image");

  const [productTags, setProductTags] = useState<Tag[]>([]);
  const [currentTag, setCurrentTag] = useState<string>("");

  const [brands, setBrands] = useState<Brand[]>([]);
  const [isNewBrand, setIsNewBrand] = useState(false);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data.brand || []))
      .catch(() => setBrands([]));
  }, []);

  const handleBrandChange = (value: string) => {
    setIsNewBrand(value === "new");
    form.setValue("brand_name", value === "new" ? "" : value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim() !== "") {
      e.preventDefault();
      const tagName = currentTag.trim();

      if (productTags.some((tag) => tag.name === tagName)) {
        toast({
          variant: "destructive",
          title: "Duplicate Tag",
          description: "This tag already exists.",
        });
        return;
      }

      const newTag = { id: Date.now(), name: tagName };
      setProductTags([...productTags, newTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (id: number) => {
    setProductTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  };

  const onSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();

    form.setValue(
      "tags",
      productTags.map((tag) => tag.name)
    );

    form.handleSubmit((data) => {
      const formData = new FormData(formRef.current!);
      formData.set("tags", JSON.stringify(productTags.map((tag) => tag.name)));

      const existingBrand = brands.find(
        (brand) =>
          brand.brand_name.toLowerCase() === data.brand_name.toLowerCase()
      );

      if (existingBrand) {
        formData.set(
          "brand",
          JSON.stringify({ existingBrandId: existingBrand.brand_id })
        );
      } else {
        formData.set("brand", JSON.stringify({ newBrand: data.brand_name }));
      }

      SubmitAction({ message: "" }, formData).then((response) => {
        console.log("Server Response:", response);
      });
    })(evt);
  };

  return (
    <section className="p-4">
      <Form {...form}>
        {state?.message !== "" && !state.issues && (
          <div className="text-red-500 mb-4">{state.message}</div>
        )}
        {state?.issues && (
          <div className="text-red-500 mb-4">
            <ul>
              {state.issues.map((issue) => (
                <li key={issue} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}
        <form
          ref={formRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          action={formAction}
          onSubmit={onSubmit}
        >
          <div className="space-y-4 border p-2 rounded shadow">
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product_sku"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Product SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product_description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 border p-2 rounded shadow">
            <FormField
              control={form.control}
              name="product_price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product_quantity"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Product quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product_discount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Product discount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 border p-2 rounded shadow">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input type="file" {...fileRef} />
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
                );
              }}
            />
          </div>

          <div className="space-y-4 border p-2 rounded shadow">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Press Enter to add tag"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="grid grid-cols-5 gap-2">
                    {productTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="bg-gray-200 px-2 py-1 rounded-md flex items-center"
                      >
                        <span className="text-sm">{tag.name}</span>
                        <button
                          onClick={() => removeTag(tag.id)}
                          className="text-sm ml-1 text-red-600 hover:text-red-800 focus:outline-none"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="brand_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type brand name"
                    {...field}
                    list="brands" // Use datalist for suggestions
                  />
                </FormControl>
                <datalist id="brands">
                  {brands.map((brand) => (
                    <option key={brand.brand_id} value={brand.brand_name} />
                  ))}
                </datalist>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </section>
  );
};

export default CreateProduct;
