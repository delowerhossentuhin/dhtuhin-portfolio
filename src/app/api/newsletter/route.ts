import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Redirect old newsletter endpoint to new subscribe flow
// This prevents old form from saving unverified subscribers
export async function POST() {
  return NextResponse.json(
    { message: 'Please use the subscribe form with email verification.' },
    { status: 410 }
  );
}