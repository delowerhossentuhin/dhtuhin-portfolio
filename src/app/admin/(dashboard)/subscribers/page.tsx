import { SubscribersManager } from '@/components/admin/SubscribersManager';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function AdminSubscribersPage() {
  return (
    <>
      <AdminPageHeader
        title="Newsletter subscribers"
        description="Every reader who opted in via the public site. Export the list to send announcements externally."
      />
      <SubscribersManager />
    </>
  );
}
