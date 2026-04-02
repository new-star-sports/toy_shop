import { z } from "zod";

export const blogSchema = z.object({
  title_en: z.string().min(5, "Title must be at least 5 characters").max(200, "Title must be at most 200 characters"),
  title_ar: z.string().max(200, "Arabic title must be at most 200 characters").optional().nullable(),
  slug: z.string().min(3, "Slug must be at least 3 characters").max(100, "Slug must be at most 100 characters"),
  excerpt_en: z.string().max(300, "Excerpt must be at most 300 characters").optional().nullable(),
  excerpt_ar: z.string().max(300, "Arabic excerpt must be at most 300 characters").optional().nullable(),
  content_en: z.string().min(10, "Content must be at least 10 characters").max(50000, "Content must be at most 50000 characters"),
  content_ar: z.string().max(50000, "Arabic content must be at most 50000 characters").optional().nullable(),
  image_url: z.string().url("Invalid image URL").or(z.literal("")).optional().nullable(),
  category_id: z.string().optional().nullable(),
  is_published: z.boolean(),
});

export type Blog = z.infer<typeof blogSchema>;
