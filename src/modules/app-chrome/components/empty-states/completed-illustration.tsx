export function CompletedEmptyIllustration({
  className = "",
}: {
  className?: string;
}) {
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
        <circle
          cx="90"
          cy="72"
          r="56"
          stroke="var(--lp-rule)"
          strokeWidth="1.2"
          strokeOpacity="0.14"
        />
        <circle
          cx="90"
          cy="72"
          r="42"
          stroke="var(--lp-rule)"
          strokeWidth="1.2"
          strokeOpacity="0.08"
        />
        <g>
          <rect
            x="42"
            y="44"
            width="96"
            height="68"
            rx="12"
            stroke="var(--lp-rule)"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="48"
            y="38"
            width="96"
            height="68"
            rx="12"
            fill="var(--lp-paper-2)"
            stroke="var(--lp-rule)"
            strokeWidth="1.35"
          />
          <rect
            x="48"
            y="38"
            width="96"
            height="68"
            rx="12"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
          <circle
            cx="72"
            cy="60"
            r="10"
            stroke="var(--lp-accent)"
            strokeWidth="1.35"
          />
          <path
            d="M67 60.4L70.2 63.6L77 56.5"
            stroke="var(--lp-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="92"
            y1="58"
            x2="124"
            y2="58"
            stroke="var(--lp-ink-3)"
            strokeWidth="1.35"
            strokeLinecap="round"
            opacity="0.85"
          />
          <line
            x1="92"
            y1="66"
            x2="124"
            y2="66"
            stroke="var(--lp-ink-3)"
            strokeWidth="1.35"
            strokeLinecap="round"
            opacity="0.35"
          />
          <line
            x1="62"
            y1="82"
            x2="130"
            y2="82"
            stroke="var(--lp-rule)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.9"
          />
          <g opacity="0.9">
            <circle
              cx="68"
              cy="94"
              r="5.5"
              stroke="var(--lp-ink-3)"
              strokeWidth="1.2"
              opacity="0.5"
            />
            <path
              d="M65.5 94.2L67.5 96.2L70.8 92.2"
              stroke="var(--lp-ink-3)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.42"
            />
            <line
              x1="80"
              y1="92.5"
              x2="118"
              y2="92.5"
              stroke="var(--lp-ink-3)"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.22"
            />
            <line
              x1="80"
              y1="97.5"
              x2="108"
              y2="97.5"
              stroke="var(--lp-ink-3)"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.15"
            />
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
