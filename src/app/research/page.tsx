import type { Metadata } from 'next';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { researchInterests, publications as seedPublications, profile } from '@/data/site';
import { PageHeader } from '@/components/ui/PageHeader';
import { PublicationsList } from '@/components/research/PublicationsList';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Publication } from '@/models/Publication';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Research',
  description: 'Publications, research interests, and active projects.',
};

async function getPublications() {
  if (!hasDatabase) {
    return seedPublications.map((p) => ({
      ...p,
      id: p.id,
      keywords: [...p.keywords],
      authors: [...p.authors],
    }));
  }
  try {
    await dbConnect();
    const docs = await Publication.find().sort({ year: -1, createdAt: -1 }).lean();
    if (docs.length > 0) {
      return docs.map((d: any) => ({
        id: d._id.toString(),
        title: d.title,
        authors: d.authors ?? [],
        venue: d.venue,
        publisher: d.publisher ?? '',
        year: d.year,
        type: d.type ?? 'conference',
        tier: d.tier ?? '',
        doi: d.doi ?? null,
        url: d.url ?? null,
        status: d.status ?? 'submitted',
        abstract: d.abstract,
        keywords: d.keywords ?? [],
      }));
    }
  } catch (e) {
    console.error('Research DB fetch failed, falling back to seed:', e);
  }
  return seedPublications.map((p) => ({
    ...p,
    id: p.id,
    keywords: [...p.keywords],
    authors: [...p.authors],
  }));
}

export default async function ResearchPage() {
  const publications = await getPublications();
  const published = publications.filter((p) => p.status === 'published').length;
  const submitted = publications.filter((p) => p.status === 'submitted').length;
  const venues = new Set(publications.map((p) => p.publisher)).size;

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="What I'm working on, with citations attached."
        intro="Seven publications across journals and IEEE conferences — covering federated learning, medical AI, XAI, ensemble methods, and applied NLP. Two more under review."
      />

      <section className="pb-8">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Publications" value={String(publications.length)} sub="total" />
            <Stat label="Published" value={String(published)} sub="peer-reviewed" />
            <Stat label="Under review" value={String(submitted)} sub="submitted" />
            <Stat label="Venues" value={String(venues)} sub="distinct" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <ExternalLink href={profile.social.scholar} label="Google Scholar" />
            <ExternalLink href={profile.social.researchgate} label="ResearchGate" />
            <ExternalLink href={profile.social.orcid} label="ORCID 0009-0009-6560-6138" />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">Research interests</p>
            <h2 className="mt-3 h-display text-4xl text-white sm:text-5xl">
              Six directions, one ethic: useful without being reckless.
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-3">
            {researchInterests.map((r) => {
              const Icon = (Icons[r.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }> | undefined) ?? Icons.Sparkles;
              return (
                <div key={r.title} className="bg-ink-950 p-7">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-sky-500/15 to-azure-700/20 text-sky-300 ring-1 ring-inset ring-sky-500/20">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-5 font-display text-lg text-white">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-300">{r.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-wide">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">Publications</p>
              <h2 className="mt-3 h-display text-4xl text-white sm:text-5xl">The papers, in their own words.</h2>
            </div>
            <Link href={profile.social.scholar} target="_blank" rel="noopener noreferrer" className="text-sm text-sky-300 hover:text-sky-200">
              View on Google Scholar →
            </Link>
          </div>
          <PublicationsList publications={publications} />
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p className="font-display text-3xl text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-ink-400">
        {label} · <span className="text-ink-300">{sub}</span>
      </p>
    </div>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-ink-200 transition hover:border-white/20 hover:text-white"
    >
      {label}
      <Icons.ArrowUpRight size={11} />
    </a>
  );
}