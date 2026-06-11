'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AdminPageHeader, ContentCard } from '@/components/admin/ui';
import { FileBadge, ArrowUpRight, Upload, Loader2, CheckCircle } from 'lucide-react';

export default function AdminResumePage() {
  const [cvUrl, setCvUrl] = useState('');
  const [updatedLabel, setUpdatedLabel] = useState('April 2026');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/resume')
      .then((r) => r.json())
      .then((d) => {
        setCvUrl(d.cvUrl ?? '');
        setUpdatedLabel(d.updatedLabel ?? 'April 2026');
      });
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr('');
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('updatedLabel', updatedLabel);
      const res = await fetch('/api/resume', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Upload failed');
      setCvUrl(data.cvUrl);
      setSuccess(true);
    } catch (e: any) {
      setErr(e.message ?? 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Resume / CV"
        description="Upload your CV as PDF. It will be served on the public Resume page and homepage download button."
      />

      <ContentCard className="p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <div className="grid h-14 w-14 flex-none place-items-center rounded-2xl border border-sky-300/20 bg-sky-500/[0.06] text-sky-300">
            <FileBadge size={20} />
          </div>
          <div className="min-w-0 flex-1 w-full">
            <h2 className="font-display text-lg text-white">Current CV</h2>
            {cvUrl && (
              <p className="mt-1 break-all font-mono text-xs text-sky-300">{cvUrl}</p>
            )}

            {/* Updated label */}
            <div className="mt-4">
              <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                Last updated label
              </label>
              <input
                className="mt-2 w-full max-w-xs rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-white focus:border-sky-300/40 focus:outline-none"
                value={updatedLabel}
                onChange={(e) => setUpdatedLabel(e.target.value)}
                placeholder="e.g. April 2026"
              />
            </div>

            {/* Upload button */}
            <div className="mt-6">
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-5 py-2.5 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-60"
              >
                {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : <><Upload size={14} /> Upload new CV (PDF)</>}
              </button>
            </div>

            {success && (
              <p className="mt-3 flex items-center gap-2 text-sm text-emerald-300">
                <CheckCircle size={14} /> CV uploaded successfully! Public pages updated.
              </p>
            )}
            {err && <p className="mt-3 text-sm text-rose-300">{err}</p>}

            <div className="mt-6 flex flex-wrap gap-3">
              {cvUrl && (
                <Link href={cvUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-ink-200 hover:text-white"
                >
                  Preview current CV <ArrowUpRight size={13} />
                </Link>
              )}
              <Link href="/resume" target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-ink-200 hover:text-white"
              >
                Open public page <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </ContentCard>
    </>
  );
}