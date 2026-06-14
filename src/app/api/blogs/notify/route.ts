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
  if (!title || !slug) {
    return NextResponse.json({ message: 'Title and slug required.' }, { status: 400 });
  }

  await dbConnect();
  const subscribers = await Subscriber.find({
    confirmed: true,
    unsubscribedAt: null,
  }).lean() as any[];

  if (subscribers.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No confirmed subscribers.' });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dhtuhin.vercel.app';
  const postUrl = `${siteUrl}/blog/${slug}`;
  let sent = 0;
  const failed: string[] = [];

  for (const sub of subscribers) {
    try {
      const { error } = await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev',
        to: sub.email,
        subject: `New post: ${title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin:0;padding:0;background:#060b1a;font-family:monospace;">
            <div style="max-width:560px;margin:40px auto;padding:2rem;background:#0d1526;border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
              <p style="color:#7dd3fc;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 1rem;">New post from ${profile.name}</p>
              <h1 style="color:white;font-size:1.5rem;margin:0 0 0.75rem;line-height:1.3;">${title}</h1>
              ${excerpt ? `<p style="color:#94a3b8;line-height:1.6;margin:0 0 1.5rem;">${excerpt}</p>` : ''}
              <a href="${postUrl}" style="display:inline-block;padding:0.75rem 1.75rem;background:linear-gradient(to right,#7dd3fc,#60a5fa);color:#060b1a;border-radius:9999px;font-weight:700;text-decoration:none;font-size:0.875rem;">
                Read the post →
              </a>
              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:2rem 0;" />
              <p style="color:#475569;font-size:11px;margin:0;">
                You're receiving this because you subscribed at ${siteUrl}.<br/>
                <a href="${siteUrl}" style="color:#7dd3fc;">Unsubscribe</a>
              </p>
            </div>
          </body>
          </html>
        `,
      });

      if (error) {
        console.error(`[notify] Resend error for ${sub.email}:`, error);
        failed.push(sub.email);
      } else {
        sent++;
      }
    } catch (e) {
      console.error(`[notify] exception for ${sub.email}:`, e);
      failed.push(sub.email);
    }
  }

  return NextResponse.json({ sent, failed: failed.length });
}