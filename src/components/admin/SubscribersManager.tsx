'use client';

import { useEffect, useState } from 'react';
import { Loader2, Trash2, Download, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type SRecord = {
  _id: string;
  email: string;
  confirmed?: boolean;
  createdAt: string;
};

export function SubscribersManager() {
  const [items, setItems] = useState<SRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/subscribers');
      const data = await res.json().catch(() => ({ data: [] }));
      setItems(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm('Remove this subscriber?')) return;
    await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
    load();
  }

  function exportCsv() {
    const rows = ['email,subscribed_at', ...items.map((s) => `${s.email},${s.createdAt}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        <Users size={20} className="mx-auto text-ink-400" />
        <p className="mt-3 font-display text-base text-white">No subscribers yet</p>
        <p className="mt-1 text-sm text-ink-400">
          Newsletter signups from the public blog will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-300">{items.length} subscriber{items.length === 1 ? '' : 's'}</p>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-xs text-ink-200 hover:text-white"
        >
          <Download size={11} /> Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        <ul className="divide-y divide-white/5">
          {items.map((s) => (
            <li key={s._id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{s.email}</p>
                <p className="mt-0.5 text-[11px] text-ink-400">
                  Subscribed {formatDate(s.createdAt)}
                </p>
              </div>
              <button
                onClick={() => remove(s._id)}
                className="grid h-8 w-8 flex-none place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-rose-300 hover:text-rose-200"
                aria-label="Remove"
              >
                <Trash2 size={12} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
