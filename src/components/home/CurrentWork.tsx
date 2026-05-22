'use client';

import { motion } from 'framer-motion';
import { experience } from '@/data/site';
import { SectionHeader } from './ResearchAreas';

export function CurrentWork() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-wide">
        <SectionHeader
          eyebrow="Right now"
          title="Three labs, three lenses."
          intro="What I am currently working on, where, and why each one matters to the larger arc."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {experience.map((e, i) => (
            <motion.div
              key={e.org}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-7 transition hover:border-white/15"
            >
              {/* Decorative number */}
              <span className="absolute -right-4 -top-6 font-display text-[7rem] leading-none text-white/[0.03]">
                {String(i + 1).padStart(2, '0')}
              </span>

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-300">
                {e.focus}
              </p>
              <h3 className="mt-3 font-display text-xl text-white">{e.role}</h3>
              <p className="mt-1 text-sm text-ink-200">{e.org}</p>
              <p className="mt-1 text-xs text-ink-400">{e.period}</p>

              <ul className="mt-6 space-y-2 text-sm text-ink-300">
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-sky-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
