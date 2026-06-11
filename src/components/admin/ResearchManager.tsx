'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Save, X, Loader2, AlertCircle, Star } from 'lucide-react';

type ResearchRecord = {
  _id?: string;
  id?: string;
  title: string;
  authors: string[] | readonly string[];
  venue: string;
  publisher?: string;
  year: number;
  type?: 'journal' | 'conference' | 'preprint' | 'thesis';
  tier?: string;
  doi?: string | null;
  url?: string | null;
  status?: 'published' | 'submitted' | 'in-review' | 'accepted';
  abstract: string;
  keywords: string[] | readonly string[];
  featured?: boolean;
};

const blank: ResearchRecord = {
  title: '',
  authors: [],
  venue: '',
  publisher: '',
  year: new Date().getFullYear(),
  type: 'conference',
  tier: '',
  doi: '',
  url: '',
  status: 'submitted',
  abstract: '',
  keywords: [],
  featured: false,
};

export function ResearchManager() {
  const [items, setItems] = useState<ResearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ResearchRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/research');
    const data = await res.json().catch(() => ({ data: [] }));
    setItems(data.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleFeatured(item: ResearchRecord) {
    if (!item._id) return;
    await fetch(`/api/research/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...item, featured: !item.featured, authors: Array.from(item.authors ?? []), keywords: Array.from(item.keywords ?? []) }),
    });
    load();
  }

  async function save() {
    if (!editing) return;
    setErr('');
    if (!editing.title || !editing.venue || !editing.abstract) {
      setErr('Title, venue, and abstract are required.');
      return;
    }
    setSaving(true);
    const id = editing._id;
    const payload = {
      ...editing,
      year: Number(editing.year),
      authors: Array.from(editing.authors ?? []),
      keywords: Array.from(editing.keywords ?? []),
    };
    const res = await fetch(id ? `/api/research/${id}` : '/api/research', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data?.message ?? 'Save failed.');
      return;
    }
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this publication?')) return;
    await fetch(`/api/research/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink-300">
          {loading ? 'Loading…' : `${items.length} publication${items.length === 1 ? '' : 's'}`}
        </p>
        <button
          onClick={() => setEditing({ ...blank })}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90"
        >
          <Plus size={14} /> New publication
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        {loading ? (
          <div className="grid place-items-center py-16">
            <Loader2 size={18} className="animate-spin text-ink-400" />
          </div>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink-400">No publications yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {items.map((p) => {
              const isDb = Boolean(p._id);
              return (
                <li key={p._id ?? p.id} className="flex flex-wrap items-start gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base text-white">{p.title}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${
                        p.status === 'published' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
                      }`}>
                        {p.status}
                      </span>
                      {p.featured && (
                        <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-sky-300">
                          ★ Featured
                        </span>
                      )}
                      {!isDb && (
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-ink-300">Seed</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-300">{p.publisher} · {p.venue} · {p.year}</p>
                    <p className="mt-2 line-clamp-2 text-xs text-ink-400">{p.abstract}</p>
                  </div>
                  <div className="flex flex-none items-center gap-1.5">
                    {isDb && (
                      <button
                        onClick={() => toggleFeatured(p)}
                        title={p.featured ? 'Remove from homepage' : 'Feature on homepage'}
                        className={`grid h-8 w-8 place-items-center rounded-lg border transition ${
                          p.featured
                            ? 'border-sky-400/40 bg-sky-400/10 text-sky-300 hover:bg-sky-400/20'
                            : 'border-white/10 bg-white/[0.02] text-ink-400 hover:text-sky-300'
                        }`}
                      >
                        <Star size={13} fill={p.featured ? 'currentColor' : 'none'} />
                      </button>
                    )}
                    <button
                      onClick={() => setEditing({ ...p, authors: Array.from(p.authors ?? []), keywords: Array.from(p.keywords ?? []) })}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-ink-200 hover:text-white"
                    >
                      <Edit3 size={13} />
                    </button>
                    {isDb && (
                      <button
                        onClick={() => remove(p._id!)}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-rose-300 hover:text-rose-200"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
            onClick={() => !saving && setEditing(null)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              className="flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-white/10 bg-ink-950"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-ink-950/85 px-6 py-4 backdrop-blur-md">
                <h2 className="font-display text-lg text-white">{editing._id ? 'Edit publication' : 'New publication'}</h2>
                <button onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink-200 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4 px-6 py-6">
                {/* Featured toggle */}
                <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="text-sm text-white">Feature on homepage</p>
                    <p className="text-xs text-ink-400">Shows in the "Recent publications" section</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, featured: !editing.featured })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${editing.featured ? 'bg-sky-400' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${editing.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <Field label="Title">
                  <input className="adm-input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </Field>
                <Field label="Authors (comma separated)">
                  <input
                    className="adm-input"
                    value={Array.from(editing.authors ?? []).join(', ')}
                    onChange={(e) => setEditing({ ...editing, authors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Venue">
                    <input className="adm-input" value={editing.venue} onChange={(e) => setEditing({ ...editing, venue: e.target.value })} />
                  </Field>
                  <Field label="Publisher">
                    <input className="adm-input" value={editing.publisher ?? ''} onChange={(e) => setEditing({ ...editing, publisher: e.target.value })} />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Year">
                    <input type="number" className="adm-input" value={editing.year} onChange={(e) => setEditing({ ...editing, year: Number(e.target.value) })} />
                  </Field>
                  <Field label="Type">
                    <select className="adm-input" value={editing.type ?? 'conference'} onChange={(e) => setEditing({ ...editing, type: e.target.value as ResearchRecord['type'] })}>
                      <option value="conference">Conference</option>
                      <option value="journal">Journal</option>
                      <option value="preprint">Preprint</option>
                      <option value="thesis">Thesis</option>
                    </select>
                  </Field>
                  <Field label="Status">
                    <select className="adm-input" value={editing.status ?? 'submitted'} onChange={(e) => setEditing({ ...editing, status: e.target.value as ResearchRecord['status'] })}>
                      <option value="published">Published</option>
                      <option value="accepted">Accepted</option>
                      <option value="in-review">In review</option>
                      <option value="submitted">Submitted</option>
                    </select>
                  </Field>
                </div>
                <Field label="Tier / location">
                  <input className="adm-input" value={editing.tier ?? ''} onChange={(e) => setEditing({ ...editing, tier: e.target.value })} placeholder="e.g. Q1, IF = 5.6 or Bali, Indonesia" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="DOI">
                    <input className="adm-input" value={editing.doi ?? ''} onChange={(e) => setEditing({ ...editing, doi: e.target.value })} />
                  </Field>
                  <Field label="URL">
                    <input className="adm-input" value={editing.url ?? ''} onChange={(e) => setEditing({ ...editing, url: e.target.value })} />
                  </Field>
                </div>
                <Field label="Abstract">
                  <textarea className="adm-input min-h-[140px]" value={editing.abstract} onChange={(e) => setEditing({ ...editing, abstract: e.target.value })} />
                </Field>
                <Field label="Keywords (comma separated)">
                  <input
                    className="adm-input"
                    value={Array.from(editing.keywords ?? []).join(', ')}
                    onChange={(e) => setEditing({ ...editing, keywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  />
                </Field>

                {err && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-300">
                    <AlertCircle size={11} /> {err}
                  </p>
                )}
              </div>

              <div className="sticky bottom-0 mt-auto flex justify-end gap-2 border-t border-white/5 bg-ink-950/85 px-6 py-4 backdrop-blur-md">
                <button onClick={() => setEditing(null)} disabled={saving} className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-ink-200 hover:text-white">
                  Cancel
                </button>
                <button onClick={save} disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : <><Save size={13} /> Save</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.adm-input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: white;
        }
        :global(.adm-input:focus) {
          outline: none;
          border-color: rgba(125, 211, 252, 0.4);
          box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.15);
        }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}