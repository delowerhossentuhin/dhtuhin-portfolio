import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';

export const runtime = 'nodejs';

const Schema = z.object({ email: z.string().email() });

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
      { message: 'Please enter a valid email address.' },
      { status: 422 },
    );
  }

  if (!hasDatabase) {
    // Allow the form to look successful in dev so users can preview the UX.
    return NextResponse.json({
      message:
        'Subscription accepted in preview mode. Configure MONGODB_URI to persist signups.',
    });
  }

  try {
    await dbConnect();
    const email = parsed.data.email.toLowerCase();
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({
        message: 'You are already on the list. Thanks for the enthusiasm.',
      });
    }
    await Subscriber.create({ email });
    return NextResponse.json({ message: 'Subscribed. Welcome.' });
  } catch (err) {
    console.error('[newsletter] failed', err);
    return NextResponse.json(
      { message: 'Could not subscribe right now. Please try again later.' },
      { status: 500 },
    );
  }
}
