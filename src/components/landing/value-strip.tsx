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
    <section aria-label="Key facts" className="border-y border-line/80 bg-surface/60">
      <div className={`${container} grid gap-7 py-9 sm:grid-cols-3 sm:gap-8`}>
        {facts.map((fact) => (
          <div key={fact.title} className="flex items-start gap-3">
            <Check
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-pen"
              strokeWidth={3}
            />
            <div>
              <p className="text-sm font-semibold">{fact.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{fact.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
