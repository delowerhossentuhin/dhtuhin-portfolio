import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { SkillsGrid } from '@/components/skills/SkillsGrid';
import { skills } from '@/data/site';

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Programming, machine learning, web, and research tools.',
};

export default function SkillsPage() {
  // small derived stats
  const allItems = skills.flatMap((s) => s.items);
  const avg = Math.round(allItems.reduce((a, b) => a + b.level, 0) / allItems.length);

  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title="The toolkit, honestly."
        intro="No inflated self-ratings. The figures below are based on what I can do without supervision, in a paper or production setting, today."
      />

      <section className="pb-8">
        <div className="container-wide">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Pill label="Categories" value={String(skills.length)} />
            <Pill label="Technologies" value={String(allItems.length)} />
            <Pill label="Avg. competency" value={`${avg}%`} />
            <Pill label="Primary stack" value="Python · TF" />
          </div>
        </div>
      </section>

      <SkillsGrid />

      <section className="py-16 sm:py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-3">
          <SoftCard
            title="Research writing"
            blurb="LaTeX-first technical writing for journals and conferences. Clear figures, careful citations, reproducibility in the methods section."
          />
          <SoftCard
            title="Collaboration"
            blurb="Comfortable working across lab boundaries — co-authored work spans EE, CS, business, and education research groups."
          />
          <SoftCard
            title="Self-direction"
            blurb="Three concurrent research roles while maintaining a 3.95 CGPA — most of what I learn happens after the syllabus runs out."
          />
        </div>
      </section>
    </>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400">{label}</p>
      <p className="mt-1 font-display text-2xl text-white">{value}</p>
    </div>
  );
}

function SoftCard({ title, blurb }: { title: string; blurb: string }) {
  return (
    <article className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <h3 className="font-display text-xl text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-300">{blurb}</p>
    </article>
  );
}
