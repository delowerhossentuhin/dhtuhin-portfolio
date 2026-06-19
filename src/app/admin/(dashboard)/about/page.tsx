import { AboutManager } from '@/components/admin/AboutManager';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function AdminAboutPage() {
  return (
    <>
      <AdminPageHeader
        title="About page"
        description="Edit everything on the public About page — bio, photo, timeline, education, achievements, memberships, and languages."
      />
      <AboutManager />
    </>
  );
}