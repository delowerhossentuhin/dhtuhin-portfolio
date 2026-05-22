import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { CinemaEntry } from '@/models/CinemaEntry';
import { requireAdmin } from '@/lib/requireAdmin';
import { seedCinema } from '@/data/site';

export const runtime = 'nodejs';

const Schema = z.object({
  title: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  category: z.enum(['Movie', 'TV Series']),
  genres: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  status: z.enum(['Watched', 'Watching', 'Watchlist', 'Rewatched', 'Dropped']).optional(),
  watchDate: z.string().nullable().optional(),
  posterUrl: z.string().optional(),
  posterColor: z.string().optional(),
  review: z.string().optional(),
  quote: z.string().optional(),
});

export async function GET() {
  if (!hasDatabase) return NextResponse.json({ data: seedCinema });
  try {
    await dbConnect();
    const docs = await CinemaEntry.find().sort({ watchDate: -1, createdAt: -1 }).lean();
    return NextResponse.json({ data: docs });
  } catch (err) {
    console.error('[cinema] GET', err);
    return NextResponse.json({ data: seedCinema });
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase)
    return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ message: 'Invalid payload.', issues: parsed.error.issues }, { status: 422 });
  await dbConnect();
  const created = await CinemaEntry.create(parsed.data);
  return NextResponse.json({ data: created }, { status: 201 });
}
