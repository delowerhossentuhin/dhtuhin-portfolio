'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import * as Icons from 'lucide-react';
import { skills } from '@/data/site';

export function SkillsGrid() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-wide space-y-6">
        {skills.map((cat, idx) => {
          const Icon =
            (Icons[cat.icon as keyof typeof Icons] as
              | React.ComponentType<{ size?: number; className?: string }>
              | undefined) ?? Icons.Sparkles;
          return (
            <CategoryCard key={cat.category} idx={idx} Icon={Icon} {...cat} />
          );
        })}
      </div>
    </section>
  );
}

interface CategoryCardProps {
  idx: number;
  category: string;
  items: ReadonlyArray<{ name: string; level: number; tag: string }>;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

function CategoryCard({ idx, category, items, Icon }: CategoryCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.025] to-transparent"
    >
      <div className="flex items-center justify-between border-b border-white/5 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-sky-500/15 to-azure-700/20 text-sky-300 ring-1 ring-inset ring-sky-500/20">
            <Icon size={16} />
          </div>
          <h3 className="font-display text-xl text-white">{category}</h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          {String(idx + 1).padStart(2, '0')} / {String(skills.length).padStart(2, '0')}
        </span>
      </div>

      <ul className="divide-y divide-white/5">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-6 p-5 sm:p-6">
            <div className="flex w-44 shrink-0 items-baseline justify-between sm:w-56">
              <span className="text-sm font-medium text-white">{it.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-400">
                {it.tag}
              </span>
            </div>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-400 via-azure-500 to-azure-700"
                initial={{ width: 0 }}
                animate={inView ? { width: `${it.level}%` } : {}}
                transition={{ duration: 1.1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-ink-300">
              {it.level}
              <span className="text-ink-500">%</span>
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
