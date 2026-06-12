import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { profile, education, experience } from '@/data/site';
import { PageHeader } from '@/components/ui/PageHeader';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { ResumeSettings } from '@/models/ResumeSettings';
import { Research } from '@/models/Research';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Download the full CV or read the inline summary.',
};

async function getResumeData() {
  const fallback = { cvUrl: profile.resumePath, updatedLabel: 'April 2026', publicationCount: 7 };
  if (!hasDatabase) return fallback;
  try {
    await dbConnect();
    const [settings, pubCount] = await Promise.all([
      ResumeSettings.findOne().lean() as any,
      Research.countDocuments(),
    ]);
    return {
      cvUrl: settings?.cvUrl || profile.resumePath,
      updatedLabel: settings?.updatedLabel || 'April 2026',
      publicationCount: pubCount || fallback.publicationCount,
    };
  } catch (e) {
    console.error('Resume data fetch failed:', e);
    return fallback;
  }
}

export default async function ResumePage() {
  const { cvUrl, updatedLabel, publicationCount } = await getResumeData();

  return (
    <>
      <PageHeader
        eyebrow="Curriculum vitae"
        title="The full document, plus a fast summary."
        intro="The embedded viewer shows the same PDF you'll get on download — laid out for academic submissions and PhD applications."
      />

      <section className="pb-24">
        <div className="container-wide">
          <div className="flex flex-wrap items-center gap-3">
            {/* download attribute only on this button — not on the embedded viewer */}
            <a
              href={cvUrl}
              download="Delower_Hossen_Tuhin_CV.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-2.5 text-sm font-medium text-ink-950 transition hover:opacity-90"
            >
              <Download size={15} /> Download CV (PDF)
            </a>
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm text-ink-100 transition hover:border-white/30 hover:text-white"
            >
              Open in new tab <ArrowUpRight size={14} />
            </a>
            <span className="ml-auto font-mono text-xs uppercase tracking-[0.18em] text-ink-500">
              Last updated · {updatedLabel}
            </span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Embedded PDF viewer — NO download attribute here */}
            <div className="overflow-hidden rounded-2xl border border-white/5">
              <iframe
                src={`${cvUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="h-[900px] w-full bg-white"
                title="Delower Hossen Tuhin CV"
              />
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">Quick reference</p>
                <h3 className="mt-3 font-display text-lg text-white">{profile.name}</h3>
                <p className="mt-1 text-xs text-ink-300">{profile.title}</p>
                <dl className="mt-5 space-y-2.5 text-xs">
                  <Row icon={<Mail size={11} />} label={profile.email} />
                  <Row icon={<Phone size={11} />} label={profile.phone} />
                  <Row icon={<MapPin size={11} />} label={profile.location} />
                </dl>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">Status</p>
                <p className="mt-2 text-sm text-white">{profile.status}</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">Highlights</p>
                <ul className="mt-3 space-y-3 text-xs text-ink-200">
                  <li className="flex justify-between gap-2">
                    <span>Publications</span>
                    <span className="font-mono text-sky-300">{publicationCount}</span>
                  </li>
                  <li className="flex justify-between gap-2">
                    <span>Active labs</span>
                    <span className="font-mono text-sky-300">{experience.length}</span>
                  </li>
                  <li className="flex justify-between gap-2">
                    <span>Education</span>
                    <span className="font-mono text-sky-300">{education.length} programs</span>
                  </li>
                </ul>
              </div>

              <Link href="/contact"
                className="block rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-azure-700/10 p-6 transition hover:border-white/20"
              >
                <p className="font-display text-base text-white">Looking to collaborate?</p>
                <p className="mt-1 text-xs text-ink-300">Reach me directly for research, advising, or recommendation requests.</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-sky-300">Open contact form <ArrowUpRight size={12} /></span>
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-200">
      <span className="grid h-6 w-6 flex-none place-items-center rounded-md bg-white/5 text-ink-300">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}