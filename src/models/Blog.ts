import { Schema, model, models, type InferSchemaType } from 'mongoose';

const blogSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: 'Research' },
    tags: { type: [String], default: [] },
    coverColor: { type: String, default: '#1e3a8a' },
    coverImage: { type: String },
    readTime: { type: Number, default: 5 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type BlogDoc = InferSchemaType<typeof blogSchema>;
export const Blog = models.Blog ?? model('Blog', blogSchema);
