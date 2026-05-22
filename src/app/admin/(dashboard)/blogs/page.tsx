import { BlogsManager } from '@/components/admin/BlogsManager';
import { AdminPageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export default function AdminBlogsPage() {
  return (
    <>
      <AdminPageHeader
        title="Blog posts"
        description="Manage essays. Posts are stored as Markdown — the public site renders them with GFM extensions."
      />
      <BlogsManager />
    </>
  );
}
