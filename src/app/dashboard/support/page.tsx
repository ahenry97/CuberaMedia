import { SupportForm } from "@/components/customer/CustomerDashboard";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireRole("customer");
  return <SupportForm />;
}
