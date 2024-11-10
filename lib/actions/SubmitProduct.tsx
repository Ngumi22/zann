"use server";

import { schema } from "../validation/schema";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function SubmitAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  // Convert FormData entries to an object
  const formData = Object.fromEntries(data);

  // Convert tags from JSON string to an array if present
  if (formData.tags) {
    try {
      formData.tags = JSON.parse(formData.tags.toString());
    } catch (error) {
      return {
        message: "Invalid tags format",
        fields: { ...prevState.fields },
        issues: ["Tags must be a valid array format"],
      };
    }
  }

  // Validate data with schema
  const parsed = schema.safeParse(formData);

  if (!parsed.success) {
    // Prepare fields and issues for errors
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

  console.log(parsed);

  // Return success message if parsed successfully
  return { message: "Product Added Successfully" };
}
