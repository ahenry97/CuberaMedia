import { CustomerOverview } from "@/components/customer/CustomerDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const profile = await requireRole("customer");
  const data = await readData();
  const projects = data.projects.filter((project) => project.customer_id === profile.id);
  const workItems = data.workItems.filter((item) => item.customer_id === profile.id);
  const subscription = data.subscriptions.find((item) => item.customer_id === profile.id);

  return <CustomerOverview profile={profile} subscription={subscription} projects={projects} workItems={workItems} activity={data.activity} />;
}
