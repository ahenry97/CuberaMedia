export function Field({
  label,
  children,
  help
}: {
  label: string;
  children: React.ReactNode;
  help?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink">
      <span>{label}</span>
      {children}
      {help ? <span className="text-xs font-normal leading-5 text-slate">{help}</span> : null}
    </label>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold text-ink outline-none transition placeholder:text-slate/55 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10";
