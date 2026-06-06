import { ProfileForm } from "@/components/customer/CustomerDashboard";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Page() {
  const profile = await requireRole("customer");
  return <ProfileForm profile={profile} />;
}
