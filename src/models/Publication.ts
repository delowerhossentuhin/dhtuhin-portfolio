import { Schema, model, models } from 'mongoose';

const publicationSchema = new Schema(
  {
    title: { type: String, required: true },
    authors: { type: [String], default: [] },
    venue: { type: String, required: true },
    publisher: { type: String, default: '' },
    year: { type: Number, required: true },
    type: { type: String, enum: ['journal', 'conference', 'preprint', 'thesis'], default: 'conference' },
    tier: { type: String, default: '' },
    doi: { type: String, default: null },
    url: { type: String, default: null },
    status: { type: String, enum: ['published', 'submitted', 'in-review', 'accepted'], default: 'submitted' },
    abstract: { type: String, required: true },
    keywords: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Publication = models.Publication ?? model('Publication', publicationSchema);