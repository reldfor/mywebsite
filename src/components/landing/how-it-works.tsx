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
    <section id="how" className="scroll-mt-20 border-t border-line/80 py-20 lg:py-28">
      <div className={container}>
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three steps. The third one is optional."
            description="Start exactly where you are. Tick only asks for an account when the limit genuinely matters — never before."
          />
        </Reveal>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 90}>
              <li className="relative border-t-2 border-ink/10 pt-6">
                <span className="font-mono text-sm font-medium text-pen">
                  Step {step.number}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
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
