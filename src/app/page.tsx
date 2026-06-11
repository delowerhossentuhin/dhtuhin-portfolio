import { Hero } from '@/components/home/Hero';
import { ResearchAreas } from '@/components/home/ResearchAreas';
import { FeaturedPublications } from '@/components/home/FeaturedPublications';
import { CurrentWork } from '@/components/home/CurrentWork';
import { PhilosophyBlock } from '@/components/home/PhilosophyBlock';
import { HomeCta } from '@/components/home/HomeCta';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Research } from '@/models/Research';
import { publications as seedPublications } from '@/data/site';

export const dynamic = 'force-dynamic';

async function getFeaturedPublications() {
  if (!hasDatabase) {
    return seedPublications
      .filter((p) => p.status === 'published')
      .slice(0, 3)
      .map((p) => ({ ...p, id: p.id, authors: [...p.authors] }));
  }
  try {
    await dbConnect();
    // First try featured ones
    const featured = await Research.find({ featured: true }).sort({ year: -1 }).limit(3).lean();
    if (featured.length > 0) {
      return featured.map((d: any) => ({
        id: d._id.toString(),
        title: d.title,
        authors: d.authors ?? [],
        venue: d.venue,
        tier: d.tier ?? '',
        year: d.year,
        url: d.url ?? null,
      }));
    }
    // Fallback: latest published
    const latest = await Research.find({ status: 'published' }).sort({ year: -1 }).limit(3).lean();
    if (latest.length > 0) {
      return latest.map((d: any) => ({
        id: d._id.toString(),
        title: d.title,
        authors: d.authors ?? [],
        venue: d.venue,
        tier: d.tier ?? '',
        year: d.year,
        url: d.url ?? null,
      }));
    }
  } catch (e) {
    console.error('Featured publications fetch failed:', e);
  }
  return seedPublications
    .filter((p) => p.status === 'published')
    .slice(0, 3)
    .map((p) => ({ ...p, id: p.id, authors: [...p.authors] }));
}

export default async function HomePage() {
  const featuredPublications = await getFeaturedPublications();

  return (
    <>
      <Hero />
      <ResearchAreas />
      <FeaturedPublications publications={featuredPublications} />
      <CurrentWork />
      <PhilosophyBlock />
      <HomeCta />
    </>
  );
}