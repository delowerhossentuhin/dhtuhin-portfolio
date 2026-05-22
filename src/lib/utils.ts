import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Combine class names with Tailwind-aware deduplication. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Lightweight slugify for blog post URLs etc. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Format an ISO date string as "Mar 8, 2026". Safe on the server. */
export function formatDate(iso: string | Date | null | undefined) {
  if (!iso) return '';
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Estimate reading time in minutes from markdown / plain content. */
export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
