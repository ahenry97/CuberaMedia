import { PricingPage } from "@/components/public/PublicPages";
import { readData } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await readData();
  return <PricingPage plans={data.plans} />;
}
