import { Schema, model, models, type InferSchemaType } from 'mongoose';

const researchSchema = new Schema(
  {
    title: { type: String, required: true },
    authors: { type: [String], required: true },
    venue: { type: String, required: true },
    publisher: String,
    year: { type: Number, required: true },
    type: { type: String, enum: ['journal', 'conference', 'preprint', 'thesis'], default: 'conference' },
    tier: String,
    doi: String,
    url: String,
    status: { type: String, enum: ['published', 'submitted', 'in-review', 'accepted'], default: 'submitted' },
    abstract: { type: String, required: true },
    keywords: { type: [String], default: [] },
    pdfUrl: String,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ResearchDoc = InferSchemaType<typeof researchSchema>;
export const Research = models.Research ?? model('Research', researchSchema);