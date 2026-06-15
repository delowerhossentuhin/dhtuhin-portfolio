'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { profile } from '@/data/site';
import { SubscribeModal } from '@/components/blog/SubscribeModal';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/skills', label: 'Skills' },
  { href: '/research', label: 'Research' },
  { href: '/resume', label: 'Resume' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/cinematic-journal', label: 'Cinema' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [pathname, setPathname] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);

  // Fix: update pathname on every navigation
  useEffect(() => {
    function update() { setPathname(window.location.pathname); }
    update();
    window.addEventListener('popstate', update);
    // Also poll for client-side navigation (Next.js router changes don't fire popstate)
    const interval = setInterval(update, 300);
    return () => {
      window.removeEventListener('popstate', update);
      clearInterval(interval);
    };
  }, []);

  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  if (isAdmin) return null;

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  }

  return (
    <>
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-500', scrolled ? 'py-3' : 'py-5')}>
        <div className="container-wide">
          <nav className={cn(
            'flex items-center justify-between rounded-2xl px-4 py-2 transition-all duration-500 sm:px-5',
            scrolled ? 'glass-strong shadow-[0_8px_30px_-15px_rgba(0,0,0,0.6)]' : 'border border-transparent',
          )}>
            <Link href="/" className="group flex items-center gap-2.5" aria-label="Home">
              <span className="relative inline-grid h-8 w-8 place-items-center overflow-hidden rounded-lg">
                <span className="ring-conic absolute inset-0 animate-[gradientShift_8s_ease_infinite]" />
                <span className="absolute inset-[1.5px] rounded-[7px] bg-ink-950" />
                <span className="relative font-display text-base font-medium text-white">T</span>
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-medium tracking-tight text-white">{profile.shortName}</span>
                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-ink-400 sm:inline">Research · Portfolio</span>
              </span>
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {links.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={() => setPathname(l.href)}
                      className={cn('relative rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors', active ? 'text-white' : 'text-ink-300 hover:text-white')}
                    >
                      {active && (
                        <motion.span layoutId="nav-active"
                          className="absolute inset-0 rounded-full bg-white/[0.06] ring-1 ring-white/10"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative">{l.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* CTA + mobile toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSubscribe(true)}
                className="hidden rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-[13px] font-medium text-white transition hover:bg-white/[0.08] lg:inline-flex"
              >
                Subscribe
              </button>
              <Link href="/contact"
                onClick={() => setPathname('/contact')}
                className="hidden rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-ink-950 transition hover:bg-ink-100 lg:inline-flex"
              >
                Get in touch
              </Link>
              <button type="button" onClick={() => setOpen((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-200 hover:bg-white/5 lg:hidden"
                aria-expanded={open} aria-label="Toggle menu"
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="glass-strong mt-3 overflow-hidden rounded-2xl p-2 lg:hidden"
              >
                <ul className="space-y-1">
                  {links.map((l) => {
                    const active = isActive(l.href);
                    return (
                      <li key={l.href}>
                        <Link href={l.href}
                          onClick={() => setPathname(l.href)}
                          className={cn('flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition',
                            active ? 'bg-white/[0.06] text-white' : 'text-ink-300 hover:bg-white/[0.04] hover:text-white'
                          )}
                        >
                          <span>{l.label}</span>
                          <span className={cn('h-1.5 w-1.5 rounded-full transition', active ? 'bg-sky-400' : 'bg-transparent')} />
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <button onClick={() => { setOpen(false); setShowSubscribe(true); }}
                      className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm text-sky-300 hover:bg-white/[0.04] transition"
                    >
                      Subscribe to blog
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <SubscribeModal open={showSubscribe} onClose={() => setShowSubscribe(false)} />
    </>
  );
}