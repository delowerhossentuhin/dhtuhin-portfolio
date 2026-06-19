'use client';

import { motion } from 'framer-motion';

type TimelineItem = {
  year: string;
  title: string;
  blurb: string;
  tag: string;
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative mt-14 space-y-12 border-l border-white/10 pl-8 sm:pl-12">
      <span className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-sky-400/40 via-azure-500/20 to-transparent" />
      {items.map((it, i) => (
        <motion.li
          key={it.title + it.year}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="relative"
        >
          <span className="absolute -left-[37px] sm:-left-[49px] top-2 grid h-3 w-3 place-items-center">
            <span className="absolute inset-0 rounded-full bg-sky-400 opacity-30" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-sky-300 ring-2 ring-ink-950" />
          </span>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">{it.year}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-300">{it.tag}</span>
          </div>
          <h3 className="mt-2 font-display text-xl text-white">{it.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-300">{it.blurb}</p>
        </motion.li>
      ))}
    </ol>
  );
}