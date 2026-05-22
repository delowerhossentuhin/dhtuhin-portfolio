'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, AlertCircle, Loader2 } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initial: FormState = { name: '', email: '', subject: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverMsg, setServerMsg] = useState('');

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (form.subject.trim().length < 3) e.subject = 'Add a short subject.';
    if (form.message.trim().length < 15)
      e.message = 'Tell me a bit more — at least 15 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setServerMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setServerMsg(data?.message || 'Something went wrong. Please try again.');
        return;
      }
      setStatus('success');
      setServerMsg(data?.message || 'Message received. I will be in touch.');
      setForm(initial);
    } catch {
      setStatus('error');
      setServerMsg('Network error. Please try again.');
    }
  }

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8"
      noValidate
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => update('name', v)}
          error={errors.name}
          placeholder="Your name"
        />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => update('email', v)}
          error={errors.email}
          placeholder="you@example.com"
        />
      </div>

      <Field
        label="Subject"
        value={form.subject}
        onChange={(v) => update('subject', v)}
        error={errors.subject}
        placeholder="What is this about?"
      />

      <div>
        <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          Message
        </label>
        <textarea
          rows={7}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Tell me a little about your work, your question, or your idea…"
          className={`mt-2 block w-full resize-y rounded-xl border bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:ring-2 ${
            errors.message
              ? 'border-rose-500/50 focus:ring-rose-500/20'
              : 'border-white/10 focus:border-sky-400/40 focus:ring-sky-400/20'
          }`}
        />
        {errors.message && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-300">
            <AlertCircle size={11} /> {errors.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-400">
          I&apos;ll never share your email. Replies usually within a day.
        </p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-6 py-2.5 text-sm font-medium text-ink-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send size={14} /> Send message
            </>
          )}
        </button>
      </div>

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.07] px-4 py-3 text-sm text-emerald-200"
        >
          <Check size={14} /> {serverMsg}
        </motion.div>
      )}
      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/[0.07] px-4 py-3 text-sm text-rose-200"
        >
          <AlertCircle size={14} /> {serverMsg}
        </motion.div>
      )}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`mt-2 block w-full rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-500/50 focus:ring-rose-500/20'
            : 'border-white/10 focus:border-sky-400/40 focus:ring-sky-400/20'
        }`}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-300">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}
