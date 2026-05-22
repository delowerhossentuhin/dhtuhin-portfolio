import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Research } from '@/models/Research';
import { requireAdmin } from '@/lib/requireAdmin';
import { publications } from '@/data/site';

export const runtime = 'nodejs';

const Schema = z.object({
  title: z.string().min(1),
  authors: z.array(z.string()).min(1),
  venue: z.string().min(1),
  publisher: z.string().optional(),
  year: z.number().int().min(1900).max(2100),
  type: z.enum(['journal', 'conference', 'preprint', 'thesis']).optional(),
  tier: z.string().optional(),
  doi: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  status: z.enum(['published', 'submitted', 'in-review', 'accepted']).optional(),
  abstract: z.string().min(1),
  keywords: z.array(z.string()).optional(),
  pdfUrl: z.string().optional(),
});

export async function GET() {
  if (!hasDatabase) return NextResponse.json({ data: publications });
  try {
    await dbConnect();
    const docs = await Research.find().sort({ year: -1, createdAt: -1 }).lean();
    return NextResponse.json({ data: docs });
  } catch (err) {
    console.error('[research] GET', err);
    return NextResponse.json({ data: publications });
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
  const created = await Research.create(parsed.data);
  return NextResponse.json({ data: created }, { status: 201 });
}
