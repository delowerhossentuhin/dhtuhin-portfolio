import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV === 'production') {
  // Don't throw at import time in dev — let the site render with seed data.
  // eslint-disable-next-line no-console
  console.warn('[mongodb] MONGODB_URI is not set — admin features and persistence are disabled.');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

/**
 * Returns a connected Mongoose instance.  Throws when `MONGODB_URI`
 * is missing so API handlers can respond with a graceful 503.
 */
export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not configured.');

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10_000,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

/** True when MONGODB_URI is set — used to gate admin-write endpoints. */
export const hasDatabase = Boolean(MONGODB_URI);
