import type { Metadata } from 'next';
import { seedCinema } from '@/data/site';
import { CinemaGrid } from '@/components/journal/CinemaGrid';

export const metadata: Metadata = {
  title: 'Cinematic Journal',
  description: 'A logbook of films and television, with notes from the dark.',
};

export default function CinematicJournalPage() {
  const entries = [...seedCinema];

  return (
    <>
      {/* Custom dark cinematic hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        {/* Vignette + film-grain ambience */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(124,58,237,0.08),transparent_55%)]" />
        <div className="absolute inset-0 -z-10 bg-tech-grid opacity-20" />

        <div className="container-wide py-24 sm:py-32">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber-300/80">
              The Cinematic Journal
            </p>
            <h1 className="mt-4 h-display text-5xl text-white sm:text-6xl md:text-7xl">
              Watched.{' '}
              <span className="italic text-ink-200">Felt.</span>{' '}
              <span className="text-gradient">Filed.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-ink-200">
              A logbook of films and television I&apos;ve sat with — not a recommendation
              engine. Notes from the dark, ratings on a five-star scale, and the
              occasional quote I refused to forget.
            </p>
          </div>

          {/* Marquee strip */}
          <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-500">
            <span>· Now playing in my head ·</span>
            {seedCinema
              .filter((c) => c.status === 'Watching' || c.status === 'Rewatched')
              .slice(0, 4)
              .map((c) => (
                <span key={c.id} className="text-amber-300/70">
                  {c.title} ({c.year})
                </span>
              ))}
          </div>
        </div>
      </section>

      <CinemaGrid entries={entries} />
    </>
  );
}
