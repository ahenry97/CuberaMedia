import { Card, SectionHeader } from "@/components/ui/Card";
import { requireRole } from "@/lib/auth/session";

export default async function Page() {
  await requireRole("developer");

  return (
    <Card>
      <SectionHeader
        title="Website Builder"
        description="Draft sites, markdown imports, previews, and publish controls will live here as the builder module is expanded."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {["Draft sites", "Markdown imports", "Published previews"].map((label) => (
          <div key={label} className="rounded-2xl border border-line bg-paper p-4">
            <p className="font-black text-ink">{label}</p>
            <p className="mt-2 text-sm leading-6 text-slate">Configured placeholder</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
