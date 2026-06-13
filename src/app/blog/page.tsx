import type { Metadata } from 'next';
import { seedBlogs } from '@/data/site';
import { PageHeader } from '@/components/ui/PageHeader';
import { BlogIndex } from '@/components/blog/BlogIndex';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { Blog } from '@/models/Blog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Field notes on research, ML, and building things slowly.',
};

export type BlogPostLite = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverColor: string;
  coverImage?: string;
  category: string;
  tags: string[];
  readTime: number;
  date: string;
  featured: boolean;
};

async function getPosts(): Promise<BlogPostLite[]> {
  if (!hasDatabase) {
    return [...seedBlogs].map((p) => ({ ...p, id: p.id, tags: [...p.tags], coverImage: '' }))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }
  try {
    await dbConnect();
    const docs = await Blog.find({ published: true }).sort({ createdAt: -1 }).lean();
    if (docs.length > 0) {
      return docs.map((d: any) => ({
        id: d._id.toString(),
        slug: d.slug,
        title: d.title,
        excerpt: d.excerpt,
        coverColor: d.coverColor ?? '#1e3a8a',
        coverImage: d.coverImage ?? '',
        category: d.category ?? 'Research',
        tags: d.tags ?? [],
        readTime: d.readTime ?? 5,
        date: d.createdAt?.toISOString?.() ?? new Date().toISOString(),
        featured: d.featured ?? false,
      }));
    }
  } catch (e) {
    console.error('Blog fetch failed:', e);
  }
  return [...seedBlogs].map((p) => ({ ...p, id: p.id, tags: [...p.tags], coverImage: '' }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHeader
        eyebrow="Field notes"
        title="Writing as a slower kind of thinking."
        intro="Long-form notes on research methodology, machine learning, and the engineering of careful careers. Updated when I have something to say, not on a schedule."
      />
      <section className="pb-24">
        <div className="container-wide">
          <BlogIndex posts={posts} />
        </div>
      </section>
    </>
  );
}