import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { ContactMessage } from '@/models/ContactMessage';
import { sendEmail } from '@/lib/email';
import { profile } from '@/data/site';

export const runtime = 'nodejs';

const Schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(15).max(5000),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Please check the form fields and try again.' },
      { status: 422 },
    );
  }

  const { name, email, subject, message } = parsed.data;

  // Persist if we have a database
  if (hasDatabase) {
    try {
      await dbConnect();
      await ContactMessage.create({ name, email, subject, message });
    } catch (err) {
      // Don't block delivery on persistence failures
      console.error('[contact] persist failed', err);
    }
  }

  // Send notification email
  const to = process.env.CONTACT_TO_EMAIL ?? profile.contactEmail;
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#0c4a6e;margin-bottom:4px">New message from your portfolio</h2>
      <p style="color:#475569;margin-top:0">Sent ${new Date().toUTCString()}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:18px">
        <tr><td style="padding:6px 0;color:#64748b">From</td><td style="padding:6px 0"><strong>${name}</strong> &lt;${email}&gt;</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Subject</td><td style="padding:6px 0">${subject}</td></tr>
      </table>
      <div style="margin-top:18px;padding:14px 16px;background:#f1f5f9;border-radius:10px;color:#0f172a;white-space:pre-wrap;line-height:1.55">${message}</div>
    </div>`;

  const mail = await sendEmail({
    to,
    subject: `Portfolio: ${subject}`,
    html,
    replyTo: email,
  });

  // We still consider the submission "received" even if email transport
  // is not configured — the DB persisted it (if available) and the admin
  // dashboard can read it later.
  if (!mail.ok && !hasDatabase) {
    return NextResponse.json(
      {
        message:
          'Email transport is not configured yet. Please email me directly at ' +
          profile.email,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    message: 'Thanks — your message was received. I will reply soon.',
  });
}
