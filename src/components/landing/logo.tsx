import Link from "next/link";
import { Check } from "lucide-react";
import { appName } from "@/lib/constants";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label={`${appName} home`}
      className="inline-flex items-center gap-2.5 rounded-lg"
    >
      <span
        aria-hidden="true"
        className="grid h-[28px] w-[28px] place-items-center rounded-[8px] bg-ink text-paper"
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.02em]">{appName}</span>
    </Link>
  );
}
