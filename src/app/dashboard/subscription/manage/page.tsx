import { SubscriptionManagePanel } from "@/components/customer/CustomerDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const profile = await requireRole("customer");
  const data = await readData();
  const subscription = data.subscriptions.find((item) => item.customer_id === profile.id);

  return <SubscriptionManagePanel subscription={subscription} plans={data.plans} />;
}
