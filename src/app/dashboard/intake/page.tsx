import { IntakeForm } from "@/components/customer/CustomerDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export default async function Page() {
  await requireRole("customer");
  const data = await readData();
  const questions = data.intakeQuestions
    .filter((question) => question.active && !question.archived)
    .sort((a, b) => a.display_order - b.display_order);

  return <IntakeForm questions={questions} />;
}
