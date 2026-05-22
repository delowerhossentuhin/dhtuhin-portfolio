import { GalleryManager } from '@/components/admin/GalleryManager';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function AdminGalleryPage() {
  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Upload images to your server (e.g. /public/images/gallery/) and reference them here by path."
      />
      <GalleryManager />
    </>
  );
}
