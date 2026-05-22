import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';
import { Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin · Sign in',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-950 px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-tech-grid opacity-20" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.07),transparent_55%)]" />

      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <Lock size={16} className="text-sky-300" />
          </div>
          <h1 className="mt-5 h-display text-3xl text-white">Sign in to the admin</h1>
          <p className="mt-2 text-sm text-ink-300">
            Authorized access only. Use your admin credentials to continue.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-7">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">
          Forgot your password? Reset it via the seed script, then sign in again.
        </p>
      </div>
    </div>
  );
}
