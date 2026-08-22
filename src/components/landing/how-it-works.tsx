import { Reveal } from "@/components/landing/reveal";
import { SectionHeading } from "@/components/landing/section-heading";
import { container } from "@/lib/constants";

const steps = [
  {
    number: "01",
    title: "Create a task",
    detail:
      "Open Tick and type. No account, no tour, no setup — your first task is saved before you finish this sentence.",
  },
  {
    number: "02",
    title: "Make it work for you",
    detail:
      "Add priorities, due dates, labels, and subtasks. Drag to reorder when plans change, search when things get busy.",
  },
  {
    number: "03",
    title: "Sign in when you're ready",
    detail:
      "Create a free account and your guest tasks come with you — unlimited, synced, and on every device you own.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-t border-line py-16 lg:py-24">
      <div className={container}>
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps. The third one is optional."
            description="Start exactly where you are. Tick only asks for an account when the limit genuinely matters — never before."
          />
        </Reveal>
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 60}>
              <li className="border-t border-line pt-5">
                <span className="font-mono text-xs tabular-nums tracking-wide text-ink-faint">
                  {step.number}
                </span>
                <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-ink-soft">
                  {step.detail}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
