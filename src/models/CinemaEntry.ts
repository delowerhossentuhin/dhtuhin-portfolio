import { Schema, model, models, type InferSchemaType } from 'mongoose';

const cinemaSchema = new Schema(
  {
    title: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, enum: ['Movie', 'TV Series'], required: true },
    genres: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    status: {
      type: String,
      enum: ['Watched', 'Watching', 'Watchlist', 'Rewatched', 'Dropped'],
      default: 'Watchlist',
    },
    watchDate: Date,
    posterUrl: String,
    posterColor: { type: String, default: '#1e293b' },
    review: String,
    quote: String,
  },
  { timestamps: true },
);

export type CinemaDoc = InferSchemaType<typeof cinemaSchema>;
export const CinemaEntry = models.CinemaEntry ?? model('CinemaEntry', cinemaSchema);
