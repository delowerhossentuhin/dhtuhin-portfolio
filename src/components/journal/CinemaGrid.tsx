'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, Film, Tv, Bookmark, X, Quote, Eye, RotateCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type CinemaEntry = {
  id: string;
  title: string;
  year: number;
  category: 'Movie' | 'TV Series';
  genres: readonly string[];
  rating: number;
  status: 'Watched' | 'Watching' | 'Watchlist' | 'Rewatched' | 'Dropped';
  watchDate: string | null;
  posterColor: string;
  posterUrl?: string;
  review: string;
  quote: string;
};

type FilterKey = 'all' | 'movies' | 'tv' | 'watchlist' | 'highest' | 'lowest' | 'recent';

const filterDefs: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'movies', label: 'Movies' },
  { key: 'tv', label: 'TV Series' },
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'highest', label: 'Highest Rated' },
  { key: 'lowest', label: 'Lowest Rated' },
  { key: 'recent', label: 'Recently Watched' },
];

export function CinemaGrid({ entries }: { entries: CinemaEntry[] }) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [genre, setGenre] = useState<string>('All');
  const [open, setOpen] = useState<CinemaEntry | null>(null);

  const allGenres = useMemo(() => {
    const set = new Set<string>(['All']);
    entries.forEach((e) => e.genres.forEach((g) => set.add(g)));
    return Array.from(set);
  }, [entries]);

  const visible = useMemo(() => {
    let list = [...entries];
    switch (filter) {
      case 'movies': list = list.filter((e) => e.category === 'Movie'); break;
      case 'tv': list = list.filter((e) => e.category === 'TV Series'); break;
      case 'watchlist': list = list.filter((e) => e.status === 'Watchlist'); break;
      case 'highest': list = list.filter((e) => e.status !== 'Watchlist').sort((a, b) => b.rating - a.rating); break;
      case 'lowest': list = list.filter((e) => e.status !== 'Watchlist').sort((a, b) => a.rating - b.rating); break;
      case 'recent': list = list.filter((e) => e.watchDate).sort((a, b) => (a.watchDate ?? '') < (b.watchDate ?? '') ? 1 : -1); break;
    }
    if (genre !== 'All') list = list.filter((e) => e.genres.includes(genre));
    return list;
  }, [entries, filter, genre]);

  const stats = useMemo(() => {
    const watched = entries.filter((e) => e.status === 'Watched' || e.status === 'Rewatched');
    const avg = watched.length ? watched.reduce((s, e) => s + e.rating, 0) / watched.length : 0;
    return { total: entries.length, watched: watched.length, avg: avg.toFixed(1), watchlist: entries.filter((e) => e.status === 'Watchlist').length };
  }, [entries]);

  return (
    <>
      {/* Stats */}
      <section className="border-b border-white/5 py-10">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <CinemaStat label="Entries" value={String(stats.total)} />
            <CinemaStat label="Watched" value={String(stats.watched)} />
            <CinemaStat label="Avg rating" value={`${stats.avg} / 5`} />
            <CinemaStat label="Watchlist" value={String(stats.watchlist)} />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-white/5 bg-ink-950/85 py-4 backdrop-blur-md">
        <div className="container-wide flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1">
            {filterDefs.map((f) => {
              const active = filter === f.key;
              return (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`relative flex-none rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.12em] transition ${active ? 'text-ink-950' : 'text-ink-300 hover:text-white'}`}
                >
                  {active && (
                    <motion.span layoutId="cinema-filter-active"
                      className="absolute inset-0 rounded-full bg-amber-300"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative font-medium">{f.label}</span>
                </button>
              );
            })}
          </div>
          <select value={genre} onChange={(e) => setGenre(e.target.value)}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-ink-100 focus:border-amber-300/40 focus:outline-none"
          >
            {allGenres.map((g) => (
              <option key={g} value={g} className="bg-ink-950 text-white">Genre: {g}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 sm:py-16">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((e, i) => (
              <motion.button key={e.id} type="button" onClick={() => setOpen(e)}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="group relative aspect-[2/3] overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] text-left transition hover:border-amber-300/30"
              >
                {/* Poster */}
                {e.posterUrl ? (
                  <img src={e.posterUrl} alt={e.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${e.posterColor} 0%, #0a0f1f 75%, #060b1a 100%)` }} />
                )}
                <div className="absolute inset-0 bg-tech-grid opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Badges */}
                <div className="absolute left-2.5 right-2.5 top-2.5 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    {e.category === 'Movie' ? <Film size={9} /> : <Tv size={9} />}
                    {e.category === 'Movie' ? 'Film' : 'Series'}
                  </span>
                  {e.status === 'Watchlist' && <span className="flex items-center gap-1 rounded-full bg-amber-300/90 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-ink-950"><Bookmark size={9} /> Saved</span>}
                  {e.status === 'Watching' && <span className="flex items-center gap-1 rounded-full bg-emerald-400/90 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-ink-950"><Eye size={9} /> Now</span>}
                  {e.status === 'Rewatched' && <span className="flex items-center gap-1 rounded-full bg-sky-300/90 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-ink-950"><RotateCw size={9} /> Re</span>}
                </div>

                {/* Title */}
                <div className="absolute inset-x-3 bottom-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300/80">{e.year}</p>
                  <h3 className="mt-1 font-display text-base leading-tight text-white sm:text-lg">{e.title}</h3>
                  <div className="mt-2"><StarRow rating={e.rating} /></div>
                </div>

                {/* Hover */}
                <div className="absolute inset-0 grid place-items-center bg-black/70 px-4 opacity-0 transition group-hover:opacity-100">
                  <p className="line-clamp-6 text-center text-[11px] leading-relaxed text-ink-100">{e.review}</p>
                </div>
              </motion.button>
            ))}
          </div>
          {visible.length === 0 && <p className="mt-16 text-center text-sm text-ink-400">No entries match that combination yet.</p>}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setOpen(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-ink-950"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(null)} aria-label="Close"
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
              >
                <X size={15} />
              </button>

              {/* Modal header — image or gradient */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                {open.posterUrl ? (
                  <img src={open.posterUrl} alt={open.title} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="h-full" style={{ background: `linear-gradient(180deg, ${open.posterColor} 0%, #060b1a 100%)` }}>
                    <div className="h-full bg-tech-grid opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 to-transparent" />
              </div>

              <div className="p-7 sm:p-9">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-white">
                    {open.category === 'Movie' ? <Film size={10} /> : <Tv size={10} />}{open.category}
                  </span>
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-ink-200">{open.status}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300/80">{open.year}</span>
                </div>
                <h3 className="mt-4 h-display text-3xl text-white sm:text-4xl">{open.title}</h3>
                <div className="mt-3 flex items-center gap-4">
                  <StarRow rating={open.rating} large />
                  {open.watchDate && <span className="flex items-center gap-1 text-xs text-ink-300"><Calendar size={11} /> {formatDate(open.watchDate)}</span>}
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {open.genres.map((g) => (
                    <span key={g} className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-[11px] text-ink-300">{g}</span>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-relaxed text-ink-100">{open.review}</p>
                {open.quote && (
                  <blockquote className="mt-6 border-l-2 border-amber-300/60 pl-4">
                    <div className="flex items-start gap-2 text-ink-200">
                      <Quote size={14} className="mt-1 flex-none text-amber-300/70" />
                      <p className="font-display italic">{open.quote}</p>
                    </div>
                  </blockquote>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CinemaStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p className="font-display text-3xl text-white">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300/70">{label}</p>
    </div>
  );
}

function StarRow({ rating, large = false }: { rating: number; large?: boolean }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const size = large ? 16 : 12;
  return (
    <div className="flex items-center gap-0.5 text-amber-300" aria-label={`Rating ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isFilled = i < full;
        const isHalf = i === full && half;
        return (
          <span key={i} className="relative inline-block">
            <Star size={size} className={isFilled ? 'fill-amber-300' : ''} strokeWidth={1.6} fill={isFilled ? 'currentColor' : 'none'} />
            {isHalf && (
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                <Star size={size} className="fill-amber-300" strokeWidth={1.6} fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
      {large && <span className="ml-2 font-mono text-xs text-ink-200">{rating.toFixed(1)}</span>}
    </div>
  );
}