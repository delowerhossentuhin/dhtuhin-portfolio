'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HomeCta() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-azure-900 via-ink-900 to-ink-950 p-10 sm:p-16"
        >
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-tech-grid opacity-30" />
          <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-72 w-72 rounded-full bg-azure-500/20 blur-3xl" />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
                What&apos;s next
              </p>
              <h2 className="mt-3 h-display text-3xl text-white sm:text-5xl">
                Looking for advisors,
                <br />
                collaborators, and conversations.
              </h2>
              <p className="mt-4 max-w-lg text-base text-ink-200">
                If you work on federated learning, medical-imaging AI, or interpretability — or you
                run a lab that does — I&apos;d genuinely love to hear from you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-ink-950 transition hover:bg-ink-100"
              >
                Get in touch
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Read research
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
