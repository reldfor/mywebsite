export const chipBase =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-[-0.01em] transition-colors";
export const chipIdle =
  "border-lp-rule bg-[var(--lp-glass)] text-lp-ink-2 shadow-[var(--lp-shadow-interactive)] hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)] hover:text-lp-ink hover:bg-lp-paper";
export const chipSet =
  "border-lp-rule bg-lp-paper-2 text-lp-ink shadow-[var(--lp-shadow-interactive)] hover:border-[color-mix(in_srgb,var(--lp-ink)_20%,transparent)]";
export const chipGhost =
  "border-transparent bg-transparent text-lp-ink-3 shadow-none hover:border-lp-rule hover:bg-lp-paper-2 hover:text-lp-ink";

export function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[9px] font-medium uppercase tracking-[0.06em] text-lp-ink-3">
      {children}
    </p>
  );
}
