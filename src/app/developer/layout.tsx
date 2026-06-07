import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/auth/session";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireRole("developer");
  return <DashboardShell mode="developer">{children}</DashboardShell>;
}
