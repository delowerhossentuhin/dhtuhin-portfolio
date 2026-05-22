import type { Metadata } from 'next';
import { seedGallery } from '@/data/site';
import { PageHeader } from '@/components/ui/PageHeader';
import { GalleryMasonry } from '@/components/gallery/GalleryMasonry';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Quiet pictures from a loud few years — campus, conferences, and in-between.',
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Quiet pictures from a loud few years."
        intro="Snapshots from campus, conferences, and the in-between. Click any image to see it full size."
      />

      <section className="pb-24">
        <div className="container-wide">
          <GalleryMasonry items={[...seedGallery]} />
        </div>
      </section>
    </>
  );
}
