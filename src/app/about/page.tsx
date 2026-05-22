import type { Metadata } from 'next';
import Image from 'next/image';
import { profile, education, achievements, memberships, languages } from '@/data/site';
import { PageHeader } from '@/components/ui/PageHeader';
import { Timeline } from '@/components/about/Timeline';
import * as Icons from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: `${profile.name} — Biography, academic journey, and personal motivation.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A short biography, in three paragraphs."
        intro="Researcher in training. Built where rigor meets curiosity. Below is the long version — including the parts that don't fit on a CV."
      />

      {/* Biography + portrait */}
      <section className="py-12 sm:py-16">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[1fr,1.4fr] lg:gap-16">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-white/5">
                <Image
                  src="/images/profile/tuhin-about.jpg"
                  alt={profile.name}
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-200">
                    AIUB Campus · 2025
                  </p>
                  <p className="mt-1 font-display text-xl text-white">{profile.name}</p>
                </div>
              </div>

              {/* Quick facts */}
              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <Fact label="Location" value="Dhaka, Bangladesh" />
                <Fact label="Status" value="Final-year UG" />
                <Fact label="CGPA" value="3.95 / 4.00" />
                <Fact label="Next" value="PhD · Fall '26" />
              </dl>
            </div>

            <div className="prose-cinema max-w-none">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">
                Biography
              </p>
              <h2 className="!mt-3 h-display text-4xl text-white">A path through CSE,
                research, and everything in between.</h2>
              {profile.longBio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}

              <p className="mt-8 text-sm font-medium uppercase tracking-[0.18em] text-sky-300">
                Personal Philosophy
              </p>
              <blockquote className="!mt-3">{profile.philosophy}</blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Academic timeline */}
      <section className="py-16 sm:py-24">
        <div className="container-wide">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">
              Academic journey
            </p>
            <h2 className="mt-3 h-display text-4xl text-white sm:text-5xl">
              Twelve years of compounding curiosity.
            </h2>
          </div>
          <Timeline />
        </div>
      </section>

      {/* Education */}
      <section className="py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-white">Education</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {education.map((e) => (
              <article
                key={e.institution}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">
                  {e.period}
                </p>
                <h3 className="mt-2 font-display text-xl text-white">{e.degree}</h3>
                <p className="mt-1 text-sm text-ink-300">{e.institution}</p>
                <p className="mt-3 text-sm text-white">{e.score}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink-300">
                  {e.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-sky-400" />
                      {h}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-white">Achievements & Recognition</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a) => {
              const Icon =
                (Icons[a.icon as keyof typeof Icons] as
                  | React.ComponentType<{ size?: number; className?: string }>
                  | undefined) ?? Icons.Trophy;
              return (
                <article
                  key={a.title}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-white/15"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-sky-500/15 to-azure-700/20 text-sky-300 ring-1 ring-inset ring-sky-500/20">
                      <Icon size={18} />
                    </div>
                    <span className="font-mono text-xs text-ink-400">{a.year}</span>
                  </div>
                  <h3 className="font-display text-lg text-white">{a.title}</h3>
                  <p className="mt-1 text-xs text-ink-400">{a.organization}</p>
                  <p className="mt-3 text-sm text-ink-300">{a.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Memberships & languages */}
      <section className="py-16 sm:py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-white">Memberships</h2>
            <div className="mt-6 space-y-3">
              {memberships.map((m) => (
                <article
                  key={m.name}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-5"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium text-white">{m.name}</h3>
                    {m.id && (
                      <span className="font-mono text-[11px] text-ink-400">{m.id}</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-sky-300">
                    {m.role} · {m.period}
                  </p>
                  <p className="mt-2 text-sm text-ink-300">{m.note}</p>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl text-white">Languages</h2>
            <div className="mt-6 space-y-3">
              {languages.map((l) => (
                <article
                  key={l.name}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-5"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium text-white">{l.name}</h3>
                    <span className="font-mono text-[11px] text-sky-300">{l.level}</span>
                  </div>
                  {l.breakdown && (
                    <p className="mt-2 font-mono text-xs text-ink-400">{l.breakdown}</p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
      <dt className="text-[10px] uppercase tracking-[0.18em] text-ink-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-white">{value}</dd>
    </div>
  );
}
