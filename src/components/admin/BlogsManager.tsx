'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X, Loader2, Star, Clock, AlertCircle, Eye, EyeOff, MessageCircle, Upload, Bell } from 'lucide-react';
import { slugify, formatDate } from '@/lib/utils';
import { RichTextEditor } from './RichTextEditor';
import { useRef } from 'react';

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
  coverImage?: string;
  readTime: number;
  featured: boolean;
  published?: boolean;
  date?: string;
  createdAt?: string;
};

type CommentRecord = {
  _id: string;
  content: string;
  authorName: string;
  authorNumber: number | null;
  isSubscriber: boolean;
  isHidden: boolean;
  createdAt: string;
  blogSlug: string;
};

const blank: BlogRecord = {
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  category: 'Research',
  tags: [],
  coverColor: '#1e3a8a',
  coverImage: '',
  readTime: 5,
  featured: false,
  published: true,
};

const FIXED_CATEGORIES = ['Research', 'Engineering', 'ML', 'Personal', 'Tutorial', 'Opinion'];

export function BlogsManager() {
  const [items, setItems] = useState<BlogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [tab, setTab] = useState<'posts' | 'comments'>('posts');
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [sendNotification, setSendNotification] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setItems(data.data ?? []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }

  async function loadComments() {
    setCommentsLoading(true);
    try {
      const res = await fetch('/api/comments/all');
      const data = await res.json();
      setComments(data.data ?? []);
    } catch { setComments([]); }
    finally { setCommentsLoading(false); }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { if (tab === 'comments') loadComments(); }, [tab]);

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? 'Upload failed');
    return data.url;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadingCover(true);
    try {
      const url = await uploadImage(file);
      setEditing({ ...editing, coverImage: url });
    } catch { alert('Cover image upload failed.'); }
    finally { setUploadingCover(false); e.target.value = ''; }
  }

  function getCategory() {
    if (!editing) return 'Research';
    if (editing.category === 'Other') return customCategory.slice(0, 12) || 'Other';
    return editing.category;
  }

  async function save() {
    if (!editing) return;
    setErr('');
    if (!editing.title || !editing.excerpt || !editing.content) {
      setErr('Title, excerpt, and content are required.');
      return;
    }
    setSaving(true);
    const id = editing._id;
    const finalCategory = editing.category === 'Other' ? (customCategory.slice(0, 12) || 'Other') : editing.category;
    const payload = {
      ...editing,
      category: finalCategory,
      slug: editing.slug || slugify(editing.title),
      tags: Array.from(editing.tags ?? []),
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

    // Send notification if checked
    if (sendNotification && !id) {
      const savedData = await res.json().catch(() => ({}));
      const finalSlug = payload.slug;
      fetch('/api/blogs/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: payload.title, excerpt: payload.excerpt, slug: finalSlug }),
      }).catch(console.error);
    }

    setEditing(null);
    setSendNotification(false);
    setCustomCategory('');
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this post permanently?')) return;
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    load();
  }

  async function toggleCommentVisibility(comment: CommentRecord) {
    await fetch(`/api/comments/${comment._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isHidden: !comment.isHidden }),
    });
    loadComments();
  }

  async function deleteComment(id: string) {
    if (!confirm('Delete this comment?')) return;
    await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    loadComments();
  }

  const sorted = useMemo(
    () => [...items].sort((a, b) => ((b.createdAt ?? b.date ?? '') > (a.createdAt ?? a.date ?? '') ? 1 : -1)),
    [items],
  );

  return (
    <>
      {/* Tabs */}
      <div className="mb-6 flex items-center gap-4 border-b border-white/5 pb-4">
        <button onClick={() => setTab('posts')}
          className={`text-sm font-medium transition ${tab === 'posts' ? 'text-white' : 'text-ink-400 hover:text-white'}`}
        >Posts {items.length > 0 && `(${items.length})`}</button>
        <button onClick={() => setTab('comments')}
          className={`flex items-center gap-1.5 text-sm font-medium transition ${tab === 'comments' ? 'text-white' : 'text-ink-400 hover:text-white'}`}
        ><MessageCircle size={14} /> Comments {comments.length > 0 && `(${comments.length})`}</button>
        {tab === 'posts' && (
          <button onClick={() => { setEditing({ ...blank }); setSendNotification(false); setCustomCategory(''); }}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90"
          ><Plus size={14} /> New post</button>
        )}
      </div>

      {/* Posts tab */}
      {tab === 'posts' && (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
          {loading ? (
            <div className="grid place-items-center py-16"><Loader2 size={18} className="animate-spin text-ink-400" /></div>
          ) : sorted.length === 0 ? (
            <p className="p-10 text-center text-sm text-ink-400">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {sorted.map((b) => {
                const id = b._id ?? b.id ?? b.slug;
                const isDb = Boolean(b._id);
                return (
                  <li key={id} className="flex flex-wrap items-start gap-4 p-5">
                    <div className="h-12 w-12 flex-none overflow-hidden rounded-lg">
                      {b.coverImage ? (
                        <img src={b.coverImage} alt={b.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${b.coverColor}, #060b1a)` }} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-base text-white">{b.title}</h3>
                        {b.featured && <span className="flex items-center gap-1 rounded-full bg-amber-300/20 px-2 py-0.5 text-[10px] uppercase text-amber-200"><Star size={9} /> Featured</span>}
                        {!b.published && <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-ink-400">Draft</span>}
                        {!isDb && <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-ink-300">Seed</span>}
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-ink-300">{b.excerpt}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-ink-400">
                        <span>{b.category}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {b.readTime} min</span>
                        {(b.date || b.createdAt) && <span>{formatDate(b.date ?? b.createdAt!)}</span>}
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-1.5">
                      <button onClick={() => { setEditing({ ...b, tags: Array.from(b.tags ?? []) }); setCustomCategory(''); setSendNotification(false); }}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-ink-200 hover:text-white"
                      ><Edit3 size={13} /></button>
                      {isDb && (
                        <button onClick={() => remove(b._id!)}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-rose-300 hover:text-rose-200"
                        ><Trash2 size={13} /></button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Comments tab */}
      {tab === 'comments' && (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
          {commentsLoading ? (
            <div className="grid place-items-center py-16"><Loader2 size={18} className="animate-spin text-ink-400" /></div>
          ) : comments.length === 0 ? (
            <p className="p-10 text-center text-sm text-ink-400">No comments yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {comments.map((c) => (
                <li key={c._id} className={`flex gap-4 p-5 ${c.isHidden ? 'opacity-40' : ''}`}>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white">
                        {c.isSubscriber ? c.authorName : `Anonymous${c.authorNumber ? ` ${c.authorNumber}` : ''}`}
                      </span>
                      {c.isHidden && <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] text-rose-300">Hidden</span>}
                      <span className="text-[11px] text-ink-400">on /{c.blogSlug}</span>
                      <span className="text-[11px] text-ink-500">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-ink-200">{c.content}</p>
                  </div>
                  <div className="flex flex-none gap-1.5">
                    <button onClick={() => toggleCommentVisibility(c)} title={c.isHidden ? 'Show' : 'Hide'}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-ink-200 hover:text-white"
                    >{c.isHidden ? <Eye size={13} /> : <EyeOff size={13} />}</button>
                    <button onClick={() => deleteComment(c._id)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-rose-300 hover:text-rose-200"
                    ><Trash2 size={13} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Editor drawer */}
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
              className="flex h-full w-full max-w-4xl flex-col overflow-y-auto border-l border-white/10 bg-ink-950"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-ink-950/85 px-6 py-4 backdrop-blur-md">
                <h2 className="font-display text-lg text-white">{editing._id ? 'Edit post' : 'New post'}</h2>
                <button onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink-200 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-5 px-6 py-6">
                <Field label="Title">
                  <input className="input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </Field>

                <Field label="Slug (URL — auto from title if blank)">
                  <input className="input" value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder={slugify(editing.title)}
                  />
                </Field>

                <Field label="Excerpt">
                  <textarea className="input min-h-[80px]" value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
                </Field>

                <Field label="Content">
                  <RichTextEditor
                    content={editing.content}
                    onChange={(html) => setEditing({ ...editing, content: html })}
                    onImageUpload={uploadImage}
                  />
                </Field>

                {/* Cover image upload */}
                <Field label="Cover image">
                  <input ref={coverFileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => coverFileRef.current?.click()} disabled={uploadingCover}
                      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-300 transition hover:border-sky-400/40 hover:text-white disabled:opacity-50"
                    >
                      {uploadingCover ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : <><Upload size={14} /> Upload cover image</>}
                    </button>
                    {editing.coverImage && (
                      <img src={editing.coverImage} alt="cover" className="h-12 w-16 rounded-lg object-cover border border-white/10" />
                    )}
                  </div>
                </Field>

                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Category with Other option */}
                  <Field label="Category">
                    <select className="input" value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    >
                      {FIXED_CATEGORIES.map((c) => <option key={c} value={c} className="bg-ink-950">{c}</option>)}
                      <option value="Other" className="bg-ink-950">Other…</option>
                    </select>
                    {editing.category === 'Other' && (
                      <input
                        className="input mt-2"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value.slice(0, 12))}
                        placeholder="Category name (max 12 chars)"
                        maxLength={12}
                      />
                    )}
                  </Field>

                  <Field label="Read time (min)">
                    <input type="number" min={1} className="input" value={editing.readTime}
                      onChange={(e) => setEditing({ ...editing, readTime: Number(e.target.value) })}
                    />
                  </Field>

                  <Field label="Cover color (fallback)">
                    <div className="flex items-center gap-2">
                      <input type="color" value={editing.coverColor}
                        onChange={(e) => setEditing({ ...editing, coverColor: e.target.value })}
                        className="h-10 w-12 cursor-pointer rounded-md border border-white/10 bg-transparent"
                      />
                      <input className="input flex-1" value={editing.coverColor}
                        onChange={(e) => setEditing({ ...editing, coverColor: e.target.value })}
                      />
                    </div>
                  </Field>
                </div>

                <Field label="Tags (comma separated)">
                  <input className="input" value={Array.from(editing.tags ?? []).join(', ')}
                    onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                  />
                </Field>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm text-ink-200">
                    <input type="checkbox" checked={editing.featured}
                      onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                      className="accent-sky-400"
                    /> Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm text-ink-200">
                    <input type="checkbox" checked={editing.published ?? true}
                      onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                      className="accent-sky-400"
                    /> Published
                  </label>
                  {/* Notify subscribers — only for new posts */}
                  {!editing._id && (
                    <label className="flex items-center gap-2 text-sm text-ink-200">
                      <input type="checkbox" checked={sendNotification}
                        onChange={(e) => setSendNotification(e.target.checked)}
                        className="accent-sky-400"
                      />
                      <Bell size={13} className="text-sky-300" />
                      Notify subscribers by email
                    </label>
                  )}
                </div>

                {err && <p className="flex items-center gap-1.5 text-xs text-rose-300"><AlertCircle size={11} /> {err}</p>}
              </div>

              <div className="sticky bottom-0 mt-auto flex justify-end gap-2 border-t border-white/5 bg-ink-950/85 px-6 py-4 backdrop-blur-md">
                <button onClick={() => setEditing(null)} disabled={saving}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-ink-200 hover:text-white"
                >Cancel</button>
                <button onClick={save} disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : <><Save size={13} /> Save post</>}
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
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: white;
        }
        :global(.input:focus) {
          outline: none;
          border-color: rgba(125,211,252,0.4);
          box-shadow: 0 0 0 3px rgba(125,211,252,0.15);
        }
        :global(.ProseMirror) { min-height: 400px; padding: 1rem; color: white; outline: none; }
        :global(.ProseMirror p.is-editor-empty:first-child::before) { color: rgba(255,255,255,0.3); content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
        :global(.ProseMirror h1) { font-size: 2rem; font-weight: bold; margin: 1rem 0 0.5rem; color: white; }
        :global(.ProseMirror h2) { font-size: 1.5rem; font-weight: bold; margin: 1rem 0 0.5rem; color: white; }
        :global(.ProseMirror h3) { font-size: 1.25rem; font-weight: bold; margin: 0.75rem 0 0.5rem; color: white; }
        :global(.ProseMirror p) { margin: 0.5rem 0; color: rgba(255,255,255,0.8); line-height: 1.7; }
        :global(.ProseMirror ul) { list-style: disc; padding-left: 1.5rem; color: rgba(255,255,255,0.8); }
        :global(.ProseMirror ol) { list-style: decimal; padding-left: 1.5rem; color: rgba(255,255,255,0.8); }
        :global(.ProseMirror blockquote) { border-left: 3px solid rgba(125,211,252,0.5); padding-left: 1rem; color: rgba(255,255,255,0.6); font-style: italic; margin: 1rem 0; }
        :global(.ProseMirror code) { background: rgba(255,255,255,0.1); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.85em; }
        :global(.ProseMirror img) { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; }
        :global(.ProseMirror mark) { background: rgba(250,204,21,0.3); color: white; padding: 0.1rem 0.2rem; border-radius: 2px; }
        :global(.ProseMirror a) { color: #7dd3fc; text-decoration: underline; }
        :global(.ProseMirror hr) { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5rem 0; }
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