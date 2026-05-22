'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2, AlertCircle, Mail, KeyRound } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError('Invalid credentials. Please try again.');
      return;
    }
    if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          Email
        </span>
        <span className="relative mt-2 block">
          <Mail
            size={13}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="block w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-ink-500 focus:border-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
          />
        </span>
      </label>

      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          Password
        </span>
        <span className="relative mt-2 block">
          <KeyRound
            size={13}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="block w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-ink-500 focus:border-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
          />
        </span>
      </label>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-rose-300">
          <AlertCircle size={11} /> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-2.5 text-sm font-medium text-ink-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
}
