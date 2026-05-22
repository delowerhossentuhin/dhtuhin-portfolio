'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  category: string;
  span: string;
};

export function GalleryMasonry({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    items.forEach((i) => set.add(i.category));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(
    () => (category === 'All' ? items : items.filter((i) => i.category === category)),
    [items, category],
  );

  // Reset open index whenever the filter changes so it always references the
  // currently-visible list.
  useEffect(() => {
    setOpenIndex(null);
  }, [category]);

  // Keyboard navigation in the lightbox.
  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight')
        setOpenIndex((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === 'ArrowLeft')
        setOpenIndex((i) =>
          i === null ? null : (i - 1 + filtered.length) % filtered.length,
        );
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, filtered.length]);

  return (
    <>
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
                  layoutId="gallery-cat-active"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-300 to-azure-300"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{c}</span>
            </button>
          );
        })}
      </div>

      {/* CSS columns masonry */}
      <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {filtered.map((item, i) => {
          const aspect =
            item.span === 'tall'
              ? 'aspect-[3/4]'
              : item.span === 'wide'
                ? 'aspect-[4/3]'
                : 'aspect-square';
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setOpenIndex(i)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group mb-5 block w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] text-left transition hover:border-white/15 [break-inside:avoid]"
            >
              <div className={`relative w-full ${aspect}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <p className="font-display text-sm text-white">{item.title}</p>
                  <p className="text-[11px] text-ink-200">{item.caption}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-sm text-ink-400">
          Nothing in this category yet.
        </p>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {openIndex !== null && filtered[openIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setOpenIndex(null)}
          >
            <button
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
            >
              <X size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) =>
                  i === null ? null : (i - 1 + filtered.length) % filtered.length,
                );
              }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) =>
                  i === null ? null : (i + 1) % filtered.length,
                );
              }}
              aria-label="Next"
              className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
            >
              <ChevronRight size={18} />
            </button>

            <motion.div
              key={filtered[openIndex].id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[88vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[80vh] w-full overflow-hidden rounded-xl bg-ink-900">
                <Image
                  src={filtered[openIndex].src}
                  alt={filtered[openIndex].alt}
                  width={1600}
                  height={1200}
                  className="mx-auto max-h-[80vh] w-auto object-contain"
                  priority
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-display text-base text-white">
                  {filtered[openIndex].title}
                </p>
                <p className="mt-1 text-xs text-ink-300">{filtered[openIndex].caption}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                  {openIndex + 1} / {filtered.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
