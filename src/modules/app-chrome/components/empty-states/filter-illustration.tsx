export function FilterEmptyIllustration({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center ${className}`}
      style={{ background: "var(--lp-empty-glow)" }}
    >
      <svg
        width="180"
        height="150"
        viewBox="0 0 180 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        className="overflow-visible"
      >
        <circle cx="90" cy="72" r="56" stroke="var(--lp-rule)" strokeWidth="1.2" strokeOpacity="0.14" />
        <circle cx="90" cy="72" r="42" stroke="var(--lp-rule)" strokeWidth="1.2" strokeOpacity="0.08" />
        <g>
          <rect x="42" y="44" width="96" height="68" rx="12" stroke="var(--lp-rule)" strokeWidth="1.35" />
          <rect x="48" y="38" width="96" height="68" rx="12" fill="var(--lp-paper-2)" stroke="var(--lp-rule)" strokeWidth="1.35" />
          <rect x="48" y="38" width="96" height="68" rx="12" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <g opacity="0.9">
            <line x1="66" y1="60" x2="126" y2="60" stroke="var(--lp-rule)" strokeWidth="1.35" strokeLinecap="round" />
            <circle cx="82" cy="60" r="5" fill="var(--lp-paper)" stroke="var(--lp-ink-3)" strokeWidth="1.2" />
            <circle cx="82" cy="60" r="1.8" fill="var(--lp-accent)" />
            <line x1="66" y1="72" x2="126" y2="72" stroke="var(--lp-rule)" strokeWidth="1.35" strokeLinecap="round" />
            <circle cx="108" cy="72" r="5" fill="var(--lp-paper)" stroke="var(--lp-ink-3)" strokeWidth="1.2" />
            <circle cx="108" cy="72" r="1.8" fill="var(--lp-accent)" />
            <line x1="66" y1="84" x2="126" y2="84" stroke="var(--lp-rule)" strokeWidth="1.35" strokeLinecap="round" />
            <circle cx="92" cy="84" r="5" fill="var(--lp-paper)" stroke="var(--lp-ink-3)" strokeWidth="1.2" />
            <circle cx="92" cy="84" r="1.8" fill="var(--lp-ink-3)" opacity="0.5" />
          </g>
          <line x1="62" y1="96" x2="130" y2="96" stroke="var(--lp-rule)" strokeWidth="1" strokeLinecap="round" opacity="0.45" strokeDasharray="2 3" />
        </g>
        <g opacity="0.5">
          <circle cx="26" cy="38" r="1.2" fill="var(--lp-ink-3)" />
          <circle cx="156" cy="44" r="1" fill="var(--lp-ink-3)" />
          <circle cx="152" cy="102" r="1.2" fill="var(--lp-ink-3)" />
          <circle cx="30" cy="106" r="1" fill="var(--lp-ink-3)" />
        </g>
      </svg>
    </div>
  );
}
