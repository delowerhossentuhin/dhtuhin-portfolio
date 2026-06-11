'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { profile } from '@/data/site';

export function HomeCvButton() {
  const [cvUrl, setCvUrl] = useState(profile.resumePath);

  useEffect(() => {
    fetch('/api/resume')
      .then((r) => r.json())
      .then((d) => { if (d.cvUrl) setCvUrl(d.cvUrl); })
      .catch(() => {});
  }, []);

  return (
    <a
      href={cvUrl}
      download
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.08]"
    >
      <Download size={14} /> Download Resume
    </a>
  );
}