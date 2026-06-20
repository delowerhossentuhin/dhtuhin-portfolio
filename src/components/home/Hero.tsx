'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { profile } from '@/data/site';
import { HomeCvButton } from './HomeCvButton';

type HeroData = {
  statusBadge: string;
  headlinePart1: string;
  headlineEm1: string;
  headlinePart2: string;
  headlineEm2: string;
  introText: string;
  taglines: string[];
  stat1Value: string; stat1Label: string; stat1Suffix: string;
  stat2Value: string; stat2Label: string; stat2Suffix: string;
  stat3Value: string; stat3Label: string; stat3Suffix: string;
  portraitUrl: string;
  portraitLocation: string;
};

export function Hero() {
  const [data, setData] = useState<HeroData | null>(null);
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    fetch('/api/hero')
      .then((r) => r.json())
      .then((d) => setData(d.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!data?.taglines?.length) return;
    const id = setInterval(() => setTaglineIdx((i) => (i + 1) % data.taglines.length), 3000);
    return () => clearInterval(id);
  }, [data?.taglines]);

  if (!data) {
    return (
      <section className="relative isolate overflow-hidden pt-32 sm:pt-40 pb-20">
        <div className="container-wide grid place-items-center py-32">
          <Loader2 size={24} className="animate-spin text-ink-500" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden pt-32 sm:pt-40">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-tech-grid opacity-50 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent_70%)]" />
        <div className="spotlight" />
        <div className="absolute -left-40 top-20 h-[40rem] w-[40rem] rounded-full bg-azure-700/20 blur-3xl" />
        <div className="absolute -right-32 top-40 h-[32rem] w-[32rem] rounded-full bg-sky-500/15 blur-3xl" />
      </div>

      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1.35fr,1fr] lg:gap-20">
          {/* Left — copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-ink-300"
            >
              <span className="relative grid h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
                <span className="absolute inset-0 rounded-full bg-emerald-400" />
              </span>
              {data.statusBadge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="h-display text-[2.75rem] leading-[1.02] text-white sm:text-6xl lg:text-[5.5rem]"
            >
              {data.headlinePart1} <em className="text-gradient not-italic">{data.headlineEm1}</em>,
              <br />
              {data.headlinePart2} <em className="text-gradient not-italic">{data.headlineEm2}</em>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-300 sm:text-lg"
            >
              {data.introText}
            </motion.p>

            {/* Rotating subtitle */}
            {data.taglines.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="mt-6 flex h-7 items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-sky-300"
              >
                <Sparkles size={12} />
                <span className="overflow-hidden">
                  <motion.span
                    key={taglineIdx}
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="block"
                  >
                    {data.taglines[taglineIdx]}
                  </motion.span>
                </span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Link href="/research"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink-950 transition hover:bg-ink-100"
              >
                View Research
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <HomeCvButton />
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium text-ink-200 transition hover:text-white">
                Contact Me →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/5 pt-6"
            >
              <Stat value={data.stat1Value} label={data.stat1Label} suffix={data.stat1Suffix} />
              <Stat value={data.stat2Value} label={data.stat2Label} suffix={data.stat2Suffix} />
              <Stat value={data.stat3Value} label={data.stat3Label} suffix={data.stat3Suffix} />
            </motion.div>
          </div>

          {/* Right — portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <PortraitChip portraitUrl={data.portraitUrl} location={data.portraitLocation} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, suffix }: { value: string; label: string; suffix?: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl text-white sm:text-3xl">{value}</span>
        {suffix && <span className="text-xs text-ink-400">{suffix}</span>}
      </div>
      <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-ink-400">{label}</p>
    </div>
  );
}

function PortraitChip({ portraitUrl, location }: { portraitUrl: string; location: string }) {
  const src = portraitUrl || '/images/profile/tuhin-main.jpg';
  return (
    <div className="relative aspect-[4/5] w-full">
      <div className="ring-conic absolute -inset-[2px] rounded-[28px] opacity-90 blur-[2px] animate-[gradientShift_10s_ease_infinite]" />
      <div className="absolute inset-0 rounded-[28px] bg-ink-950" />
      <div className="absolute inset-[1.5px] overflow-hidden rounded-[26px] bg-gradient-to-br from-azure-900/30 to-ink-900">
        <Image
          src={src}
          alt={profile.name}
          fill
          priority
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 500px"
          unoptimized={Boolean(portraitUrl)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-azure-700/10" />
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-200/80">{location}</p>
          <p className="font-display text-lg text-white">{profile.name}</p>
        </div>
        <a href={profile.social.scholar} target="_blank" rel="noopener noreferrer"
          className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white backdrop-blur transition hover:bg-white/20"
        >
          Scholar →
        </a>
      </div>
    </div>
  );
}