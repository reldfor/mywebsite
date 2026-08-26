export function SearchEmptyIllustration({ className = "" }: { className?: string }) {
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
          <line x1="64" y1="58" x2="102" y2="58" stroke="var(--lp-ink-3)" strokeWidth="1.35" strokeLinecap="round" opacity="0.25" />
          <line x1="64" y1="66" x2="92" y2="66" stroke="var(--lp-ink-3)" strokeWidth="1.35" strokeLinecap="round" opacity="0.15" />
          <line x1="64" y1="90" x2="118" y2="90" stroke="var(--lp-rule)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <circle cx="106" cy="70" r="16" fill="var(--lp-paper)" stroke="var(--lp-accent)" strokeWidth="1.35" />
          <circle cx="106" cy="70" r="9" stroke="var(--lp-ink-3)" strokeWidth="1.2" opacity="0.25" />
          <line x1="117.5" y1="81.5" x2="124" y2="88" stroke="var(--lp-accent)" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="101" y1="67" x2="111" y2="67" stroke="var(--lp-accent)" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
          <line x1="101" y1="71" x2="108" y2="71" stroke="var(--lp-ink-3)" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
        </g>
        <g opacity="0.5">
          <circle cx="26" cy="38" r="1.2" fill="var(--lp-ink-3)" />
          <circle cx="156" cy="44" r="1" fill="var(--lp-ink-3)" />
          <circle cx="152" cy="102" r="1.2" fill="var(--lp-ink-3)" />
          <circle cx="30" cy="106" r="1" fill="var(--lp-ink-3)" />
        </g>
        <g opacity="0.9">
          <circle cx="36" cy="52" r="1" fill="var(--lp-accent)" opacity="0.5" />
          <circle cx="144" cy="56" r="1" fill="var(--lp-accent)" opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}
