export function UpcomingEmptyIllustration({ className = "" }: { className?: string }) {
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
          <rect x="64" y="52" width="48" height="38" rx="8" stroke="var(--lp-rule)" strokeWidth="1.25" fill="var(--lp-paper)" />
          <rect x="64" y="52" width="48" height="12" rx="4" fill="var(--lp-rule)" opacity="0.14" />
          <circle cx="74" cy="58" r="1.5" fill="var(--lp-ink-3)" opacity="0.6" />
          <circle cx="80" cy="58" r="1.5" fill="var(--lp-ink-3)" opacity="0.6" />
          <circle cx="90" cy="76" r="1.6" fill="var(--lp-ink-3)" opacity="0.5" />
          <circle cx="90" cy="82" r="1.6" fill="var(--lp-ink-3)" opacity="0.35" />
          <circle cx="84" cy="76" r="1.6" fill="var(--lp-ink-3)" opacity="0.22" />
          <circle cx="96" cy="76" r="1.6" fill="var(--lp-ink-3)" opacity="0.22" />
          <circle cx="84" cy="82" r="1.6" fill="var(--lp-ink-3)" opacity="0.18" />
          <circle cx="96" cy="82" r="1.6" fill="var(--lp-rule)" opacity="0.5" />
          <line x1="64" y1="64" x2="112" y2="64" stroke="var(--lp-rule)" strokeWidth="1" opacity="0.6" />
          <g>
            <circle cx="120" cy="72" r="14" fill="var(--lp-paper-2)" stroke="var(--lp-accent)" strokeWidth="1.35" />
            <circle cx="120" cy="72" r="1.8" fill="var(--lp-accent)" />
            <path d="M120 66V72L124.5 75" stroke="var(--lp-accent)" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <path d="M116 90L130 90" stroke="var(--lp-rule)" strokeWidth="1" strokeLinecap="round" opacity="0.5" strokeDasharray="2 2.5" />
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
