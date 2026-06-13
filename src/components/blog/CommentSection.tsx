'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Loader2, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Comment = {
  _id: string;
  content: string;
  authorName: string;
  authorNumber: number | null;
  isSubscriber: boolean;
  createdAt: string;
};

export function CommentSection({ blogSlug }: { blogSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [err, setErr] = useState('');

  async function load() {
    try {
      const res = await fetch(`/api/comments?blogSlug=${blogSlug}`);
      const data = await res.json();
      setComments(data.data ?? []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [blogSlug]);

  async function submit() {
    if (!content.trim()) { setErr('Please write something.'); return; }
    setSubmitting(true);
    setErr('');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogSlug, content, authorName: authorName.trim() || null }),
      });
      if (!res.ok) throw new Error('Failed to post comment');
      setContent('');
      setAuthorName('');
      setSubmitted(true);
      load();
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setErr('Failed to post comment. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-16 border-t border-white/5 pt-12">
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle size={18} className="text-sky-300" />
        <h3 className="font-display text-xl text-white">
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h3>
      </div>

      {/* Comment form */}
      <div className="mb-10 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400 mb-4">Leave a comment</p>
        <div className="space-y-3">
          <input
            className="cs-input"
            placeholder="Your name (optional — leave blank to post anonymously)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
          <textarea
            className="cs-input min-h-[100px]"
            placeholder="Write your thoughts…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {err && <p className="text-xs text-rose-300">{err}</p>}
          {submitted && <p className="text-xs text-emerald-300">Comment posted! ✓</p>}
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-2 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? <><Loader2 size={13} className="animate-spin" /> Posting…</> : <><Send size={13} /> Post comment</>}
          </button>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="grid place-items-center py-8">
          <Loader2 size={16} className="animate-spin text-ink-400" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm text-ink-400 py-8">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence>
            {comments.map((c, i) => (
              <motion.li
                key={c._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sky-500/20 to-azure-700/20 text-sky-300">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {c.isSubscriber ? c.authorName : `Anonymous${c.authorNumber ? ` ${c.authorNumber}` : ''}`}
                    </p>
                    <p className="text-[11px] text-ink-400">{formatDate(c.createdAt)}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-ink-200">{c.content}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <style jsx>{`
        :global(.cs-input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: white;
        }
        :global(.cs-input:focus) {
          outline: none;
          border-color: rgba(125,211,252,0.4);
          box-shadow: 0 0 0 3px rgba(125,211,252,0.15);
        }
        :global(.cs-input::placeholder) { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}