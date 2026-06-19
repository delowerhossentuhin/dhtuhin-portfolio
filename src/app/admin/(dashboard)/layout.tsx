import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <html lang="en">
        <head>
          <meta httpEquiv="refresh" content="0; url=/admin/login" />
        </head>
        <body style={{ background: '#060b1a' }} />
      </html>
    );
  }

  return (
    <AdminShell user={session.user as { name?: string | null; email?: string | null }}>
      {children}
    </AdminShell>
  );
}