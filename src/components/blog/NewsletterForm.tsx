'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

type Step = 'form' | 'otp' | 'done';
type Status = 'idle' | 'loading' | 'error';

export function NewsletterForm() {
  const [step, setStep] = useState<Step>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setMsg(data?.message ?? 'Could not subscribe. Try again.');
        return;
      }
      setStatus('idle');
      setStep('otp');
    } catch {
      setStatus('error');
      setMsg('Network error. Try again.');
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setMsg(data?.message ?? 'Invalid OTP. Try again.');
        return;
      }
      setStatus('idle');
      setStep('done');
    } catch {
      setStatus('error');
      setMsg('Network error. Try again.');
    }
  }

  if (step === 'done') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5">
        <Check size={18} className="flex-none text-emerald-300" />
        <div>
          <p className="text-sm font-medium text-white">You&apos;re subscribed!</p>
          <p className="mt-0.5 text-xs text-ink-300">You&apos;ll get an email when a new post lands.</p>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <form onSubmit={handleVerify} className="space-y-3">
        <p className="text-xs text-ink-300">
          We sent a 6-digit code to <span className="text-white">{email}</span>. Enter it below.
        </p>
        <input
          type="text"
          required
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 px-5 text-center text-2xl font-mono tracking-[0.5rem] text-white placeholder:text-ink-500 focus:border-sky-400/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading' || otp.length !== 6}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-3 text-sm font-medium text-ink-950 transition hover:opacity-90 disabled:opacity-60"
        >
          {status === 'loading' ? <><Loader2 size={14} className="animate-spin" /> Verifying…</> : 'Verify & Subscribe'}
        </button>
        <button type="button" onClick={() => { setStep('form'); setOtp(''); setMsg(''); }}
          className="w-full text-center text-xs text-ink-400 hover:text-white transition"
        >
          ← Back
        </button>
        {msg && (
          <p className={`flex items-center gap-1.5 text-xs ${status === 'error' ? 'text-rose-300' : 'text-emerald-300'}`}>
            <AlertCircle size={12} /> {msg}
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="space-y-3">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-full border border-white/10 bg-white/[0.04] py-3 px-4 text-sm text-white placeholder:text-ink-500 focus:border-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
      />
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-3 text-sm font-medium text-ink-950 transition hover:opacity-90 disabled:opacity-60"
      >
        {status === 'loading' ? <><Loader2 size={14} className="animate-spin" /> Sending code…</> : <>Subscribe <ArrowRight size={14} /></>}
      </button>
      {msg && (
        <p className={`flex items-center gap-1.5 text-xs ${status === 'error' ? 'text-rose-300' : 'text-emerald-300'}`}>
          <AlertCircle size={12} /> {msg}
        </p>
      )}
      <p className="text-center text-[11px] text-ink-500">We&apos;ll send a verification code to confirm your email.</p>
    </form>
  );
}