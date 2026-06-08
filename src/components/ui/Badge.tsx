import { translate } from "@/lib/i18n";
import type { Language } from "@/lib/types";

const badgeStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  past_due: "bg-orange-50 text-orange-700 ring-orange-200",
  cancelled: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  new: "bg-sky-50 text-sky-700 ring-sky-200",
  reviewing: "bg-violet-50 text-violet-700 ring-violet-200",
  in_review: "bg-violet-50 text-violet-700 ring-violet-200",
  planning: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  in_progress: "bg-teal-50 text-teal-700 ring-teal-200",
  waiting_for_client: "bg-amber-50 text-amber-700 ring-amber-200",
  waiting_for_client_approval: "bg-amber-50 text-amber-700 ring-amber-200",
  ready_for_approval: "bg-lime-50 text-lime-700 ring-lime-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  complete: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  archived: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  high: "bg-orange-50 text-orange-700 ring-orange-200",
  urgent: "bg-red-50 text-red-700 ring-red-200",
  normal: "bg-slate-100 text-slate-700 ring-slate-200",
  low: "bg-stone-100 text-stone-700 ring-stone-200",
  default: "bg-blue-50 text-blue-700 ring-blue-200"
};

export function Badge({ value, language = "en" }: { value: string; language?: Language }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${badgeStyles[value] ?? badgeStyles.default}`}>
      {translate(language, `status.${value}`)}
    </span>
  );
}
