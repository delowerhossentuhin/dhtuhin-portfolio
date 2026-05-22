import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { ContactMessage } from '@/models/ContactMessage';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) return NextResponse.json({ data: [] });
  await dbConnect();
  const docs = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: docs });
}
