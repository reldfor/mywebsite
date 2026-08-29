export function LabelsEmptyIllustration({ className = "" }: { className?: string }) {
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
          <g transform="rotate(-12 90 72)">
            <rect x="62" y="62" width="56" height="20" rx="10" fill="var(--lp-paper)" stroke="var(--lp-accent)" strokeWidth="1.35" />
            <circle cx="72" cy="72" r="4" fill="var(--lp-accent)" />
            <circle cx="72" cy="72" r="1.4" fill="white" opacity="0.9" />
            <line x1="80" y1="69.5" x2="108" y2="69.5" stroke="var(--lp-ink-3)" strokeWidth="1.2" strokeLinecap="round" opacity="0.45" />
            <line x1="80" y1="74.5" x2="100" y2="74.5" stroke="var(--lp-ink-3)" strokeWidth="1.2" strokeLinecap="round" opacity="0.22" />
          </g>
          <g transform="rotate(10 90 72)" opacity="0.85">
            <rect x="66" y="74" width="56" height="20" rx="10" fill="var(--lp-paper-2)" stroke="var(--lp-rule)" strokeWidth="1.2" />
            <circle cx="76" cy="84" r="4" stroke="var(--lp-ink-3)" strokeWidth="1.2" opacity="0.5" />
            <line x1="84" y1="81.5" x2="112" y2="81.5" stroke="var(--lp-ink-3)" strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />
            <line x1="84" y1="86.5" x2="104" y2="86.5" stroke="var(--lp-ink-3)" strokeWidth="1.2" strokeLinecap="round" opacity="0.15" />
          </g>
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
