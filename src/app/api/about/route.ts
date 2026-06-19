import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { AboutContent } from '@/models/AboutContent';
import { requireAdmin } from '@/lib/requireAdmin';
import { profile, education, achievements, memberships, languages } from '@/data/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function seedFallback() {
  return {
    photoUrl: '',
    photoCaption: 'AIUB Campus · 2025',
    bioParagraphs: [...profile.longBio],
    philosophy: profile.philosophy,
    factLocation: 'Dhaka, Bangladesh',
    factStatus: 'Final-year UG',
    factGpa: '',
    factNext: "PhD · Fall '26",
    timeline: [],
    education: education.map((e) => ({ ...e, highlights: [...e.highlights] })),
    achievements: achievements.map((a) => ({ ...a })),
    memberships: memberships.map((m) => ({ ...m })),
    languages: languages.map((l) => ({ ...l })),
  };
}

export async function GET() {
  if (!hasDatabase) return NextResponse.json({ data: seedFallback() });
  try {
    await dbConnect();
    const doc = await AboutContent.findOne().lean();
    if (doc) return NextResponse.json({ data: doc });
  } catch (e) {
    console.error('[about] GET', e);
  }
  return NextResponse.json({ data: seedFallback() });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ message: 'Invalid payload.' }, { status: 400 });

  await dbConnect();
  const updated = await AboutContent.findOneAndUpdate({}, body, { upsert: true, new: true });
  return NextResponse.json({ data: updated });
}