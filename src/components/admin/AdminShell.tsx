'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Microscope,
  Image as ImageIcon,
  Film,
  Mail,
  Users,
  FileBadge,
  LogOut,
  Menu,
  X,
  Globe,
  UserCircle,
} from 'lucide-react';

const nav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/about', label: 'About', icon: UserCircle },
  { href: '/admin/blogs', label: 'Blog', icon: FileText },
  { href: '/admin/research', label: 'Research', icon: Microscope },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/cinema', label: 'Cinema', icon: Film },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { href: '/admin/resume', label: 'Resume', icon: FileBadge },
] as const;

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null };
}) {
  const [pathname, setPathname] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function update() { setPathname(window.location.pathname); }
    update();
    window.addEventListener('popstate', update);
    const interval = setInterval(update, 300);
    return () => {
      window.removeEventListener('popstate', update);
      clearInterval(interval);
    };
  }, []);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/5 bg-ink-950/85 px-4 backdrop-blur-md lg:hidden">
        <Link href="/admin" className="font-display text-sm">Admin · DHT</Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04]"
        >
          <Menu size={15} />
        </button>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 flex-none flex-col border-r border-white/5 bg-ink-950 lg:flex">
          <SidebarBody pathname={pathname} isActive={isActive} user={user} />
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
                onClick={() => setOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-ink-950 lg:hidden"
              >
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                  <span className="font-display text-sm">Admin · DHT</span>
                  <button onClick={() => setOpen(false)} aria-label="Close menu"
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04]"
                  >
                    <X size={14} />
                  </button>
                </div>
                <SidebarBody pathname={pathname} isActive={isActive} user={user} onNavigate={() => setOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main */}
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}

function SidebarBody({
  pathname,
  isActive,
  user,
  onNavigate,
}: {
  pathname: string;
  isActive: (href: string, exact?: boolean) => boolean;
  user: { name?: string | null; email?: string | null };
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="border-b border-white/5 px-5 py-5">
        <Link href="/admin" onClick={onNavigate} className="font-display text-base text-white">Admin</Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">Delower Hossen Tuhin</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = isActive(item.href, 'exact' in item ? item.exact : undefined);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href} onClick={onNavigate}
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    active ? 'bg-white/[0.06] text-white' : 'text-ink-300 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span layoutId="admin-nav-active"
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-sky-300 to-azure-300"
                    />
                  )}
                  <Icon size={14} className={active ? 'text-sky-300' : 'text-ink-400'} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/5 px-3 py-4">
        <Link href="/" onClick={onNavigate}
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-ink-300 transition hover:bg-white/[0.03] hover:text-white"
        >
          <Globe size={13} /> View site
        </Link>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-3">
          <p className="truncate text-xs text-white">{user.name ?? 'Admin'}</p>
          <p className="truncate text-[10px] text-ink-400">{user.email ?? ''}</p>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.02] px-2 py-1.5 text-[11px] text-ink-200 transition hover:border-rose-400/30 hover:text-rose-200"
          >
            <LogOut size={11} /> Sign out
          </button>
        </div>
      </div>
    </>
  );
}