import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRole("customer");
  return <DashboardShell mode="customer">{children}</DashboardShell>;
}
