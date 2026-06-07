import { notFound } from "next/navigation";
import { ProjectDetailPanel } from "@/components/customer/CustomerDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireRole("customer");
  const { id } = await params;
  const data = await readData();
  const project = data.projects.find((item) => item.id === id && item.customer_id === profile.id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailPanel project={project} workItems={data.workItems.filter((item) => item.customer_id === profile.id)} />;
}
