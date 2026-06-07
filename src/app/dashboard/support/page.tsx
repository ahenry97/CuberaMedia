import { SupportForm } from "@/components/customer/CustomerDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export default async function Page() {
  const profile = await requireRole("customer");
  const data = await readData();
  return <SupportForm workItems={data.workItems.filter((item) => item.customer_id === profile.id)} />;
}
