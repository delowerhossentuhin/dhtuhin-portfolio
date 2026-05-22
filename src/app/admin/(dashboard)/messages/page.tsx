import { MessagesManager } from '@/components/admin/MessagesManager';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function AdminMessagesPage() {
  return (
    <>
      <AdminPageHeader
        title="Messages"
        description="Submissions from the public contact form. Mark them read or delete after handling."
      />
      <MessagesManager />
    </>
  );
}
