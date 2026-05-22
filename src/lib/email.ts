import nodemailer from 'nodemailer';
import { Resend } from 'resend';

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

const FROM = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';

/**
 * Sends an email via Resend if RESEND_API_KEY is configured, otherwise
 * falls back to SMTP. Returns `{ ok, message }` so the API layer can
 * pass through human-friendly responses.
 */
export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: FROM,
        to,
        subject,
        html,
        replyTo: replyTo ? [replyTo] : undefined,
      });
      if (error) return { ok: false, message: error.message };
      return { ok: true, message: 'Sent.' };
    } catch (err) {
      return { ok: false, message: (err as Error).message };
    }
  }

  // SMTP fallback
  const host = process.env.SMTP_HOST;
  if (!host) {
    return {
      ok: false,
      message: 'No email transport configured. Set RESEND_API_KEY or SMTP_HOST.',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });
    await transporter.sendMail({ from: FROM, to, subject, html, replyTo });
    return { ok: true, message: 'Sent.' };
  } catch (err) {
    return { ok: false, message: (err as Error).message };
  }
}
