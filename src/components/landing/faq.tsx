import { container } from "@/lib/constants";

const FAQS = [
  {
    question: "Is Tick really free?",
    answer:
      "Yes. The guest tier is free forever — ten tasks, no account, no expiry. Pro is free during early access, and early users keep it free.",
  },
  {
    question: "Do I need an account?",
    answer: "No. Open the app and start adding tasks immediately.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "As a guest, your tasks live in your browser's localStorage — your machine only. With a Pro account they sync encrypted through our cloud database.",
  },
  {
    question: "What happens if I hit 10 tasks as a guest?",
    answer:
      "The composer locks. Your existing tasks are fully editable — check things off, reorder, edit. Sign up to unlock unlimited.",
  },
  {
    question: "Can I migrate my guest tasks to a Pro account?",
    answer:
      "Yes — it's one click on sign-up. All tasks, labels, and subtasks migrate automatically; nothing is duplicated or lost.",
  },
  {
    question: "Is there a mobile app?",
    answer:
      "Not yet. The web app is mobile-optimised and works great on a phone browser. Native apps are on the roadmap.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-t border-lp-rule py-20 md:py-24">
      <div className={container}>
        <div className="mx-auto max-w-[720px]">
          <p className="mb-3.5 font-mono text-xs text-lp-accent">04 / FAQ</p>
          <h2 className="text-[clamp(30px,4vw,46px)] leading-[1.05] font-medium tracking-[-0.03em] text-lp-ink">
            Questions we get a lot.
          </h2>

          <div className="tl-faq mt-10 border-t border-lp-rule">
            {FAQS.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="tl-chevron"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="pr-8 pb-5 text-[15px] leading-relaxed text-lp-ink-2">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
