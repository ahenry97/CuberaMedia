import { notFound } from "next/navigation";
import { DeveloperProjectDetail } from "@/components/developer/DeveloperDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export async function generateStaticParams() {
  const data = await readData();
  return data.projects.map((project) => ({ id: project.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("developer");
  const { id } = await params;
  const data = await readData();
  const project = data.projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  return (
    <DeveloperProjectDetail
      project={project}
      customer={data.profiles.find((profile) => profile.id === project.customer_id)}
      workItems={data.workItems}
    />
  );
}
