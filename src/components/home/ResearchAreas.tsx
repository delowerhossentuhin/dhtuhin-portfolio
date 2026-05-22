'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { researchInterests } from '@/data/site';

export function ResearchAreas() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-wide">
        <SectionHeader
          eyebrow="What I work on"
          title="Six tracks, one through-line."
          intro="The pieces look different on paper, but they share a question: how do we build learning systems that are useful without being reckless?"
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-3">
          {researchInterests.map((r, i) => {
            const Icon =
              (Icons[r.icon as keyof typeof Icons] as
                | React.ComponentType<{ size?: number; className?: string }>
                | undefined) ?? Icons.Sparkles;
            return (
              <motion.article
                key={r.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative bg-ink-950 p-7 transition-colors hover:bg-ink-900/60"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/15 to-azure-700/20 text-sky-300 ring-1 ring-inset ring-sky-500/20">
                  <Icon size={18} />
                </div>
                <h3 className="font-display text-lg text-white">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-300">{r.description}</p>
                <div className="mt-6 flex items-center gap-1.5 text-xs text-sky-300 opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Related publications</span>
                  <Icons.ArrowUpRight size={12} />
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-ink-200 transition hover:border-white/30 hover:text-white"
          >
            See full research record →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">{eyebrow}</p>
      <h2 className="mt-3 h-display text-4xl text-white sm:text-5xl lg:text-6xl">{title}</h2>
      {intro && <p className="mt-4 text-pretty text-base leading-relaxed text-ink-300">{intro}</p>}
    </div>
  );
}
