import { DeveloperProjects } from "@/components/developer/DeveloperDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireRole("developer");
  const data = await readData();
  return <DeveloperProjects projects={data.projects} customers={data.profiles.filter((profile) => profile.role === "customer")} />;
}
