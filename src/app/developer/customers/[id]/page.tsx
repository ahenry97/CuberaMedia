import { notFound } from "next/navigation";
import { DeveloperCustomerAccount } from "@/components/developer/DeveloperDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export function generateStaticParams() {
  return [{ id: "profile-customer-1" }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("developer");
  const { id } = await params;
  const data = await readData();
  const customer = data.profiles.find((profile) => profile.id === id && profile.role === "customer");

  if (!customer) {
    notFound();
  }

  return (
    <DeveloperCustomerAccount
      customer={customer}
      subscription={data.subscriptions.find((subscription) => subscription.customer_id === customer.id)}
      plans={data.plans}
      projects={data.projects.filter((project) => project.customer_id === customer.id)}
      workItems={data.workItems.filter((item) => item.customer_id === customer.id)}
    />
  );
}
