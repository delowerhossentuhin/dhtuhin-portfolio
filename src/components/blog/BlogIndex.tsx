'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight, Clock, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { NewsletterForm } from './NewsletterForm';

type BlogPostLite = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverColor: string;
  category: string;
  tags: readonly string[];
  readTime: number;
  date: string;
  featured: boolean;
};

export function BlogIndex({ posts }: { posts: BlogPostLite[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    posts.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCat = category === 'All' || p.category === category;
      if (!matchesCat) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, category]);

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`relative rounded-full px-3.5 py-1.5 text-sm transition ${
                  active ? 'text-ink-950' : 'text-ink-300 hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="blog-cat-active"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300 to-azure-300"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{c}</span>
              </button>
            );
          })}
        </div>

        <label className="relative flex items-center sm:w-72">
          <Search size={14} className="pointer-events-none absolute left-3 text-ink-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, tags…"
            className="w-full rounded-full border border-white/10 bg-white/[0.02] py-2 pl-9 pr-3 text-sm text-white placeholder:text-ink-500 focus:border-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
          />
        </label>
      </div>

      {/* Featured */}
      {featured && (
        <motion.div
          key={featured.id}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative grid overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] transition hover:border-white/10 md:grid-cols-[5fr_4fr]"
          >
            <div
              className="relative min-h-[260px] md:min-h-[360px]"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${featured.coverColor}, transparent 60%), linear-gradient(135deg, ${featured.coverColor} 0%, #060b1a 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-tech-grid opacity-30" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  Featured
                </span>
                <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                  {featured.category}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-6 p-7 md:p-10">
              <div>
                <h3 className="h-display text-2xl text-white sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-200 sm:text-base">
                  {featured.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-ink-400">
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={11} /> {formatDate(featured.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} /> {featured.readTime} min read
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-sky-300 transition group-hover:text-sky-200">
                  Read essay <ArrowUpRight size={13} />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Grid */}
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <Link
              href={`/blog/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition hover:border-white/10"
            >
              <div
                className="h-44"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${p.coverColor}, transparent 60%), linear-gradient(135deg, ${p.coverColor} 0%, #060b1a 100%)`,
                }}
              >
                <div className="h-full bg-tech-grid opacity-25" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">
                  {p.category}
                </p>
                <h3 className="mt-3 font-display text-lg leading-snug text-white transition group-hover:text-sky-200">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-ink-300">{p.excerpt}</p>
                <div className="mt-auto flex items-center justify-between pt-5 text-xs text-ink-400">
                  <span>{formatDate(p.date)}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {p.readTime} min
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-ink-400">
          No posts match that search yet.
        </p>
      )}

      {/* Newsletter */}
      <div className="mt-20 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-sky-500/[0.05] via-white/[0.02] to-azure-700/[0.05] p-8 sm:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">
              Subscribe
            </p>
            <h3 className="mt-3 h-display text-3xl text-white sm:text-4xl">
              New posts in your inbox, never on a schedule.
            </h3>
            <p className="mt-3 text-sm text-ink-300">
              You&apos;ll get an email when there&apos;s a new essay. No marketing, no
              upsells, no &quot;weekly digest&quot; — just the post itself, sent once.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
