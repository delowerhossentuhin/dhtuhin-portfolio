import Link from 'next/link';
import { AdminPageHeader, ContentCard } from '@/components/admin/ui';
import { profile } from '@/data/site';
import { FileBadge, ArrowUpRight, FolderUp } from 'lucide-react';

export default function AdminResumePage() {
  return (
    <>
      <AdminPageHeader
        title="Resume / CV"
        description="The public CV is served as a static PDF. To update it, replace the file in /public/cv and redeploy."
      />

      <ContentCard className="p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <div className="grid h-14 w-14 flex-none place-items-center rounded-2xl border border-sky-300/20 bg-sky-500/[0.06] text-sky-300">
            <FileBadge size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg text-white">Current CV file</h2>
            <p className="mt-1 break-all font-mono text-xs text-sky-300">
              {profile.resumePath}
            </p>
            <p className="mt-4 text-sm text-ink-200">
              The Resume page renders this file inside an embedded PDF viewer and
              offers a download link. Update it via these steps:
            </p>
            <ol className="mt-4 space-y-2 text-sm text-ink-300">
              <li className="flex gap-2">
                <span className="font-mono text-sky-300">1.</span>
                Save your new CV as{' '}
                <span className="font-mono text-sky-300">
                  Delower_Hossen_Tuhin_CV.pdf
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono text-sky-300">2.</span>
                Replace the file at{' '}
                <span className="font-mono text-sky-300">/public/cv/</span> in the repo
              </li>
              <li className="flex gap-2">
                <span className="font-mono text-sky-300">3.</span>
                Commit and push — Vercel will redeploy automatically
              </li>
            </ol>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={profile.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-4 py-2 text-sm font-medium text-ink-950 hover:opacity-90"
              >
                Preview current CV <ArrowUpRight size={13} />
              </Link>
              <Link
                href="/resume"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-ink-200 hover:text-white"
              >
                Open public page <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </ContentCard>

      <ContentCard className="mt-6 p-6">
        <div className="flex items-start gap-3">
          <FolderUp size={16} className="mt-0.5 flex-none text-sky-300" />
          <div>
            <p className="font-display text-sm text-white">
              Want full upload UI?
            </p>
            <p className="mt-1 text-sm text-ink-300">
              File uploads from the admin require a storage provider (S3, Cloudinary,
              Vercel Blob). The recommended path for a personal site like this is
              committing the PDF directly to the repository — version-controlled,
              free, and CDN-served by Vercel out of the box.
            </p>
          </div>
        </div>
      </ContentCard>
    </>
  );
}
