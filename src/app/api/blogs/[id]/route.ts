import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

const Schema = z
  .object({
    slug: z.string().optional(),
    title: z.string().optional(),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    coverColor: z.string().optional(),
    coverImage: z.string().optional(),
    readTime: z.number().int().positive().optional(),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
  })
  .strict();

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  if (!hasDatabase)
    return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  await dbConnect();
  const doc = await Blog.findById(params.id).lean();
  if (!doc) return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  return NextResponse.json({ data: doc });
}

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase)
    return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ message: 'Invalid payload.' }, { status: 422 });
  await dbConnect();
  const updated = await Blog.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
  });
  if (!updated) return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase)
    return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  await dbConnect();
  const deleted = await Blog.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
