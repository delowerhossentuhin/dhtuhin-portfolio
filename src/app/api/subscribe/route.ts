import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Subscribe directly — no OTP until domain is verified
export async function POST(req: Request) {
  if (!hasDatabase) {
    return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const { name, email } = body ?? {};

  if (!name?.trim()) {
    return NextResponse.json({ message: 'Name is required.' }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
  }

  await dbConnect();

  const existing = await Subscriber.findOne({ email: email.toLowerCase() });
  if (existing && existing.confirmed && !existing.unsubscribedAt) {
    return NextResponse.json({ message: 'This email is already subscribed.' }, { status: 409 });
  }

  // Save as confirmed directly
  await Subscriber.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      name: name.trim(),
      confirmed: true,
      otp: null,
      otpExpiresAt: null,
      unsubscribedAt: null,
    },
    { upsert: true, new: true }
  );

  // Try sending welcome email — silently ignore if it fails (domain not verified)
  try {
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: email,
      subject: 'Subscribed — Delower Hossen Tuhin',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#060b1a;font-family:monospace;">
          <div style="max-width:480px;margin:40px auto;padding:2rem;background:#0d1526;border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
            <p style="color:#7dd3fc;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 1rem;">Subscription Confirmed</p>
            <h2 style="color:white;margin:0 0 0.5rem;">Hi ${name.trim()},</h2>
            <p style="color:#94a3b8;margin:0 0 1.5rem;line-height:1.6;">
              You're now subscribed to Delower Hossen Tuhin's blog. You'll get an email whenever a new post lands — no marketing, no schedule.
            </p>
            <p style="color:#475569;font-size:12px;margin:0;">
              To unsubscribe anytime, just reply to any email.
            </p>
          </div>
        </body>
        </html>
      `,
    });
  } catch (e) {
    // Silently ignore — user is still subscribed
    console.error('[subscribe] welcome email failed (likely no verified domain):', e);
  }

  return NextResponse.json({ message: 'Subscribed successfully! Welcome.' });
}

// Keep PUT for future OTP verification when domain is ready
export async function PUT(req: Request) {
  return NextResponse.json({ message: 'OTP verification not active yet.' }, { status: 410 });
}