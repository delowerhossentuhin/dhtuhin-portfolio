import { HeroManager } from '@/components/admin/HeroManager';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function AdminHeroPage() {
  return (
    <>
      <AdminPageHeader
        title="Homepage hero"
        description="Edit the headline, intro, stats, and portrait on the homepage."
      />
      <HeroManager />
    </>
  );
}