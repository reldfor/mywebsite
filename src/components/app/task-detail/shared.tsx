export const chipBase =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors";
export const chipIdle =
  "border-line bg-surface text-ink-soft shadow-[var(--shadow-interactive)] hover:border-ink/15 hover:text-ink dark:shadow-none";
export const chipSet =
  "border-line bg-surface text-ink shadow-[var(--shadow-interactive)] hover:border-ink/15 dark:shadow-none";
export const chipGhost =
  "border-transparent bg-transparent text-ink-faint shadow-none hover:border-line hover:bg-surface hover:text-ink";

export function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
      {children}
    </p>
  );
}
