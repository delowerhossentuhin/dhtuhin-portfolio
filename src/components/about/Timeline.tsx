'use client';

import { motion } from 'framer-motion';

const items = [
  {
    year: '2026',
    title: 'Research Intern · AMIR Lab',
    blurb:
      'Joined the Advanced Machine Intelligence Research lab to focus on federated learning and privacy-preserving distributed training.',
    tag: 'Now',
  },
  {
    year: '2025–26',
    title: 'Research & Development · Deepchain Lab',
    blurb:
      'Worked on Web3 architectures and quantum-blockchain integrations; shipped production React/Next.js components.',
    tag: 'Past',
  },
  {
    year: '2024',
    title: 'Research Assistant · Tech Wing\'s Lab',
    blurb:
      'Began applied-ML research — pipelines, model evaluation, and LaTeX-first technical writing.',
    tag: 'Past',
  },
  {
    year: '2024',
    title: 'Aspire Leaders Program · Harvard faculty',
    blurb:
      'Selected for the global leadership-development program with faculty participation from Harvard University.',
    tag: 'Milestone',
  },
  {
    year: '2024',
    title: 'Dean\'s List Honor · AIUB',
    blurb:
      "Recognized for sustained academic excellence at the top of the CSE cohort; repeated in 2025.",
    tag: 'Milestone',
  },
  {
    year: '2022',
    title: 'Began B.Sc. in CSE · AIUB',
    blurb:
      'Awarded the Academic Excellence Scholarship covering the duration of undergraduate study (2023–2026).',
    tag: 'Start',
  },
  {
    year: '2021',
    title: 'HSC · Murari Chand College, Sylhet',
    blurb: 'Completed Higher Secondary Certificate with a perfect GPA of 5.00 / 5.00.',
    tag: 'Past',
  },
  {
    year: '2016',
    title: 'Junior Scholarship · Sylhet Zone',
    blurb: 'Bangladesh Govt. Education Board scholarship — earliest formal academic recognition.',
    tag: 'Past',
  },
];

export function Timeline() {
  return (
    <ol className="relative mt-14 space-y-12 border-l border-white/10 pl-8 sm:pl-12">
      {/* Animated tracer */}
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
          {/* Dot */}
          <span className="absolute -left-[37px] sm:-left-[49px] top-2 grid h-3 w-3 place-items-center">
            <span className="absolute inset-0 rounded-full bg-sky-400 opacity-30" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-sky-300 ring-2 ring-ink-950" />
          </span>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
              {it.year}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-300">
              {it.tag}
            </span>
          </div>
          <h3 className="mt-2 font-display text-xl text-white">{it.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-300">{it.blurb}</p>
        </motion.li>
      ))}
    </ol>
  );
}
