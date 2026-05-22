import type { Metadata } from 'next';
import { seedBlogs } from '@/data/site';
import { PageHeader } from '@/components/ui/PageHeader';
import { BlogIndex } from '@/components/blog/BlogIndex';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Field notes on research, ML, and building things slowly.',
};

export default function BlogPage() {
  const posts = [...seedBlogs].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <PageHeader
        eyebrow="Field notes"
        title="Writing as a slower kind of thinking."
        intro="Long-form notes on research methodology, machine learning, and the engineering of careful careers. Updated when I have something to say, not on a schedule."
      />

      <section className="pb-24">
        <div className="container-wide">
          <BlogIndex posts={posts as unknown as BlogPostLite[]} />
        </div>
      </section>
    </>
  );
}

// Lightweight typing the client component depends on. Keeping it local avoids
// pulling the full readonly tuple type into the client bundle.
export type BlogPostLite = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverColor: string;
  category: string;
  tags: readonly string[];
  readTime: number;
  date: string;
  featured: boolean;
};
