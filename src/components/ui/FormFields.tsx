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
    <label className="grid gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      {children}
      {help ? <span className="text-xs font-normal leading-5 text-slate">{help}</span> : null}
    </label>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-slate/60 focus:border-teal focus:ring-2 focus:ring-teal/15";
