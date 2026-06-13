import { NextResponse } from 'next/server';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Step 1: Submit name + email → send OTP
export async function POST(req: Request) {
  if (!hasDatabase) return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  const body = await req.json().catch(() => null);
  const { name, email } = body ?? {};

  if (!name?.trim()) return NextResponse.json({ message: 'Name is required.' }, { status: 400 });
  if (!email || !isValidEmail(email)) return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });

  await dbConnect();

  // Check if already subscribed
  const existing = await Subscriber.findOne({ email: email.toLowerCase() });
  if (existing && existing.confirmed && !existing.unsubscribedAt) {
    return NextResponse.json({ message: 'This email is already subscribed.' }, { status: 409 });
  }

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Upsert subscriber with OTP
  await Subscriber.findOneAndUpdate(
    { email: email.toLowerCase() },
    { name: name.trim(), otp, otpExpiresAt, confirmed: false, unsubscribedAt: null },
    { upsert: true, new: true }
  );

  // Send OTP email
  try {
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your subscription — Delower Hossen Tuhin',
      html: `
        <div style="font-family: monospace; max-width: 480px; margin: 0 auto; padding: 2rem; background: #060b1a; color: white; border-radius: 12px;">
          <h2 style="color: #7dd3fc; margin-bottom: 1rem;">Verify your email</h2>
          <p style="color: #94a3b8;">Hi ${name.trim()},</p>
          <p style="color: #94a3b8;">Your one-time verification code is:</p>
          <div style="font-size: 2.5rem; font-weight: bold; color: white; letter-spacing: 0.5rem; text-align: center; padding: 1.5rem; background: rgba(125,211,252,0.1); border-radius: 8px; margin: 1rem 0;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 0.875rem;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  } catch (e) {
    console.error('[subscribe] email send failed:', e);
    return NextResponse.json({ message: 'Failed to send verification email.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'OTP sent. Check your email.' });
}

// Step 2: Verify OTP
export async function PUT(req: Request) {
  if (!hasDatabase) return NextResponse.json({ message: 'Database not configured.' }, { status: 503 });
  const body = await req.json().catch(() => null);
  const { email, otp } = body ?? {};

  if (!email || !otp) return NextResponse.json({ message: 'Email and OTP required.' }, { status: 400 });

  await dbConnect();
  const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

  if (!subscriber) return NextResponse.json({ message: 'Subscriber not found.' }, { status: 404 });
  if (subscriber.otp !== otp) return NextResponse.json({ message: 'Invalid OTP.' }, { status: 400 });
  if (subscriber.otpExpiresAt && new Date() > subscriber.otpExpiresAt) {
    return NextResponse.json({ message: 'OTP expired. Please try again.' }, { status: 400 });
  }

  await Subscriber.findByIdAndUpdate(subscriber._id, {
    confirmed: true,
    otp: null,
    otpExpiresAt: null,
  });

  return NextResponse.json({ message: 'Successfully subscribed!' });
}