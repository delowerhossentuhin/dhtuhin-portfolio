import type { Metadata } from 'next';
import { seedCinema } from '@/data/site';
import { CinemaGrid } from '@/components/journal/CinemaGrid';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { CinemaEntry } from '@/models/CinemaEntry';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cinematic Journal',
  description: 'A logbook of films and television, with notes from the dark.',
};

async function getEntries() {
  if (!hasDatabase) {
    return [...seedCinema].map((c) => ({ ...c, posterUrl: '' }));
  }
  try {
    await dbConnect();
    const docs = await CinemaEntry.find().sort({ watchDate: -1, createdAt: -1 }).lean();
    if (docs.length > 0) {
      return docs.map((d: any) => ({
        id: d._id.toString(),
        title: d.title,
        year: d.year,
        category: d.category,
        genres: d.genres ?? [],
        rating: d.rating,
        status: d.status,
        watchDate: d.watchDate ?? null,
        posterColor: d.posterColor ?? '#1e293b',
        posterUrl: d.posterUrl ?? '',
        review: d.review ?? '',
        quote: d.quote ?? '',
      }));
    }
  } catch (e) {
    console.error('DB fetch failed, falling back to seed:', e);
  }
  return [...seedCinema].map((c) => ({ ...c, posterUrl: '' }));
}

export default async function CinematicJournalPage() {
  const entries = await getEntries();

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/5">
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

          <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-500">
            <span>· Now playing in my head ·</span>
            {entries
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