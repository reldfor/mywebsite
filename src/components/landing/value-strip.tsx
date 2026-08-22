import { Check } from "lucide-react";
import { container } from "@/lib/constants";

const facts = [
  {
    title: "No account needed",
    detail: "Start capturing tasks immediately — nothing to install, nothing to set up.",
  },
  {
    title: "10 tasks free",
    detail: "Enough to try priorities, labels, subtasks, and search for real.",
  },
  {
    title: "Unlimited with an account",
    detail: "Sign in and your tasks sync across every device you own.",
  },
];

export function ValueStrip() {
  return (
    <section aria-label="Key facts" className="border-y border-line bg-surface">
      <div className={`${container} grid gap-6 py-8 sm:grid-cols-3 sm:gap-8 lg:py-9`}>
        {facts.map((fact) => (
          <div key={fact.title} className="flex items-start gap-3">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line bg-paper">
              <Check
                aria-hidden="true"
                className="h-3 w-3 text-ink"
                strokeWidth={2.5}
              />
            </span>
            <div>
              <p className="text-[13px] font-semibold tracking-[-0.01em]">{fact.title}</p>
              <p className="mt-1 text-[13px] leading-[1.5] text-ink-soft">{fact.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
