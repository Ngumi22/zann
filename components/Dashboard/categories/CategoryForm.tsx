"use client";

import * as React from "react";
import { ChevronRight, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface Category {
  name: string;
  subcategories: Category[];
}

interface CategoryNodeProps {
  category: Category;
  onUpdate: (updatedCategory: Category) => void;
  onDelete: () => void;
  depth: number;
}

function CategoryNode({
  category,
  onUpdate,
  onDelete,
  depth,
}: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const form = useForm<Category>({
    defaultValues: category,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subcategories",
  });

  const onSubmit = (data: Category) => {
    onUpdate(data);
  };

  return (
    <div className="mb-2">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="p-0 h-6 w-6"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-grow flex items-center space-x-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input {...field} className="h-8" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="sm" className="h-8">
              Update
            </Button>
            {depth > 0 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onDelete}
                className="h-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </form>
        </Form>
      </div>
      {isExpanded && (
        <div className="pl-6 mt-2 border-l-2 border-gray-200">
          {fields.map((subcategory, index) => (
            <CategoryNode
              key={subcategory.id}
              category={subcategory}
              onUpdate={(updatedSubcategory) => {
                const updatedSubcategories = [
                  ...form.getValues("subcategories"),
                ];
                updatedSubcategories[index] = updatedSubcategory;
                form.setValue("subcategories", updatedSubcategories);
                onSubmit(form.getValues());
              }}
              onDelete={() => {
                remove(index);
                onSubmit(form.getValues());
              }}
              depth={depth + 1}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              append({ name: "", subcategories: [] });
              onSubmit(form.getValues());
            }}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subcategory
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CategoriesForm() {
  const [categories, setCategories] = React.useState<Category[]>([
    { name: "Root Category", subcategories: [] },
  ]);

  const handleAddRootCategory = () => {
    setCategories([...categories, { name: "", subcategories: [] }]);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Product Categories</h2>
      {categories.map((category, index) => (
        <CategoryNode
          key={index}
          category={category}
          onUpdate={(updatedCategory) => {
            const updatedCategories = [...categories];
            updatedCategories[index] = updatedCategory;
            setCategories(updatedCategories);
          }}
          onDelete={() => {
            const updatedCategories = categories.filter((_, i) => i !== index);
            setCategories(updatedCategories);
          }}
          depth={0}
        />
      ))}
      <Button onClick={handleAddRootCategory}>
        <Plus className="h-4 w-4 mr-2" />
        Add Root Category
      </Button>
    </div>
  );
}
