import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Comment } from '@/models/Comment';
import { Blog } from '@/models/Blog';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const blogSlug = searchParams.get('blogSlug');
  if (!blogSlug) return NextResponse.json({ data: [] });
  if (!hasDatabase) return NextResponse.json({ data: [] });
  try {
    await dbConnect();
    const comments = await Comment.find({ blogSlug, isHidden: false })
      .sort({ createdAt: 1 })
      .lean();
    return NextResponse.json({ data: comments });
  } catch (e) {
    console.error('[comments] GET', e);
    return NextResponse.json({ data: [] });
  }
}

export async function POST(req: Request) {
  if (!hasDatabase) return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body?.blogSlug || !body?.content?.trim()) {
    return NextResponse.json({ message: 'Blog slug and content are required.' }, { status: 400 });
  }
  try {
    await dbConnect();
    const blog = await Blog.findOne({ slug: body.blogSlug }).lean() as any;
    if (!blog) return NextResponse.json({ message: 'Blog not found.' }, { status: 404 });

    // Count anonymous comments for this blog to number them
    let authorName = body.authorName?.trim() || null;
    let authorNumber = null;
    let isSubscriber = false;

    if (!authorName) {
      const anonCount = await Comment.countDocuments({ blogSlug: body.blogSlug, isSubscriber: false });
      authorNumber = anonCount + 1;
      authorName = `Anonymous`;
    } else {
      isSubscriber = true;
    }

    const comment = await Comment.create({
      blogId: blog._id,
      blogSlug: body.blogSlug,
      content: body.content.trim(),
      authorName,
      authorNumber,
      isSubscriber,
    });
    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (e: any) {
    console.error('[comments] POST', e);
    return NextResponse.json({ message: e.message ?? 'Failed.' }, { status: 500 });
  }
}