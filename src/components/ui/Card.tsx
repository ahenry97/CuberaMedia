export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-6 shadow-soft ${className}`}>{children}</div>;
}

export function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-7 max-w-3xl">
      {eyebrow ? <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-coral">{eyebrow}</p> : null}
      <h1 className="text-3xl font-black leading-tight text-ink md:text-4xl">{title}</h1>
      {description ? <p className="mt-3 text-base leading-7 text-slate">{description}</p> : null}
    </div>
  );
}
