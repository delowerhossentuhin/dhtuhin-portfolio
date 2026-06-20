'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Save, Plus, Trash2, Upload, AlertCircle, CheckCircle } from 'lucide-react';

type HeroData = {
  statusBadge: string;
  headlinePart1: string;
  headlineEm1: string;
  headlinePart2: string;
  headlineEm2: string;
  introText: string;
  taglines: string[];
  stat1Value: string; stat1Label: string; stat1Suffix: string;
  stat2Value: string; stat2Label: string; stat2Suffix: string;
  stat3Value: string; stat3Label: string; stat3Suffix: string;
  portraitUrl: string;
  portraitLocation: string;
};

const blank: HeroData = {
  statusBadge: '', headlinePart1: '', headlineEm1: '', headlinePart2: '', headlineEm2: '',
  introText: '', taglines: [''],
  stat1Value: '', stat1Label: '', stat1Suffix: '',
  stat2Value: '', stat2Label: '', stat2Suffix: '',
  stat3Value: '', stat3Label: '', stat3Suffix: '',
  portraitUrl: '', portraitLocation: '',
};

export function HeroManager() {
  const [data, setData] = useState<HeroData>(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/hero')
      .then((r) => r.json())
      .then((d) => {
        const fetched = d.data ?? blank;
        setData({ ...blank, ...fetched, taglines: fetched.taglines?.length ? fetched.taglines : [''] });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? 'Upload failed');
      setData({ ...data, portraitUrl: result.url });
    } catch {
      setErr('Photo upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function save() {
    setSaving(true);
    setErr('');
    setSuccess(false);
    try {
      const payload = { ...data, taglines: data.taglines.filter((t) => t.trim()) };
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setErr('Save failed. Try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="grid place-items-center py-20"><Loader2 size={20} className="animate-spin text-ink-400" /></div>;
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Status badge */}
      <Section title="Status badge">
        <Field label="Text shown in the green dot badge">
          <input className="input" value={data.statusBadge} onChange={(e) => setData({ ...data, statusBadge: e.target.value })} />
        </Field>
      </Section>

      {/* Headline */}
      <Section title="Main headline">
        <p className="mb-3 text-xs text-ink-400">Preview: <span className="text-white">{data.headlinePart1} <em className="text-sky-300">{data.headlineEm1}</em>, {data.headlinePart2} <em className="text-sky-300">{data.headlineEm2}</em>.</span></p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Line 1 text"><input className="input" value={data.headlinePart1} onChange={(e) => setData({ ...data, headlinePart1: e.target.value })} /></Field>
          <Field label="Line 1 highlighted word"><input className="input" value={data.headlineEm1} onChange={(e) => setData({ ...data, headlineEm1: e.target.value })} /></Field>
          <Field label="Line 2 text"><input className="input" value={data.headlinePart2} onChange={(e) => setData({ ...data, headlinePart2: e.target.value })} /></Field>
          <Field label="Line 2 highlighted word"><input className="input" value={data.headlineEm2} onChange={(e) => setData({ ...data, headlineEm2: e.target.value })} /></Field>
        </div>
      </Section>

      {/* Intro */}
      <Section title="Intro paragraph">
        <textarea className="input min-h-[100px]" value={data.introText} onChange={(e) => setData({ ...data, introText: e.target.value })} />
      </Section>

      {/* Taglines */}
      <Section title="Rotating taglines">
        {data.taglines.map((t, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className="input flex-1" value={t} onChange={(e) => {
              const next = [...data.taglines]; next[i] = e.target.value; setData({ ...data, taglines: next });
            }} placeholder={`Tagline ${i + 1}`} />
            {data.taglines.length > 1 && (
              <button onClick={() => setData({ ...data, taglines: data.taglines.filter((_, idx) => idx !== i) })}
                className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-white/10 text-rose-300 hover:text-rose-200"
              ><Trash2 size={14} /></button>
            )}
          </div>
        ))}
        <button onClick={() => setData({ ...data, taglines: [...data.taglines, ''] })}
          className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200"
        ><Plus size={12} /> Add tagline</button>
      </Section>

      {/* Stats */}
      <Section title="Stats row (3 boxes)">
        <div className="space-y-4">
          {(['1', '2', '3'] as const).map((n) => (
            <div key={n} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <p className="mb-2 text-xs text-ink-400">Stat {n}</p>
              <div className="grid gap-2 sm:grid-cols-3">
                <input className="input" placeholder="Value (e.g. 7)" value={(data as any)[`stat${n}Value`]} onChange={(e) => setData({ ...data, [`stat${n}Value`]: e.target.value } as any)} />
                <input className="input" placeholder="Label (e.g. Publications)" value={(data as any)[`stat${n}Label`]} onChange={(e) => setData({ ...data, [`stat${n}Label`]: e.target.value } as any)} />
                <input className="input" placeholder="Suffix (e.g. incl. Q1)" value={(data as any)[`stat${n}Suffix`]} onChange={(e) => setData({ ...data, [`stat${n}Suffix`]: e.target.value } as any)} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Portrait */}
      <Section title="Portrait photo">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        <div className="flex items-center gap-4">
          {data.portraitUrl && (
            <img src={data.portraitUrl} alt="preview" className="h-24 w-20 rounded-lg object-cover border border-white/10" />
          )}
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-3 text-sm text-ink-300 hover:border-sky-400/40 hover:text-white transition disabled:opacity-50"
          >
            {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : <><Upload size={14} /> Upload photo</>}
          </button>
        </div>
        <Field label="Location caption (e.g. 'Dhaka · Bangladesh')">
          <input className="input" value={data.portraitLocation} onChange={(e) => setData({ ...data, portraitLocation: e.target.value })} />
        </Field>
      </Section>

      {err && <p className="flex items-center gap-1.5 text-sm text-rose-300"><AlertCircle size={14} /> {err}</p>}
      {success && <p className="flex items-center gap-1.5 text-sm text-emerald-300"><CheckCircle size={14} /> Saved successfully!</p>}

      <div className="sticky bottom-0 -mx-4 border-t border-white/5 bg-ink-950/90 px-4 py-4 backdrop-blur-md sm:-mx-0 sm:rounded-2xl sm:border sm:px-6">
        <button onClick={save} disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-azure-300 px-6 py-2.5 text-sm font-medium text-ink-950 hover:opacity-90 disabled:opacity-60"
        >
          {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save all changes</>}
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.65rem;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          padding: 0.55rem 0.8rem;
          font-size: 0.875rem;
          color: white;
        }
        :global(.input:focus) {
          outline: none;
          border-color: rgba(125,211,252,0.4);
          box-shadow: 0 0 0 3px rgba(125,211,252,0.15);
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.015] p-6">
      <h2 className="mb-4 font-display text-lg text-white">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}