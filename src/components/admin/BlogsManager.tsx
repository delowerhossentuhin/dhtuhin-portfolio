'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Loader2,
  Star,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { slugify, formatDate } from '@/lib/utils';

type BlogRecord = {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[] | readonly string[];
  coverColor: string;
  readTime: number;
  featured: boolean;
  published?: boolean;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
};

const blank: BlogRecord = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  category: 'Research',
  tags: [],
  coverColor: '#1e3a8a',
  readTime: 5,
  featured: false,
  published: true,
};

export function BlogsManager() {
  const [items, setItems] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setItems(data.data ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing) return;
    setErr('');
    if (!editing.title || !editing.excerpt || !editing.content) {
      setErr('Title, excerpt, and content are required.');
      return;
    }
    setSaving(true);
    const id = editing._id;
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.title),
      tags: typeof editing.tags === 'string' ? [editing.tags] : Array.from(editing.tags ?? []),
    };
    const res = await fetch(id ? `/api/blogs/${id}` : '/api/blogs', {
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
    if (!confirm('Delete this post permanently?')) return;
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    load();
  }

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) =>
        (b.createdAt ?? b.date ?? '') > (a.createdAt ?? a.date ?? '') ? 1 : -1,
      ),
    [items],
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink-300">
          {loading ? 'Loading…' : `${items.length} post${items.length === 1 ? '' : 's'}`}
        </p>
        <button
          onClick={() => setEditing({ ...blank })}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-4 py-2 text-sm font-medium text-ink-950 transition hover:opacity-90"
        >
          <Plus size={14} /> New post
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        {loading ? (
          <div className="grid place-items-center py-16">
            <Loader2 size={18} className="animate-spin text-ink-400" />
          </div>
        ) : sorted.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink-400">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {sorted.map((b) => {
              const id = b._id ?? b.id ?? b.slug;
              const isDb = Boolean(b._id);
              return (
                <li key={id} className="flex flex-wrap items-start gap-4 p-5">
                  <div
                    className="h-12 w-12 flex-none rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${b.coverColor}, #060b1a)`,
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base text-white">{b.title}</h3>
                      {b.featured && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-300/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-amber-200">
                          <Star size={9} /> Featured
                        </span>
                      )}
                      {!isDb && (
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-ink-300">
                          Seed
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-300">{b.excerpt}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-ink-400">
                      <span>{b.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {b.readTime} min
                      </span>
                      {(b.date || b.createdAt) && (
                        <span>{formatDate(b.date ?? b.createdAt!)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-1.5">
                    <IconBtn
                      onClick={() =>
                        setEditing({ ...b, tags: Array.from(b.tags ?? []) })
                      }
                      label="Edit"
                    >
                      <Edit3 size={13} />
                    </IconBtn>
                    {isDb && (
                      <IconBtn onClick={() => remove(b._id!)} label="Delete" danger>
                        <Trash2 size={13} />
                      </IconBtn>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Editor drawer */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
            onClick={() => !saving && setEditing(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 32 }}
              className="flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-white/10 bg-ink-950"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-ink-950/85 px-6 py-4 backdrop-blur-md">
                <h2 className="font-display text-lg text-white">
                  {editing._id ? 'Edit post' : 'New post'}
                </h2>
                <button
                  onClick={() => setEditing(null)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink-200 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-5 px-6 py-6">
                <Field label="Title">
                  <input
                    className="input"
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                  />
                </Field>

                <Field label={`Slug (auto from title if blank)`}>
                  <input
                    className="input"
                    value={editing.slug}
                    onChange={(e) =>
                      setEditing({ ...editing, slug: e.target.value })
                    }
                    placeholder={slugify(editing.title)}
                  />
                </Field>

                <Field label="Excerpt">
                  <textarea
                    className="input min-h-[80px]"
                    value={editing.excerpt}
                    onChange={(e) =>
                      setEditing({ ...editing, excerpt: e.target.value })
                    }
                  />
                </Field>

                <Field label="Content (Markdown)">
                  <textarea
                    className="input min-h-[260px] font-mono text-xs"
                    value={editing.content}
                    onChange={(e) =>
                      setEditing({ ...editing, content: e.target.value })
                    }
                    placeholder="# Heading&#10;&#10;Your essay here…"
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Category">
                    <input
                      className="input"
                      value={editing.category}
                      onChange={(e) =>
                        setEditing({ ...editing, category: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Read time (min)">
                    <input
                      type="number"
                      min={1}
                      className="input"
                      value={editing.readTime}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          readTime: Number(e.target.value),
                        })
                      }
                    />
                  </Field>
                </div>

                <Field label="Tags (comma separated)">
                  <input
                    className="input"
                    value={Array.from(editing.tags ?? []).join(', ')}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        tags: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Field>

                <Field label="Cover color (hex)">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={editing.coverColor}
                      onChange={(e) =>
                        setEditing({ ...editing, coverColor: e.target.value })
                      }
                      className="h-10 w-12 cursor-pointer rounded-md border border-white/10 bg-transparent"
                    />
                    <input
                      className="input flex-1"
                      value={editing.coverColor}
                      onChange={(e) =>
                        setEditing({ ...editing, coverColor: e.target.value })
                      }
                    />
                  </div>
                </Field>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-ink-200">
                    <input
                      type="checkbox"
                      checked={editing.featured}
                      onChange={(e) =>
                        setEditing({ ...editing, featured: e.target.checked })
                      }
                      className="accent-sky-400"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-ink-200">
                    <input
                      type="checkbox"
                      checked={editing.published ?? true}
                      onChange={(e) =>
                        setEditing({ ...editing, published: e.target.checked })
                      }
                      className="accent-sky-400"
                    />
                    Published
                  </label>
                </div>

                {err && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-300">
                    <AlertCircle size={11} /> {err}
                  </p>
                )}
              </div>

              <div className="sticky bottom-0 mt-auto flex justify-end gap-2 border-t border-white/5 bg-ink-950/85 px-6 py-4 backdrop-blur-md">
                <button
                  onClick={() => setEditing(null)}
                  disabled={saving}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-ink-200 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-2 text-sm font-medium text-ink-950 transition hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    <>
                      <Save size={13} /> Save post
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: white;
        }
        :global(.input:focus) {
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

function IconBtn({
  onClick,
  label,
  children,
  danger,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.02] transition hover:border-white/20 ${
        danger ? 'text-rose-300 hover:text-rose-200' : 'text-ink-200 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
