import {
  Archive,
  CalendarClock,
  Flag,
  GripVertical,
  ListChecks,
  Search,
  Tag,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { SectionHeading } from "@/components/landing/section-heading";
import { container } from "@/lib/constants";

const features = [
  {
    icon: Zap,
    title: "Capture instantly",
    detail: "Type, press Enter, done. A new task takes one line and two seconds.",
  },
  {
    icon: Flag,
    title: "Priorities that mean something",
    detail: "None, low, medium, high, urgent. See what matters first, not what's oldest.",
  },
  {
    icon: CalendarClock,
    title: "Due dates when you need them",
    detail: "Set a date or leave it open. Today and Upcoming collect what's next.",
  },
  {
    icon: Tag,
    title: "Labels for every context",
    detail: "Color-code projects, people, and places — then filter by them in one click.",
  },
  {
    icon: ListChecks,
    title: "Subtasks keep things honest",
    detail: "Break a big task into steps and watch a progress bar fill in.",
  },
  {
    icon: Search,
    title: "Find anything, instantly",
    detail: "Search every task by title, label, or note, with filters that stick.",
  },
  {
    icon: GripVertical,
    title: "Drag to organize",
    detail: "Reorder tasks by hand, move them between views, or do it all from the keyboard.",
  },
  {
    icon: Archive,
    title: "Done isn't deleted",
    detail: "Completed and archived tasks stay within reach until you decide otherwise.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20 lg:py-28">
      <div className={container}>
        <Reveal>
          <SectionHeading
            eyebrow="Capabilities"
            title="Everything a task list should be. Nothing it shouldn't."
            description="Every feature in Tick exists to move a task from 'somewhere in your head' to 'done'. Nothing here is decoration."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={(index % 4) * 70} className="h-full">
              <article className="group h-full rounded-2xl border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-pen-soft text-pen transition-colors duration-200 group-hover:bg-pen group-hover:text-paper">
                  <feature.icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {feature.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
