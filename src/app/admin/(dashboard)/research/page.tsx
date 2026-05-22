import { ResearchManager } from '@/components/admin/ResearchManager';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function AdminResearchPage() {
  return (
    <>
      <AdminPageHeader
        title="Research"
        description="Add and edit publications. The public Research page shows every record below."
      />
      <ResearchManager />
    </>
  );
}
