import { Schema, model, models, type InferSchemaType } from 'mongoose';

const galleryItemSchema = new Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    title: String,
    caption: String,
    category: { type: String, default: 'Personal' },
    span: { type: String, enum: ['normal', 'tall', 'wide'], default: 'normal' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type GalleryItemDoc = InferSchemaType<typeof galleryItemSchema>;
export const GalleryItem = models.GalleryItem ?? model('GalleryItem', galleryItemSchema);
