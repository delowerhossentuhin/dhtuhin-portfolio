import type { MetadataRoute } from 'next';
import { seedBlogs } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    'about',
    'skills',
    'research',
    'resume',
    'blog',
    'gallery',
    'cinematic-journal',
    'contact',
  ].map((p) => ({
    url: `${base}/${p}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: p === '' ? 1 : 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = seedBlogs.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: new Date(b.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
