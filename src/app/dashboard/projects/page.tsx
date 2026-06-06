import { ProjectsPanel } from "@/components/customer/CustomerDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const profile = await requireRole("customer");
  const data = await readData();
  return <ProjectsPanel projects={data.projects.filter((project) => project.customer_id === profile.id)} />;
}
