import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { ContactMessage } from '@/models/ContactMessage';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

type Ctx = { params: { id: string } };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase)
    return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  await dbConnect();
  const updated = await ContactMessage.findByIdAndUpdate(params.id, body, {
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
  const deleted = await ContactMessage.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
