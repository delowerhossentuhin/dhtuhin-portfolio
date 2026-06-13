import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';
import { requireAdmin } from '@/lib/requireAdmin';
import { seedBlogs } from '@/data/site';
import { slugify } from '@/lib/utils';

export const runtime = 'nodejs';

const Schema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1),
  excerpt: z.string().optional().default(''),   // ← no longer required
  content: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverColor: z.string().optional(),
  coverImage: z.string().optional(),
  readTime: z.number().int().positive().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  if (!hasDatabase) return NextResponse.json({ data: seedBlogs });
  try {
    await dbConnect();
    const docs = await Blog.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: docs });
  } catch (err) {
    console.error('[blogs] GET', err);
    return NextResponse.json({ data: seedBlogs });
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
  const slug = parsed.data.slug || slugify(parsed.data.title);
  const created = await Blog.create({ ...parsed.data, slug });
  return NextResponse.json({ data: created }, { status: 201 });
}