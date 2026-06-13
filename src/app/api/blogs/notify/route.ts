import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';
import { requireAdmin } from '@/lib/requireAdmin';
import { Resend } from 'resend';
import { profile } from '@/data/site';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) return NextResponse.json({ message: 'No database.' }, { status: 503 });

  const body = await req.json().catch(() => null);
  const { title, excerpt, slug } = body ?? {};
  if (!title || !slug) return NextResponse.json({ message: 'Title and slug required.' }, { status: 400 });

  await dbConnect();
  const subscribers = await Subscriber.find({ confirmed: true, unsubscribedAt: null }).lean();

  if (subscribers.length === 0) return NextResponse.json({ sent: 0 });

  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`;
  let sent = 0;

  for (const sub of subscribers as any[]) {
    try {
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev',
        to: sub.email,
        subject: `New post: ${title}`,
        html: `
          <div style="font-family: monospace; max-width: 560px; margin: 0 auto; padding: 2rem; background: #060b1a; color: white; border-radius: 12px;">
            <p style="color: #7dd3fc; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;">New post from ${profile.name}</p>
            <h1 style="color: white; font-size: 1.5rem; margin: 0.75rem 0;">${title}</h1>
            <p style="color: #94a3b8; line-height: 1.6;">${excerpt ?? ''}</p>
            <a href="${postUrl}" style="display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: linear-gradient(to right, #7dd3fc, #60a5fa); color: #060b1a; border-radius: 9999px; font-weight: 600; text-decoration: none; font-size: 0.875rem;">
              Read the post →
            </a>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 2rem 0;" />
            <p style="color: #475569; font-size: 0.75rem;">You're receiving this because you subscribed at dhtuhin.vercel.app. <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${sub.email}" style="color: #7dd3fc;">Unsubscribe</a></p>
          </div>
        `,
      });
      sent++;
    } catch (e) {
      console.error(`[notify] failed for ${sub.email}:`, e);
    }
  }

  return NextResponse.json({ sent });
}