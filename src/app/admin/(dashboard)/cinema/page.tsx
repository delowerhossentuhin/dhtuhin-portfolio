import { CinemaManager } from '@/components/admin/CinemaManager';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function AdminCinemaPage() {
  return (
    <>
      <AdminPageHeader
        title="Cinematic journal"
        description="Log films and series with star ratings and short reviews. Visible on the public Cinematic Journal page."
      />
      <CinemaManager />
    </>
  );
}
