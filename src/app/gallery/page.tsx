import type { Metadata } from 'next';
import { seedGallery } from '@/data/site';
import { PageHeader } from '@/components/ui/PageHeader';
import { GalleryMasonry } from '@/components/gallery/GalleryMasonry';
import { dbConnect, hasDatabase } from '@/lib/mongodb';
import { GalleryItem } from '@/models/GalleryItem';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Quiet pictures from a loud few years — campus, conferences, and in-between.',
};

async function getItems() {
  if (!hasDatabase) return [...seedGallery];
  try {
    await dbConnect();
    const docs = await GalleryItem.find().sort({ order: 1, createdAt: -1 }).lean();
    if (docs.length > 0) {
      return docs.map((d: any) => ({
        id: d._id.toString(),
        src: d.src,
        alt: d.alt,
        title: d.title ?? '',
        caption: d.caption ?? '',
        category: d.category ?? 'Personal',
        span: d.span ?? 'normal',
      }));
    }
  } catch (e) {
    console.error('Gallery DB fetch failed, falling back to seed:', e);
  }
  return [...seedGallery];
}

export default async function GalleryPage() {
  const items = await getItems();

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Quiet pictures from a loud few years."
        intro="Snapshots from campus, conferences, and the in-between. Click any image to see it full size."
      />
      <section className="pb-24">
        <div className="container-wide">
          <GalleryMasonry items={items} />
        </div>
      </section>
    </>
  );
}