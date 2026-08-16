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
        className="grid h-8 w-8 place-items-center rounded-[10px] bg-marker"
      >
        <Check className="h-4.5 w-4.5 text-marker-ink" strokeWidth={3.5} />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">
        {appName}
      </span>
    </Link>
  );
}
