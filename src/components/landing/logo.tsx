import Link from "next/link";
import { appName } from "@/lib/constants";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label={`${appName} home`}
      className="inline-flex items-center gap-[9px] text-[16px] font-medium tracking-[-0.01em] text-lp-ink"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6.5 12.5 L10 16 L17.5 7.5"
          className="stroke-lp-accent"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {appName}
    </Link>
  );
}
