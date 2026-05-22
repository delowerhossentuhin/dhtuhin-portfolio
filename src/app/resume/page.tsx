import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { profile, education, experience, publications } from '@/data/site';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Download the full CV or read the inline summary.',
};

export default function ResumePage() {
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
            <a
              href={profile.resumePath}
              download
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-2.5 text-sm font-medium text-ink-950 transition hover:opacity-90"
            >
              <Download size={15} /> Download CV (PDF)
            </a>
            <a
              href={profile.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm text-ink-100 transition hover:border-white/30 hover:text-white"
            >
              Open in new tab <ArrowUpRight size={14} />
            </a>
            <span className="ml-auto font-mono text-xs uppercase tracking-[0.18em] text-ink-500">
              Last updated · April 2026
            </span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Embedded PDF */}
            <div className="pdf-frame">
              <object
                data={`${profile.resumePath}#view=FitH&toolbar=1`}
                type="application/pdf"
                className="h-[900px] w-full bg-white"
                aria-label="Delower Hossen Tuhin CV"
              >
                <div className="grid h-full place-items-center bg-ink-900 p-10 text-center">
                  <div>
                    <FileText size={28} className="mx-auto text-sky-300" />
                    <p className="mt-3 text-sm text-ink-200">
                      Your browser can&apos;t preview PDFs inline.
                    </p>
                    <a
                      href={profile.resumePath}
                      className="mt-3 inline-flex items-center gap-2 text-sm text-sky-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open the CV directly <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              </object>
            </div>

            {/* Sidebar overview */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">
                  Quick reference
                </p>
                <h3 className="mt-3 font-display text-lg text-white">{profile.name}</h3>
                <p className="mt-1 text-xs text-ink-300">{profile.title}</p>

                <dl className="mt-5 space-y-2.5 text-xs">
                  <Row icon={<Mail size={11} />} label={profile.email} />
                  <Row icon={<Phone size={11} />} label={profile.phone} />
                  <Row icon={<MapPin size={11} />} label={profile.location} />
                </dl>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                  Status
                </p>
                <p className="mt-2 text-sm text-white">{profile.status}</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                  Highlights
                </p>
                <ul className="mt-3 space-y-3 text-xs text-ink-200">
                  <li className="flex justify-between gap-2">
                    <span>Publications</span>
                    <span className="font-mono text-sky-300">{publications.length}</span>
                  </li>
                  <li className="flex justify-between gap-2">
                    <span>Current CGPA</span>
                    <span className="font-mono text-sky-300">3.95 / 4.00</span>
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

              <Link
                href="/contact"
                className="block rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-azure-700/10 p-6 transition hover:border-white/20"
              >
                <p className="font-display text-base text-white">Looking to collaborate?</p>
                <p className="mt-1 text-xs text-ink-300">
                  Reach me directly for research, advising, or recommendation requests.
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-sky-300">
                  Open contact form <ArrowUpRight size={12} />
                </span>
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
      <span className="grid h-6 w-6 flex-none place-items-center rounded-md bg-white/5 text-ink-300">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}
