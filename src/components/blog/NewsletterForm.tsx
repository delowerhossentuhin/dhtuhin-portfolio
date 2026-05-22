'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setMsg(data?.message || 'Could not subscribe. Try again.');
        return;
      }
      setStatus('success');
      setMsg('Subscribed. Welcome.');
      setEmail('');
    } catch {
      setStatus('error');
      setMsg('Network error. Try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="relative block">
        <Mail size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 pl-10 pr-3 text-sm text-white placeholder:text-ink-500 focus:border-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-3 text-sm font-medium text-ink-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Subscribing…
          </>
        ) : (
          'Subscribe'
        )}
      </button>
      {status === 'success' && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-300">
          <Check size={12} /> {msg}
        </p>
      )}
      {status === 'error' && (
        <p className="flex items-center gap-1.5 text-xs text-rose-300">
          <AlertCircle size={12} /> {msg}
        </p>
      )}
    </form>
  );
}
