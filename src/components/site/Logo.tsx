import { appHref } from "@/lib/paths";

export function Logo({
  href = "/",
  compact = false,
  inverse = false
}: {
  href?: string;
  compact?: boolean;
  inverse?: boolean;
}) {
  const wordColor = inverse ? "text-white" : "text-ink";
  const mediaColor = inverse ? "text-coral" : "text-coral";

  return (
    <a href={appHref(href)} className="flex min-w-0 items-center gap-3">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white shadow-soft ring-1 ring-white/20">
        <span className="absolute inset-2 rounded-full border-[5px] border-blue-600 border-r-transparent border-t-ocean-500" />
        <span className="absolute bottom-2.5 right-1.5 h-2.5 w-7 -rotate-12 rounded-full bg-coral" />
      </span>
      {!compact ? (
        <span className="min-w-0 leading-none">
          <span className={`block truncate text-base font-black uppercase tracking-[0.22em] ${wordColor}`}>Cubera</span>
          <span className={`mt-1 block truncate text-xs font-black uppercase tracking-[0.44em] ${mediaColor}`}>Media</span>
        </span>
      ) : null}
    </a>
  );
}
