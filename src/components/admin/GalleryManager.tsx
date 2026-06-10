'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Save, X, Loader2, AlertCircle, Upload } from 'lucide-react';

type GRecord = {
  _id?: string;
  id?: string;
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  category?: string;
  span?: 'normal' | 'tall' | 'wide';
  order?: number;
};

const blank: GRecord = {
  src: '',
  alt: '',
  title: '',
  caption: '',
  category: 'Personal',
  span: 'normal',
  order: 0,
};

export function GalleryManager() {
  const [items, setItems] = useState<GRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/gallery');
    const data = await res.json().catch(() => ({ data: [] }));
    setItems(data.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    setErr('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Upload failed');
      setEditing({ ...editing, src: data.url });
    } catch (e: any) {
      setErr(e.message ?? 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!editing) return;
    setErr('');
    if (!editing.src || !editing.alt) {
      setErr('Image URL and alt text are required.');
      return;
    }
    setSaving(true);
    const id = editing._id;
    const res = await fetch(id ? `/api/gallery/${id}` : '/api/gallery', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
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
    if (!confirm('Delete this gallery item?')) return;
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink-300">
          {loading ? 'Loading…' : `${items.length} image${items.length === 1 ? '' : 's'}`}
        </p>
        <button
          onClick={() => setEditing({ ...blank })}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90"
        >
          <Plus size={14} /> New image
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-16">
          <Loader2 size={18} className="animate-spin text-ink-400" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => {
            const isDb = Boolean(g._id);
            return (
              <div key={g._id ?? g.id} className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="relative aspect-[4/3] bg-ink-900">
                  {g.src && (
                    <Image src={g.src} alt={g.alt} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm text-white">{g.title || g.alt}</p>
                      <p className="mt-0.5 truncate text-[11px] text-ink-400">
                        {g.category} · {g.span}{!isDb && ' · seed'}
                      </p>
                    </div>
                    <div className="flex flex-none gap-1.5">
                      <button onClick={() => setEditing({ ...g })}
                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-ink-200 hover:text-white"
                      >
                        <Edit3 size={12} />
                      </button>
                      {isDb && (
                        <button onClick={() => remove(g._id!)}
                          className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-rose-300 hover:text-rose-200"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => !saving && setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-ink-950 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-lg text-white">{editing._id ? 'Edit image' : 'New image'}</h2>
                <button onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink-200">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4">

                {/* Upload button */}
                <Field label="Upload image">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] py-4 text-sm text-ink-300 transition hover:border-sky-400/40 hover:text-white disabled:opacity-50"
                  >
                    {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : <><Upload size={14} /> Click to upload image</>}
                  </button>
                </Field>

                {/* Preview */}
                {editing.src && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                    <Image src={editing.src} alt="preview" fill className="object-cover" />
                  </div>
                )}

                {/* OR paste URL manually */}
                <Field label="Or paste image URL">
                  <input
                    className="gm-input"
                    value={editing.src}
                    onChange={(e) => setEditing({ ...editing, src: e.target.value })}
                    placeholder="https://res.cloudinary.com/..."
                  />
                </Field>

                <Field label="Alt text (required)">
                  <input className="gm-input" value={editing.alt} onChange={(e) => setEditing({ ...editing, alt: e.target.value })} />
                </Field>
                <Field label="Title">
                  <input className="gm-input" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </Field>
                <Field label="Caption">
                  <input className="gm-input" value={editing.caption ?? ''} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Category">
                    <input className="gm-input" value={editing.category ?? ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                  </Field>
                  <Field label="Span">
                    <select className="gm-input" value={editing.span ?? 'normal'} onChange={(e) => setEditing({ ...editing, span: e.target.value as GRecord['span'] })}>
                      <option value="normal">Normal (square)</option>
                      <option value="tall">Tall (3:4)</option>
                      <option value="wide">Wide (4:3)</option>
                    </select>
                  </Field>
                </div>

                {err && <p className="flex items-center gap-1.5 text-xs text-rose-300"><AlertCircle size={11} /> {err}</p>}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => setEditing(null)} className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-ink-200">Cancel</button>
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
        :global(.gm-input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          padding: 0.6rem 0.85rem;
          font-size: 0.875rem;
          color: white;
        }
        :global(.gm-input:focus) {
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