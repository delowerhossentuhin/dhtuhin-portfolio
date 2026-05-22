import type { Metadata } from 'next';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  ArrowUpRight,
  GraduationCap,
} from 'lucide-react';
import { profile } from '@/data/site';
import { PageHeader } from '@/components/ui/PageHeader';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach me for collaborations, research, or a recommendation request.',
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="The shortest path to my inbox."
        intro="Open to PhD positions for Fall 2026, research collaborations, and conversations with anyone working on the hard parts of ML. Replies usually within a day."
      />

      <section className="pb-24">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <ContactForm />

            <aside className="space-y-5">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">
                  Direct channels
                </p>

                <ul className="mt-5 space-y-4 text-sm">
                  <DirectRow
                    icon={<Mail size={13} />}
                    label="Email"
                    value={profile.email}
                    href={`mailto:${profile.email}`}
                  />
                  <DirectRow
                    icon={<Phone size={13} />}
                    label="Phone"
                    value={profile.phone}
                    href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                  />
                  <DirectRow
                    icon={<MapPin size={13} />}
                    label="Location"
                    value={profile.location}
                  />
                  <DirectRow
                    icon={<GraduationCap size={13} />}
                    label="Status"
                    value={profile.status}
                  />
                </ul>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">
                  Find me elsewhere
                </p>
                <ul className="mt-5 grid gap-2">
                  <SocialLink href={profile.social.linkedin} label="LinkedIn" icon={<Linkedin size={13} />} />
                  <SocialLink href={profile.social.scholar} label="Google Scholar" />
                  <SocialLink href={profile.social.researchgate} label="ResearchGate" />
                  <SocialLink href={profile.social.orcid} label="ORCID" />
                  <SocialLink href={profile.social.github} label="GitHub" icon={<Github size={13} />} />
                </ul>
              </div>

              <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-sky-500/10 to-azure-700/10 p-6">
                <p className="font-display text-base text-white">
                  Working hours
                </p>
                <p className="mt-2 text-sm text-ink-300">
                  Most emails get a reply within 24 hours. For something time-sensitive,
                  put <span className="text-sky-300">urgent</span> in the subject line.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

function DirectRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-lg bg-white/5 text-ink-200">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm text-white">{value}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <li>
        <a href={href} className="block transition hover:text-sky-200">
          {inner}
        </a>
      </li>
    );
  }
  return <li>{inner}</li>;
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-ink-200 transition hover:border-white/15 hover:text-white"
      >
        <span className="flex items-center gap-2">
          {icon && <span className="text-ink-400">{icon}</span>}
          {label}
        </span>
        <ArrowUpRight size={12} className="text-ink-400 transition group-hover:text-sky-300" />
      </a>
    </li>
  );
}
