'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronDown, FileText, ExternalLink } from 'lucide-react';

type Publication = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  publisher?: string;
  year: number;
  type?: string;
  tier?: string;
  doi?: string | null;
  url?: string | null;
  status?: string;
  abstract: string;
  keywords: string[];
};

type FilterKey = 'all' | 'published' | 'submitted' | 'journal' | 'conference';

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'submitted', label: 'Under review' },
  { key: 'journal', label: 'Journals' },
  { key: 'conference', label: 'Conferences' },
];

export function PublicationsList({ publications }: { publications: Publication[] }) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (filter === 'all') return publications;
    if (filter === 'published' || filter === 'submitted')
      return publications.filter((p) => p.status === filter);
    return publications.filter((p) => p.type === filter);
  }, [filter, publications]);

  return (
    <div className="mt-10">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative rounded-full px-4 py-1.5 text-sm transition ${
                active ? 'text-ink-950' : 'text-ink-300 hover:text-white'
              }`}
              aria-pressed={active}
            >
              {active && (
                <motion.span
                  layoutId="pub-filter-active"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300 to-azure-300"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative font-medium">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <ul className="mt-8 space-y-4">
        {visible.map((p, i) => {
          const isOpen = expanded === p.id;
          return (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition hover:border-white/10 hover:bg-white/[0.04]"
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : p.id)}
                className="block w-full text-left"
                aria-expanded={isOpen}
              >
                <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6 sm:p-7">
                  <div className="hidden flex-none pt-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-500 sm:block">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${
                        p.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20'
                      }`}>
                        {p.status === 'published' ? 'Published' : 'Under review'}
                      </span>
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-300">{p.type}</span>
                      <span className="text-xs text-ink-400">{p.year}</span>
                    </div>
                    <h3 className="mt-3 font-display text-lg leading-snug text-white sm:text-xl">{p.title}</h3>
                    <p className="mt-2 text-sm text-ink-300">{p.authors.join(', ')}</p>
                    <p className="mt-2 text-xs text-ink-400">
                      <span className="text-ink-200">{p.publisher}</span>
                      <span className="mx-2 text-ink-600">·</span>
                      <span>{p.venue}</span>
                      {p.tier && (<><span className="mx-2 text-ink-600">·</span><span className="text-sky-300">{p.tier}</span></>)}
                    </p>
                  </div>
                  <div className="flex flex-none items-center gap-2 self-start text-ink-400">
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.02] transition group-hover:border-white/20 group-hover:text-white"
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/5 px-6 pb-7 pt-5 sm:px-7">
                      <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">Abstract</p>
                          <p className="mt-2 text-sm leading-relaxed text-ink-200">{p.abstract}</p>
                          <div className="mt-5 flex flex-wrap gap-1.5">
                            {p.keywords.map((k) => (
                              <span key={k} className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-[11px] text-ink-300">{k}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2 border-t border-white/5 pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                          {p.url ? (
                            <a href={p.url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-ink-200 transition hover:border-white/20 hover:text-white"
                            >
                              <span className="flex items-center gap-2"><ExternalLink size={12} /> View paper</span>
                              <ArrowUpRight size={12} />
                            </a>
                          ) : (
                            <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2 text-xs text-ink-500">
                              <FileText size={12} /> Awaiting publication
                            </div>
                          )}
                          {p.doi && (
                            <div className="rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2">
                              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">DOI</p>
                              <p className="mt-1 break-all font-mono text-[11px] text-sky-300">{p.doi}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-sm text-ink-400">Nothing matches that filter yet.</p>
      )}
    </div>
  );
}