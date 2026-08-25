import { container } from "@/lib/constants";

const QUOTES = [
  {
    quote:
      "I've bounced off every todo app that promised to organize my life. Tick is the first one that just lets me write things down. Ten tasks sounds like a limit until you realize it's a feature.",
    name: "Marta Kowalski",
    handle: "@martakw",
    initials: "MK",
  },
  {
    quote:
      "⌘K to search, ⌘↵ to save, number keys to jump between views. My hands never leave the home row — it's the fastest capture loop I've used.",
    name: "Devon Park",
    handle: "@devonships",
    initials: "DP",
  },
  {
    quote:
      "Opened it on a whim and had six tasks in before I realized I never signed up. No account, no email, no nonsense. That's how every tool should work.",
    name: "Ana Ribeiro",
    handle: "@anaribeiro_",
    initials: "AR",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-lp-rule py-20 md:py-24">
      <div className={container}>
        <p className="mb-3.5 font-mono text-xs text-lp-accent">02 / What people say</p>
        <div className="grid gap-5 md:grid-cols-3">
          {QUOTES.map((item) => (
            <figure
              key={item.handle}
              className="flex h-full flex-col rounded-md border border-lp-rule bg-lp-paper-2 p-6"
            >
              <blockquote className="border-l-2 border-lp-accent pl-4 text-[15px] leading-relaxed text-lp-ink-2">
                {item.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-6">
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-lp-rule bg-lp-paper-3 font-mono text-xs text-lp-ink-2"
                >
                  {item.initials}
                </span>
                <span>
                  <span className="block text-sm font-medium text-lp-ink">{item.name}</span>
                  <span className="block font-mono text-xs text-lp-ink-3">{item.handle}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
