'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import { SectionHeader } from './ResearchAreas';

type Publication = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  tier?: string;
  year: number;
  url?: string | null;
};

export function FeaturedPublications({ publications }: { publications: Publication[] }) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-azure-900/[0.05] to-transparent" />

      <div className="container-wide">
        <div className="flex items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Selected work"
            title="Recent publications."
            intro="A representative slice — full record on the Research page."
          />
          <Link
            href="/research"
            className="hidden shrink-0 items-center gap-1 text-sm text-sky-300 transition hover:text-sky-200 lg:inline-flex"
          >
            All papers <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-12 space-y-3">
          {publications.map((p, i) => (
            <motion.a
              key={p.id}
              href={p.url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group relative grid grid-cols-[auto,1fr,auto] items-center gap-6 rounded-2xl border border-white/5 bg-white/[0.015] p-6 transition hover:border-white/15 hover:bg-white/[0.03] sm:gap-8"
            >
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-azure-900/40 to-ink-900 ring-1 ring-inset ring-white/10">
                <span className="font-display text-xl text-white">{p.year}</span>
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">
                  {p.venue} · {p.tier}
                </p>
                <h3 className="mt-2 font-display text-lg leading-snug text-white sm:text-xl">{p.title}</h3>
                <p className="mt-2 hidden truncate text-sm text-ink-400 sm:block">{p.authors.join(', ')}</p>
              </div>
              <div className="hidden items-center gap-1 text-xs text-ink-300 transition group-hover:text-white sm:inline-flex">
                <FileText size={13} /> DOI <ArrowUpRight size={12} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}