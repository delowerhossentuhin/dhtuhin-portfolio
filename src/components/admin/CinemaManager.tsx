'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Save, X, Loader2, AlertCircle, Star } from 'lucide-react';

type Status = 'Watched' | 'Watching' | 'Watchlist' | 'Rewatched' | 'Dropped';

type CRecord = {
  _id?: string;
  id?: string;
  title: string;
  year: number;
  category: 'Movie' | 'TV Series';
  genres: string[] | readonly string[];
  rating: number;
  status: Status;
  watchDate?: string | Date | null;
  posterColor?: string;
  review?: string;
  quote?: string;
};

const blank: CRecord = {
  title: '',
  year: new Date().getFullYear(),
  category: 'Movie',
  genres: [],
  rating: 0,
  status: 'Watchlist',
  watchDate: null,
  posterColor: '#1e293b',
  review: '',
  quote: '',
};

function toIsoDate(v: string | Date | null | undefined): string {
  if (!v) return '';
  if (typeof v === 'string') return v.slice(0, 10);
  return v.toISOString().slice(0, 10);
}

export function CinemaManager() {
  const [items, setItems] = useState<CRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/cinema');
    const data = await res.json().catch(() => ({ data: [] }));
    setItems(data.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    setErr('');
    if (!editing.title) {
      setErr('Title is required.');
      return;
    }
    setSaving(true);
    const id = editing._id;
    const payload = {
      ...editing,
      year: Number(editing.year),
      rating: Number(editing.rating),
      genres: Array.from(editing.genres ?? []),
      watchDate: editing.watchDate ? editing.watchDate : null,
    };
    const res = await fetch(id ? `/api/cinema/${id}` : '/api/cinema', {
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
    if (!confirm('Delete this entry?')) return;
    await fetch(`/api/cinema/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink-300">
          {loading ? 'Loading…' : `${items.length} entr${items.length === 1 ? 'y' : 'ies'}`}
        </p>
        <button
          onClick={() => setEditing({ ...blank })}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90"
        >
          <Plus size={14} /> New entry
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        {loading ? (
          <div className="grid place-items-center py-16">
            <Loader2 size={18} className="animate-spin text-ink-400" />
          </div>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink-400">Nothing logged yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {items.map((c) => {
              const isDb = Boolean(c._id);
              return (
                <li key={c._id ?? c.id} className="flex items-center gap-4 p-4">
                  <div
                    className="h-12 w-9 flex-none rounded-md"
                    style={{
                      background: `linear-gradient(160deg, ${c.posterColor ?? '#1e293b'}, #060b1a)`,
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm text-white">
                      {c.title}{' '}
                      <span className="font-mono text-[10px] text-amber-300/70">
                        {c.year}
                      </span>
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-ink-400">
                      {c.category} · {c.status}
                      {!isDb && ' · seed'}
                    </p>
                  </div>
                  <span className="flex flex-none items-center gap-1 text-amber-300">
                    <Star size={11} fill="currentColor" strokeWidth={0} />
                    <span className="font-mono text-xs text-ink-200">
                      {c.rating.toFixed(1)}
                    </span>
                  </span>
                  <div className="flex flex-none gap-1.5">
                    <button
                      onClick={() =>
                        setEditing({
                          ...c,
                          genres: Array.from(c.genres ?? []),
                          watchDate: toIsoDate(c.watchDate),
                        })
                      }
                      className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-ink-200 hover:text-white"
                      aria-label="Edit"
                    >
                      <Edit3 size={12} />
                    </button>
                    {isDb && (
                      <button
                        onClick={() => remove(c._id!)}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-rose-300 hover:text-rose-200"
                        aria-label="Delete"
                      >
                        <Trash2 size={12} />
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => !saving && setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-ink-950 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-lg text-white">
                  {editing._id ? 'Edit entry' : 'New entry'}
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink-200"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                  <Field label="Title">
                    <input
                      className="cm-input"
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    />
                  </Field>
                  <Field label="Year">
                    <input
                      type="number"
                      className="cm-input"
                      value={editing.year}
                      onChange={(e) =>
                        setEditing({ ...editing, year: Number(e.target.value) })
                      }
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Category">
                    <select
                      className="cm-input"
                      value={editing.category}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          category: e.target.value as CRecord['category'],
                        })
                      }
                    >
                      <option value="Movie">Movie</option>
                      <option value="TV Series">TV Series</option>
                    </select>
                  </Field>
                  <Field label="Status">
                    <select
                      className="cm-input"
                      value={editing.status}
                      onChange={(e) =>
                        setEditing({ ...editing, status: e.target.value as Status })
                      }
                    >
                      <option>Watched</option>
                      <option>Watching</option>
                      <option>Rewatched</option>
                      <option>Watchlist</option>
                      <option>Dropped</option>
                    </select>
                  </Field>
                  <Field label="Rating (0–5)">
                    <input
                      type="number"
                      min={0}
                      max={5}
                      step={0.5}
                      className="cm-input"
                      value={editing.rating}
                      onChange={(e) =>
                        setEditing({ ...editing, rating: Number(e.target.value) })
                      }
                    />
                  </Field>
                </div>

                <Field label="Genres (comma separated)">
                  <input
                    className="cm-input"
                    value={Array.from(editing.genres ?? []).join(', ')}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        genres: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Watch date">
                    <input
                      type="date"
                      className="cm-input"
                      value={
                        editing.watchDate
                          ? typeof editing.watchDate === 'string'
                            ? editing.watchDate.slice(0, 10)
                            : ''
                          : ''
                      }
                      onChange={(e) =>
                        setEditing({ ...editing, watchDate: e.target.value || null })
                      }
                    />
                  </Field>
                  <Field label="Poster color (hex)">
                    <input
                      type="color"
                      className="h-10 w-full cursor-pointer rounded-md border border-white/10 bg-transparent"
                      value={editing.posterColor ?? '#1e293b'}
                      onChange={(e) =>
                        setEditing({ ...editing, posterColor: e.target.value })
                      }
                    />
                  </Field>
                </div>

                <Field label="Review">
                  <textarea
                    className="cm-input min-h-[100px]"
                    value={editing.review ?? ''}
                    onChange={(e) => setEditing({ ...editing, review: e.target.value })}
                  />
                </Field>
                <Field label="Quote">
                  <input
                    className="cm-input"
                    value={editing.quote ?? ''}
                    onChange={(e) => setEditing({ ...editing, quote: e.target.value })}
                  />
                </Field>

                {err && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-300">
                    <AlertCircle size={11} /> {err}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-ink-200"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Save size={13} /> Save
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.cm-input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          padding: 0.6rem 0.85rem;
          font-size: 0.875rem;
          color: white;
        }
        :global(.cm-input:focus) {
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
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
