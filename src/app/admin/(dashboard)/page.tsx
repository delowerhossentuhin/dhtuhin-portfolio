import Link from 'next/link';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';
import { Research } from '@/models/Research';
import { GalleryItem } from '@/models/GalleryItem';
import { CinemaEntry } from '@/models/CinemaEntry';
import { ContactMessage } from '@/models/ContactMessage';
import { Subscriber } from '@/models/Subscriber';
import {
  publications,
  seedBlogs,
  seedCinema,
  seedGallery,
} from '@/data/site';
import { AdminPageHeader, StatCard, ContentCard } from '@/components/admin/ui';
import {
  FileText,
  Microscope,
  Image as ImageIcon,
  Film,
  Mail,
  Users,
  ArrowUpRight,
  Database,
  AlertTriangle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCounts() {
  if (!hasDatabase) {
    return {
      blogs: seedBlogs.length,
      research: publications.length,
      gallery: seedGallery.length,
      cinema: seedCinema.length,
      messages: 0,
      unread: 0,
      subscribers: 0,
      recentMessages: [] as {
        _id: string;
        name: string;
        email: string;
        subject: string;
        createdAt: Date;
        read: boolean;
      }[],
    };
  }
  try {
    await dbConnect();
    const [blogs, research, gallery, cinema, messages, unread, subscribers, recent] =
      await Promise.all([
        Blog.countDocuments(),
        Research.countDocuments(),
        GalleryItem.countDocuments(),
        CinemaEntry.countDocuments(),
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ read: false }),
        Subscriber.countDocuments(),
        ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);
    return {
      blogs: blogs || seedBlogs.length,
      research: research || publications.length,
      gallery: gallery || seedGallery.length,
      cinema: cinema || seedCinema.length,
      messages,
      unread,
      subscribers,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recentMessages: recent.map((m: any) => ({ ...m, _id: String(m._id) })),
    };
  } catch (err) {
    console.error('[admin overview] counts failed', err);
    return {
      blogs: seedBlogs.length,
      research: publications.length,
      gallery: seedGallery.length,
      cinema: seedCinema.length,
      messages: 0,
      unread: 0,
      subscribers: 0,
      recentMessages: [],
    };
  }
}

export default async function AdminOverviewPage() {
  const c = await getCounts();

  return (
    <>
      <AdminPageHeader
        title="Overview"
        description="Snapshot of everything you publish. Use the sidebar to manage any section."
      />

      {!hasDatabase && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[0.04] p-4 text-sm">
          <AlertTriangle size={16} className="mt-0.5 flex-none text-amber-300" />
          <div>
            <p className="font-display text-white">Preview mode</p>
            <p className="mt-1 text-amber-100/70">
              <span className="font-mono">MONGODB_URI</span> is not configured. The site
              still renders seed content from{' '}
              <span className="font-mono">src/data/site.ts</span>, but writes from the
              dashboard are disabled. See the README for setup instructions.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Blog posts" value={c.blogs} hint="published + drafts" />
        <StatCard label="Publications" value={c.research} hint="research outputs" />
        <StatCard label="Gallery items" value={c.gallery} />
        <StatCard label="Cinema entries" value={c.cinema} />
        <StatCard
          label="Messages"
          value={c.messages}
          hint={c.unread > 0 ? `${c.unread} unread` : 'all read'}
        />
        <StatCard label="Subscribers" value={c.subscribers} hint="newsletter" />
        <div className="rounded-2xl border border-sky-300/20 bg-gradient-to-br from-sky-500/[0.06] to-azure-700/[0.06] p-5 sm:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-300">
            Persistence
          </p>
          <p className="mt-2 flex items-center gap-2 font-display text-base text-white">
            <Database size={14} className="text-sky-300" />
            {hasDatabase ? 'MongoDB connected' : 'Seed-only (preview)'}
          </p>
          <p className="mt-1 text-xs text-ink-300">
            {hasDatabase
              ? 'All admin actions persist to the database.'
              : 'Set MONGODB_URI in your .env to enable writes.'}
          </p>
        </div>
      </div>

      <h2 className="mt-12 font-mono text-xs uppercase tracking-[0.18em] text-sky-300">
        Quick actions
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink href="/admin/blogs" label="New blog post" icon={<FileText size={14} />} />
        <QuickLink href="/admin/research" label="Add publication" icon={<Microscope size={14} />} />
        <QuickLink href="/admin/gallery" label="Upload photo" icon={<ImageIcon size={14} />} />
        <QuickLink href="/admin/cinema" label="Log a film" icon={<Film size={14} />} />
        <QuickLink href="/admin/messages" label="Read messages" icon={<Mail size={14} />} />
        <QuickLink href="/admin/subscribers" label="Subscribers" icon={<Users size={14} />} />
        <QuickLink href="/admin/resume" label="Update CV" icon={<FileText size={14} />} />
        <QuickLink href="/" label="View live site" icon={<ArrowUpRight size={14} />} />
      </div>

      {/* Recent messages */}
      <h2 className="mt-12 font-mono text-xs uppercase tracking-[0.18em] text-sky-300">
        Recent messages
      </h2>
      <ContentCard className="mt-3">
        {c.recentMessages.length === 0 ? (
          <p className="p-6 text-sm text-ink-400">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {c.recentMessages.map((m) => (
              <li key={m._id} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">
                    <span className="font-display">{m.name}</span>{' '}
                    <span className="text-ink-400">&lt;{m.email}&gt;</span>
                  </p>
                  <p className="truncate text-xs text-ink-300">{m.subject}</p>
                </div>
                {!m.read && (
                  <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-sky-200">
                    New
                  </span>
                )}
                <Link
                  href="/admin/messages"
                  className="text-xs text-sky-300 hover:text-sky-200"
                >
                  Open →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </ContentCard>
    </>
  );
}

function QuickLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-ink-100 transition hover:border-white/15 hover:text-white"
    >
      <span className="flex items-center gap-2">
        <span className="text-sky-300">{icon}</span> {label}
      </span>
      <ArrowUpRight size={12} className="text-ink-400" />
    </Link>
  );
}
