'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, Trash2, Check, ChevronDown } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type MRecord = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesManager() {
  const [items, setItems] = useState<MRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/messages');
      const data = await res.json().catch(() => ({ data: [] }));
      setItems(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string, read: boolean) {
    await fetch(`/api/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    load();
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-16">
        <Loader2 size={18} className="animate-spin text-ink-400" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center">
        <Mail size={20} className="mx-auto text-ink-400" />
        <p className="mt-3 font-display text-base text-white">No messages yet</p>
        <p className="mt-1 text-sm text-ink-400">
          Submissions from the contact form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
      <ul className="divide-y divide-white/5">
        {items.map((m) => {
          const isOpen = openId === m._id;
          return (
            <li key={m._id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : m._id)}
                className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/[0.02]"
              >
                <span
                  className={`grid h-9 w-9 flex-none place-items-center rounded-full ${
                    m.read ? 'bg-white/5 text-ink-300' : 'bg-sky-500/20 text-sky-200'
                  }`}
                >
                  <Mail size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">
                    <span className="font-display">{m.name}</span>{' '}
                    <span className="text-ink-400">&lt;{m.email}&gt;</span>
                  </p>
                  <p className="truncate text-xs text-ink-300">{m.subject}</p>
                </div>
                <span className="hidden flex-none text-[11px] text-ink-400 sm:block">
                  {formatDate(m.createdAt)}
                </span>
                {!m.read && (
                  <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-sky-200">
                    New
                  </span>
                )}
                <ChevronDown
                  size={14}
                  className={`flex-none text-ink-400 transition ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-white/5 bg-ink-950 p-5">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-100">
                    {m.message}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-4 py-1.5 text-xs font-medium text-ink-950 hover:opacity-90"
                    >
                      Reply by email
                    </a>
                    <button
                      onClick={() => markRead(m._id, !m.read)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-ink-200 hover:text-white"
                    >
                      <Check size={11} /> Mark {m.read ? 'unread' : 'read'}
                    </button>
                    <button
                      onClick={() => remove(m._id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-rose-300 hover:text-rose-200"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
