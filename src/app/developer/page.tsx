import { DeveloperOverview } from "@/components/developer/DeveloperDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireRole("developer");
  const data = await readData();
  const customers = data.profiles.filter((profile) => profile.role === "customer");
  return (
    <DeveloperOverview
      customers={customers}
      workItems={data.workItems}
      submissions={data.intakeSubmissions}
      projects={data.projects}
      activity={data.activity}
    />
  );
}
