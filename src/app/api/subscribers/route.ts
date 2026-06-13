import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

// Admin: get all subscribers
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) return NextResponse.json({ data: [] });
  await dbConnect();
  const docs = await Subscriber.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: docs });
}

// Admin: unsubscribe a subscriber
export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) return NextResponse.json({ message: 'No database.' }, { status: 503 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'ID required.' }, { status: 400 });
  await dbConnect();
  await Subscriber.findByIdAndUpdate(id, { unsubscribedAt: new Date(), confirmed: false });
  return NextResponse.json({ ok: true });
}