import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

type Ctx = { params: { id: string } };

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase)
    return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  await dbConnect();
  const deleted = await Subscriber.findByIdAndDelete(params.id);
  if (!deleted) return NextResponse.json({ message: 'Not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
