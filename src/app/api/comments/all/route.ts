import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Comment } from '@/models/Comment';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) return NextResponse.json({ data: [] });
  try {
    await dbConnect();
    const comments = await Comment.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: comments });
  } catch (e) {
    console.error('[comments/all] GET', e);
    return NextResponse.json({ data: [] });
  }
}