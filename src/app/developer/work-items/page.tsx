import { WorkItemsManager } from "@/components/developer/DeveloperDashboard";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export default async function Page() {
  await requireRole("developer");
  const data = await readData();
  return (
    <WorkItemsManager
      workItems={data.workItems}
      customers={data.profiles.filter((profile) => profile.role === "customer")}
      submissions={data.intakeSubmissions}
      answers={data.intakeAnswers}
      questions={data.intakeQuestions}
      notes={data.workItemNotes}
      projects={data.projects}
    />
  );
}
