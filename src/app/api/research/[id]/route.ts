import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Research } from '@/models/Research';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  if (!hasDatabase)
    return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  await dbConnect();
  const doc = await Research.findById(params.id).lean();
  if (!doc) return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  return NextResponse.json({ data: doc });
}

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase)
    return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  await dbConnect();
  const updated = await Research.findByIdAndUpdate(params.id, body, { new: true });
  if (!updated) return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase)
    return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  await dbConnect();
  const deleted = await Research.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
