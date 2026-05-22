import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { profile } from '@/data/site';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['SOFT', 'opsz'],
});
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const viewport: Viewport = {
  themeColor: '#060b1a',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — Researcher · CSE · AIUB`,
    template: `%s · ${profile.shortName}`,
  },
  description: profile.tagline,
  keywords: [
    'Delower Hossen Tuhin',
    'CSE',
    'AIUB',
    'Federated Learning',
    'Computer Vision',
    'Machine Learning',
    'Research Portfolio',
    'PhD',
    'AI Researcher',
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    title: `${profile.name} — Research Portfolio`,
    description: profile.tagline,
    url: siteUrl,
    siteName: `${profile.name} · Portfolio`,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/profile/tuhin-main.jpg',
        width: 1200,
        height: 1500,
        alt: profile.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — Research Portfolio`,
    description: profile.tagline,
    images: ['/images/profile/tuhin-main.jpg'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased">
        <Providers>
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
