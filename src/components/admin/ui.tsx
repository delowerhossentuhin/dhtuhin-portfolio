import type { ReactNode } from 'react';

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-6">
      <div>
        <h1 className="h-display text-2xl text-white sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-ink-300">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-10 text-center">
      <p className="font-display text-base text-white">{title}</p>
      {hint && <p className="mt-2 text-sm text-ink-400">{hint}</p>}
    </div>
  );
}

export function ContentCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-white/[0.02] ${className}`}>
      {children}
    </div>
  );
}
