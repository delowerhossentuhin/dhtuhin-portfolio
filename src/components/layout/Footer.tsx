'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Github, Linkedin, BookOpen, GraduationCap, Mail, Instagram, Facebook, type LucideProps } from 'lucide-react';
import { profile } from '@/data/site';

const sitemap = [
  { label: 'Research', href: '/research' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Resume', href: '/resume' },
];
const more = [
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Cinema', href: '/cinematic-journal' },
  { label: 'Contact', href: '/contact' },
];

export function Footer() {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 border-t border-white/5 bg-gradient-to-b from-ink-950 via-ink-900 to-black pt-20 pb-10">
      <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-2xl bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />

      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[1.5fr,1fr,1fr,1fr]">
          <div>
            <p className="h-display text-3xl text-white">Let&apos;s talk research.</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-300">
              I&apos;m actively looking for PhD opportunities for Fall 2026 and research
              collaborations in federated learning, medical imaging, and interpretable AI. If our
              interests overlap, I&apos;d love to hear from you.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Mail size={14} /> Start a conversation
            </Link>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-400">
              Portfolio
            </p>
            <ul className="mt-4 space-y-2">
              {sitemap.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-200 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-400">More</p>
            <ul className="mt-4 space-y-2">
              {more.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-200 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-400">
              Elsewhere
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <SocialIcon href={profile.social.github} label="GitHub" icon={Github} />
              <SocialIcon href={profile.social.linkedin} label="LinkedIn" icon={Linkedin} />
              <SocialIcon href={profile.social.scholar} label="Google Scholar" icon={GraduationCap} />
              <SocialIcon href={profile.social.researchgate} label="ResearchGate" icon={BookOpen} />
              <SocialIcon href={profile.social.instagram} label="Instagram" icon={Instagram} />
              <SocialIcon href={profile.social.facebook} label="Facebook" icon={Facebook} />
            </div>
            <p className="mt-4 font-mono text-[11px] text-ink-400">
              ORCID 0009-0009-6560-6138
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-ink-400 sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="font-mono">
            <span className="text-ink-300">Dhaka, Bangladesh.</span>
            
            {/* <span className="mx-3 text-ink-600">·</span>
            <span>Open to PhD applications · Fall 2026</span> */}
  
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-lg border border-white/5 bg-white/[0.02] text-ink-300 transition hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
    >
      <Icon size={15} />
    </a>
  );
}