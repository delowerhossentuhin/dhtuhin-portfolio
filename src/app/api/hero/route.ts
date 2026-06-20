import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { HeroContent } from '@/models/HeroContent';
import { requireAdmin } from '@/lib/requireAdmin';
import { profile } from '@/data/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function seedFallback() {
  return {
    statusBadge: profile.status,
    headlinePart1: 'Research that',
    headlineEm1: 'scales',
    headlinePart2: 'built where it',
    headlineEm2: 'matters',
    introText: `I'm ${profile.shortName} — a Computer Science Graduate from American International University-Bangladesh working on privacy-preserving machine learning, medical-imaging AI, and the interpretability problems that make all of it deployable.`,
    taglines: [
      'Federated Learning · Privacy at Scale',
      'Computer Vision for Medical Imaging',
      'Interpretable, Auditable AI',
      'PhD-Bound · Fall 2026',
    ],
    stat1Value: '7', stat1Label: 'Publications', stat1Suffix: 'incl. Q1',
    stat2Value: '3', stat2Label: 'Research Labs', stat2Suffix: 'active',
    stat3Value: 'Fall 26', stat3Label: 'PhD Target', stat3Suffix: 'intake',
    portraitUrl: '',
    portraitLocation: 'Dhaka · Bangladesh',
  };
}

export async function GET() {
  if (!hasDatabase) return NextResponse.json({ data: seedFallback() });
  try {
    await dbConnect();
    const doc = await HeroContent.findOne().lean();
    if (doc) return NextResponse.json({ data: doc });
  } catch (e) {
    console.error('[hero] GET', e);
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
  const updated = await HeroContent.findOneAndUpdate({}, body, { upsert: true, new: true });
  return NextResponse.json({ data: updated });
}