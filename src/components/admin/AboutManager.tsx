'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Save, Plus, Trash2, Upload, AlertCircle, CheckCircle } from 'lucide-react';

type TimelineItem = { year: string; title: string; blurb: string; tag: string };
type EducationItem = { institution: string; degree: string; period: string; score: string; highlights: string[] };
type AchievementItem = { title: string; organization: string; year: string; description: string; icon: string };
type MembershipItem = { name: string; role: string; period: string; id: string | null; note: string };
type LanguageItem = { name: string; level: string; breakdown: string };

type AboutData = {
  photoUrl: string;
  photoCaption: string;
  bioParagraphs: string[];
  philosophy: string;
  factLocation: string;
  factStatus: string;
  factGpa: string;
  factNext: string;
  timeline: TimelineItem[];
  education: EducationItem[];
  achievements: AchievementItem[];
  memberships: MembershipItem[];
  languages: LanguageItem[];
};

const blank: AboutData = {
  photoUrl: '',
  photoCaption: '',
  bioParagraphs: [''],
  philosophy: '',
  factLocation: '',
  factStatus: '',
  factGpa: '',
  factNext: '',
  timeline: [],
  education: [],
  achievements: [],
  memberships: [],
  languages: [],
};

export function AboutManager() {
  const [data, setData] = useState<AboutData>(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/about')
      .then((r) => r.json())
      .then((d) => {
        const fetched = d.data ?? blank;
        setData({
          ...blank,
          ...fetched,
          bioParagraphs: fetched.bioParagraphs?.length ? fetched.bioParagraphs : [''],
        });
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
      setData({ ...data, photoUrl: result.url });
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
      const payload = {
        ...data,
        bioParagraphs: data.bioParagraphs.filter((p) => p.trim()),
      };
      const res = await fetch('/api/about', {
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
      {/* Photo */}
      <Section title="Profile photo">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        <div className="flex items-center gap-4">
          {data.photoUrl && (
            <img src={data.photoUrl} alt="preview" className="h-24 w-20 rounded-lg object-cover border border-white/10" />
          )}
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-4 py-3 text-sm text-ink-300 hover:border-sky-400/40 hover:text-white transition disabled:opacity-50"
          >
            {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading…</> : <><Upload size={14} /> Upload photo</>}
          </button>
        </div>
        <Field label="Photo caption (e.g. 'AIUB Campus · 2025')">
          <input className="input" value={data.photoCaption} onChange={(e) => setData({ ...data, photoCaption: e.target.value })} />
        </Field>
      </Section>

      {/* Bio */}
      <Section title="Biography">
        {data.bioParagraphs.map((p, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <textarea
              className="input min-h-[80px] flex-1"
              value={p}
              onChange={(e) => {
                const next = [...data.bioParagraphs];
                next[i] = e.target.value;
                setData({ ...data, bioParagraphs: next });
              }}
              placeholder={`Paragraph ${i + 1}`}
            />
            {data.bioParagraphs.length > 1 && (
              <button onClick={() => setData({ ...data, bioParagraphs: data.bioParagraphs.filter((_, idx) => idx !== i) })}
                className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-white/10 text-rose-300 hover:text-rose-200"
              ><Trash2 size={14} /></button>
            )}
          </div>
        ))}
        <button onClick={() => setData({ ...data, bioParagraphs: [...data.bioParagraphs, ''] })}
          className="mt-1 inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200"
        ><Plus size={12} /> Add paragraph</button>
      </Section>

      {/* Philosophy */}
      <Section title="Personal philosophy">
        <textarea className="input min-h-[80px]" value={data.philosophy} onChange={(e) => setData({ ...data, philosophy: e.target.value })} />
      </Section>

      {/* Quick facts */}
      <Section title="Quick facts">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location"><input className="input" value={data.factLocation} onChange={(e) => setData({ ...data, factLocation: e.target.value })} /></Field>
          <Field label="Status"><input className="input" value={data.factStatus} onChange={(e) => setData({ ...data, factStatus: e.target.value })} /></Field>
          <Field label="GPA (optional)"><input className="input" value={data.factGpa} onChange={(e) => setData({ ...data, factGpa: e.target.value })} /></Field>
          <Field label="Next"><input className="input" value={data.factNext} onChange={(e) => setData({ ...data, factNext: e.target.value })} /></Field>
        </div>
      </Section>

      {/* Timeline */}
      <Section title="Academic timeline">
        {data.timeline.map((t, i) => (
          <div key={i} className="mb-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-2">
            <div className="grid gap-2 sm:grid-cols-3">
              <input className="input" placeholder="Year" value={t.year} onChange={(e) => updateArr('timeline', i, { ...t, year: e.target.value }, data, setData)} />
              <input className="input sm:col-span-2" placeholder="Title" value={t.title} onChange={(e) => updateArr('timeline', i, { ...t, title: e.target.value }, data, setData)} />
            </div>
            <textarea className="input min-h-[60px]" placeholder="Blurb" value={t.blurb} onChange={(e) => updateArr('timeline', i, { ...t, blurb: e.target.value }, data, setData)} />
            <div className="flex items-center justify-between gap-2">
              <select className="input flex-1" value={t.tag} onChange={(e) => updateArr('timeline', i, { ...t, tag: e.target.value }, data, setData)}>
                <option>Now</option><option>Past</option><option>Milestone</option><option>Start</option>
              </select>
              <button onClick={() => removeArr('timeline', i, data, setData)} className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-white/10 text-rose-300 hover:text-rose-200"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button onClick={() => addArr('timeline', { year: '', title: '', blurb: '', tag: 'Past' }, data, setData)}
          className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200"
        ><Plus size={12} /> Add timeline item</button>
      </Section>

      {/* Education */}
      <Section title="Education">
        {data.education.map((e, i) => (
          <div key={i} className="mb-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-2">
            <input className="input" placeholder="Institution" value={e.institution} onChange={(ev) => updateArr('education', i, { ...e, institution: ev.target.value }, data, setData)} />
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="input" placeholder="Degree" value={e.degree} onChange={(ev) => updateArr('education', i, { ...e, degree: ev.target.value }, data, setData)} />
              <input className="input" placeholder="Period" value={e.period} onChange={(ev) => updateArr('education', i, { ...e, period: ev.target.value }, data, setData)} />
            </div>
            <input className="input" placeholder="Score (e.g. CGPA 3.95)" value={e.score} onChange={(ev) => updateArr('education', i, { ...e, score: ev.target.value }, data, setData)} />
            <input className="input" placeholder="Highlights (comma separated)" value={e.highlights.join(', ')}
              onChange={(ev) => updateArr('education', i, { ...e, highlights: ev.target.value.split(',').map((s) => s.trim()).filter(Boolean) }, data, setData)}
            />
            <div className="flex justify-end">
              <button onClick={() => removeArr('education', i, data, setData)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-rose-300 hover:text-rose-200"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button onClick={() => addArr('education', { institution: '', degree: '', period: '', score: '', highlights: [] }, data, setData)}
          className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200"
        ><Plus size={12} /> Add education</button>
      </Section>

      {/* Achievements */}
      <Section title="Achievements">
        {data.achievements.map((a, i) => (
          <div key={i} className="mb-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="input" placeholder="Title" value={a.title} onChange={(ev) => updateArr('achievements', i, { ...a, title: ev.target.value }, data, setData)} />
              <input className="input" placeholder="Organization" value={a.organization} onChange={(ev) => updateArr('achievements', i, { ...a, organization: ev.target.value }, data, setData)} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="input" placeholder="Year" value={a.year} onChange={(ev) => updateArr('achievements', i, { ...a, year: ev.target.value }, data, setData)} />
              <input className="input" placeholder="Icon name (lucide, e.g. Award)" value={a.icon} onChange={(ev) => updateArr('achievements', i, { ...a, icon: ev.target.value }, data, setData)} />
            </div>
            <textarea className="input min-h-[60px]" placeholder="Description" value={a.description} onChange={(ev) => updateArr('achievements', i, { ...a, description: ev.target.value }, data, setData)} />
            <div className="flex justify-end">
              <button onClick={() => removeArr('achievements', i, data, setData)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-rose-300 hover:text-rose-200"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button onClick={() => addArr('achievements', { title: '', organization: '', year: '', description: '', icon: 'Trophy' }, data, setData)}
          className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200"
        ><Plus size={12} /> Add achievement</button>
      </Section>

      {/* Memberships */}
      <Section title="Memberships">
        {data.memberships.map((m, i) => (
          <div key={i} className="mb-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-2">
            <input className="input" placeholder="Organization name" value={m.name} onChange={(ev) => updateArr('memberships', i, { ...m, name: ev.target.value }, data, setData)} />
            <div className="grid gap-2 sm:grid-cols-3">
              <input className="input" placeholder="Role" value={m.role} onChange={(ev) => updateArr('memberships', i, { ...m, role: ev.target.value }, data, setData)} />
              <input className="input" placeholder="Period" value={m.period} onChange={(ev) => updateArr('memberships', i, { ...m, period: ev.target.value }, data, setData)} />
              <input className="input" placeholder="ID (optional)" value={m.id ?? ''} onChange={(ev) => updateArr('memberships', i, { ...m, id: ev.target.value || null }, data, setData)} />
            </div>
            <textarea className="input min-h-[60px]" placeholder="Note" value={m.note} onChange={(ev) => updateArr('memberships', i, { ...m, note: ev.target.value }, data, setData)} />
            <div className="flex justify-end">
              <button onClick={() => removeArr('memberships', i, data, setData)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-rose-300 hover:text-rose-200"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button onClick={() => addArr('memberships', { name: '', role: '', period: '', id: null, note: '' }, data, setData)}
          className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200"
        ><Plus size={12} /> Add membership</button>
      </Section>

      {/* Languages */}
      <Section title="Languages">
        {data.languages.map((l, i) => (
          <div key={i} className="mb-3 rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="input" placeholder="Language" value={l.name} onChange={(ev) => updateArr('languages', i, { ...l, name: ev.target.value }, data, setData)} />
              <input className="input" placeholder="Level (e.g. Native, IELTS 6.5)" value={l.level} onChange={(ev) => updateArr('languages', i, { ...l, level: ev.target.value }, data, setData)} />
            </div>
            <input className="input" placeholder="Breakdown (optional)" value={l.breakdown} onChange={(ev) => updateArr('languages', i, { ...l, breakdown: ev.target.value }, data, setData)} />
            <div className="flex justify-end">
              <button onClick={() => removeArr('languages', i, data, setData)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-rose-300 hover:text-rose-200"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        <button onClick={() => addArr('languages', { name: '', level: '', breakdown: '' }, data, setData)}
          className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-sky-200"
        ><Plus size={12} /> Add language</button>
      </Section>

      {err && <p className="flex items-center gap-1.5 text-sm text-rose-300"><AlertCircle size={14} /> {err}</p>}
      {success && <p className="flex items-center gap-1.5 text-sm text-emerald-300"><CheckCircle size={14} /> Saved successfully!</p>}

      {/* Sticky save bar */}
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

// Generic array helpers
function updateArr<K extends keyof AboutData>(key: K, idx: number, value: any, data: AboutData, setData: (d: AboutData) => void) {
  const arr = [...(data[key] as any[])];
  arr[idx] = value;
  setData({ ...data, [key]: arr });
}
function addArr<K extends keyof AboutData>(key: K, value: any, data: AboutData, setData: (d: AboutData) => void) {
  setData({ ...data, [key]: [...(data[key] as any[]), value] });
}
function removeArr<K extends keyof AboutData>(key: K, idx: number, data: AboutData, setData: (d: AboutData) => void) {
  setData({ ...data, [key]: (data[key] as any[]).filter((_, i) => i !== idx) });
}