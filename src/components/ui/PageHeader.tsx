'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
}

export function PageHeader({ eyebrow, title, intro, align = 'left' }: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-tech-grid opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent_70%)]" />
        <div className="spotlight" />
      </div>
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">{eyebrow}</p>
          <h1 className="mt-3 h-display text-5xl text-white sm:text-6xl lg:text-[5rem]">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-300 sm:text-lg">
              {intro}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
