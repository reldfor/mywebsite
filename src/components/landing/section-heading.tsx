import { Check } from "lucide-react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.22em] text-pen">
        <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
    </div>
  );
}
