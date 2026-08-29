export function TodayEmptyIllustration({ className = "" }: { className?: string }) {
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
          <circle cx="90" cy="62" r="16" stroke="var(--lp-accent)" strokeWidth="1.35" />
          <circle cx="90" cy="62" r="3.5" fill="var(--lp-accent)" opacity="0.95" />
          <g stroke="var(--lp-accent)" strokeWidth="1.35" strokeLinecap="round" opacity="0.9">
            <line x1="90" y1="38.5" x2="90" y2="43" />
            <line x1="90" y1="81" x2="90" y2="85.5" />
            <line x1="66.5" y1="62" x2="71" y2="62" />
            <line x1="109" y1="62" x2="113.5" y2="62" />
            <line x1="73.2" y1="45.2" x2="76.4" y2="48.4" />
            <line x1="103.6" y1="75.6" x2="106.8" y2="78.8" />
            <line x1="106.8" y1="45.2" x2="103.6" y2="48.4" />
            <line x1="76.4" y1="75.6" x2="73.2" y2="78.8" />
          </g>
          <line x1="62" y1="90" x2="130" y2="90" stroke="var(--lp-rule)" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
          <g opacity="0.85">
            <line x1="68" y1="96" x2="96" y2="96" stroke="var(--lp-ink-3)" strokeWidth="1.2" strokeLinecap="round" opacity="0.38" />
            <line x1="68" y1="101" x2="86" y2="101" stroke="var(--lp-ink-3)" strokeWidth="1.2" strokeLinecap="round" opacity="0.18" />
            <circle cx="112" cy="98.5" r="6" stroke="var(--lp-ink-3)" strokeWidth="1.1" opacity="0.45" />
            <path d="M110 98.7L112 100.7L114.8 97.2" stroke="var(--lp-accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
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
