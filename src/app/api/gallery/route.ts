import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { GalleryItem } from '@/models/GalleryItem';
import { requireAdmin } from '@/lib/requireAdmin';
import { seedGallery } from '@/data/site';

export const runtime = 'nodejs';

const Schema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  title: z.string().optional(),
  caption: z.string().optional(),
  category: z.string().optional(),
  span: z.enum(['normal', 'tall', 'wide']).optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  if (!hasDatabase) return NextResponse.json({ data: seedGallery });
  try {
    await dbConnect();
    const docs = await GalleryItem.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ data: docs });
  } catch (err) {
    console.error('[gallery] GET', err);
    return NextResponse.json({ data: seedGallery });
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
    return NextResponse.json({ message: 'Invalid payload.' }, { status: 422 });
  await dbConnect();
  const created = await GalleryItem.create(parsed.data);
  return NextResponse.json({ data: created }, { status: 201 });
}
