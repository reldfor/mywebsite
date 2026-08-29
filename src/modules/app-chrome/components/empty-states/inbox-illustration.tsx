export function InboxEmptyIllustration({ className = "" }: { className?: string }) {
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
          <rect x="62" y="52" width="68" height="28" rx="8" stroke="var(--lp-rule)" strokeWidth="1.2" strokeDasharray="3.2 3.2" opacity="0.55" />
          <line x1="72" y1="62" x2="112" y2="62" stroke="var(--lp-ink-3)" strokeWidth="1.35" strokeLinecap="round" opacity="0.5" />
          <line x1="72" y1="69.5" x2="102" y2="69.5" stroke="var(--lp-ink-3)" strokeWidth="1.35" strokeLinecap="round" opacity="0.22" />
          <g>
            <rect x="100" y="44" width="16" height="16" rx="8" fill="var(--lp-accent)" />
            <path d="M108 52V60M104 56H112" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.95" />
          </g>
          <path d="M62 82L66 98C66 102 69 104 73 104H119C123 104 126 102 126 98L130 82" stroke="var(--lp-ink-3)" strokeWidth="1.35" strokeLinejoin="round" opacity="0.9" />
          <path d="M62 82L90 96L130 82" stroke="var(--lp-rule)" strokeWidth="1.2" strokeLinejoin="round" opacity="0.85" />
          <path d="M90 96V104" stroke="var(--lp-rule)" strokeWidth="1" opacity="0.35" />
          <line x1="70" y1="92" x2="82" y2="92" stroke="var(--lp-ink-3)" strokeWidth="1.1" strokeLinecap="round" opacity="0.18" />
          <line x1="110" y1="92" x2="118" y2="92" stroke="var(--lp-ink-3)" strokeWidth="1.1" strokeLinecap="round" opacity="0.18" />
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
