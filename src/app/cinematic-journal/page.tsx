import type { Metadata } from 'next';
import { seedCinema } from '@/data/site';
import { CinemaGrid } from '@/components/journal/CinemaGrid';
import { dbConnect } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Cinematic Journal',
  description: 'A logbook of films and television, with notes from the dark.',
};

async function getEntries() {
  try {
    const mongoose = await dbConnect();
    const db = mongoose.connection.db;
    if (!db) throw new Error('DB not connected');
    const docs = await db.collection('cinemas').find({}).sort({ createdAt: -1 }).toArray();
    if (docs.length > 0) {
      return docs.map((d) => ({
        id: (d._id as { toString(): string }).toString(),
        title: d.title as string,
        year: d.year as number,
        category: d.category as 'Movie' | 'TV Series',
        genres: (d.genres as string[]) ?? [],
        rating: d.rating as number,
        status: d.status as 'Watched' | 'Watching' | 'Watchlist' | 'Rewatched' | 'Dropped',
        watchDate: (d.watchDate as string) ?? null,
        posterColor: (d.posterColor as string) ?? '#1e293b',
        posterUrl: (d.posterUrl as string) ?? '',
        review: (d.review as string) ?? '',
        quote: (d.quote as string) ?? '',
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