import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import { ArrowLeft, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { seedBlogs, profile } from '@/data/site';
import { formatDate } from '@/lib/utils';
import { NewsletterForm } from '@/components/blog/NewsletterForm';
import { CommentSection } from '@/components/blog/CommentSection';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';

export const dynamic = 'force-dynamic';

async function getPost(slug: string) {
  if (!hasDatabase) return seedBlogs.find((p) => p.slug === slug) ?? null;
  try {
    await dbConnect();
    const doc = await Blog.findOne({ slug, published: true }).lean() as any;
    if (doc) {
      return {
        id: doc._id.toString(),
        slug: doc.slug,
        title: doc.title,
        excerpt: doc.excerpt,
        content: doc.content,
        coverColor: doc.coverColor ?? '#1e3a8a',
        coverImage: doc.coverImage ?? '',
        category: doc.category ?? 'Research',
        tags: doc.tags ?? [],
        readTime: doc.readTime ?? 5,
        date: doc.createdAt?.toISOString?.() ?? new Date().toISOString(),
        featured: doc.featured ?? false,
      };
    }
  } catch (e) {
    console.error('Blog post fetch failed:', e);
  }
  return seedBlogs.find((p) => p.slug === slug) ?? null;
}

async function getRelated(slug: string, category: string) {
  if (!hasDatabase) {
    return seedBlogs.filter((p) => p.slug !== slug && p.category === category).slice(0, 2);
  }
  try {
    await dbConnect();
    const docs = await Blog.find({ slug: { $ne: slug }, category, published: true }).limit(2).lean() as any[];
    return docs.map((d) => ({
      slug: d.slug,
      title: d.title,
      excerpt: d.excerpt,
      coverColor: d.coverColor ?? '#1e3a8a',
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article' },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="container-tight py-32 text-center">
        <p className="text-ink-400">Post not found.</p>
        <Link href="/blog" className="mt-4 inline-block text-sky-300 hover:text-sky-200">← Back to blog</Link>
      </div>
    );
  }

  const related = await getRelated(params.slug, post.category);

  return (
    <article>
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-white/5">
        {(post as any).coverImage ? (
          <div className="absolute inset-0 -z-10">
            <Image src={(post as any).coverImage} alt={post.title} fill className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 to-ink-950" />
          </div>
        ) : (
          <div className="absolute inset-0 -z-10 opacity-50" style={{
            background: `radial-gradient(ellipse at top, ${post.coverColor}, transparent 60%), linear-gradient(180deg, #060b1a 30%, transparent 100%)`,
          }} />
        )}
        <div className="absolute inset-0 -z-10 bg-tech-grid opacity-15" />
        <div className="container-tight py-20 sm:py-28">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-ink-300 transition hover:text-white">
            <ArrowLeft size={12} /> Back to all posts
          </Link>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-sky-300">{post.category}</p>
          <h1 className="mt-3 h-display text-4xl text-white sm:text-5xl md:text-6xl">{post.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-200">{post.excerpt}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-300">
            <span className="flex items-center gap-1.5"><Calendar size={11} /> {formatDate(post.date)}</span>
            <span className="flex items-center gap-1.5"><Clock size={11} /> {post.readTime} min read</span>
            <span className="text-ink-500">·</span>
            <span>By {profile.shortName}</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container-tight py-16 sm:py-20">
        <div
          className="prose-cinema"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="mt-12 flex flex-wrap gap-2 border-t border-white/5 pt-8">
          {post.tags.map((t: string) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-ink-300">#{t}</span>
          ))}
        </div>

        {/* Author card */}
        <div className="mt-12 flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <div className="grid h-12 w-12 flex-none place-items-center rounded-full bg-gradient-to-br from-sky-400/30 to-azure-700/30 font-display text-lg text-white">T</div>
          <div>
            <p className="font-display text-base text-white">Written by {profile.name}</p>
            <p className="mt-1 text-sm text-ink-300">Final-year CSE undergrad at AIUB. Research interests in federated learning, medical AI, and interpretable models. Always reachable.</p>
            <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200">
              Get in touch <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>

        {/* Comments */}
        <CommentSection blogSlug={params.slug} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-white/5 py-16">
          <div className="container-wide">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">Continue reading</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {related.map((r: any) => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-white/10"
                >
                  <span className="h-1 w-20 rounded-full" style={{ background: r.coverColor }} />
                  <h4 className="font-display text-lg text-white transition group-hover:text-sky-200">{r.title}</h4>
                  <p className="text-sm text-ink-300">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="border-t border-white/5 py-20">
        <div className="container-tight">
          <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-sky-500/[0.05] via-white/[0.02] to-azure-700/[0.05] p-8 sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">Stay in the loop</p>
                <h3 className="mt-3 h-display text-2xl text-white sm:text-3xl">Get the next essay when it lands.</h3>
                <p className="mt-2 text-sm text-ink-300">No marketing. One email per post. Unsubscribe anytime.</p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}