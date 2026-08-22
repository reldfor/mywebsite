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
    <div className="max-w-[560px]">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[32px]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-[16px] leading-[1.6] text-ink-soft">
          {description}
        </p>
      ) : null}
    </div>
  );
}
