import { ProfileForm } from "@/components/customer/CustomerDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export default async function Page() {
  const profile = await requireRole("customer");
  const data = await readData();
  return <ProfileForm profile={profile} projects={data.projects.filter((project) => project.customer_id === profile.id)} />;
}
