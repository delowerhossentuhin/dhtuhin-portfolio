import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';

/**
 * Returns null if the request is authenticated as an admin, otherwise a
 * NextResponse the caller should return immediately.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }
  return null;
}
