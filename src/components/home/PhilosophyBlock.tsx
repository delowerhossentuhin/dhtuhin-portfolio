'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { profile } from '@/data/site';

export function PhilosophyBlock() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-azure-900/[0.05] via-transparent to-sky-500/[0.04]" />
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <Quote
            className="mx-auto mb-6 text-sky-400/40"
            size={36}
            strokeWidth={1.5}
          />
          <p className="h-display text-balance text-3xl leading-[1.18] text-white sm:text-4xl lg:text-[2.75rem]">
            &ldquo;{profile.philosophy}&rdquo;
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-400">
            — Personal Research Philosophy
          </p>
        </motion.div>
      </div>
    </section>
  );
}
