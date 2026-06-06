"use client";

import { Archive, ArrowDown, ArrowUp, Plus, Save } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/FormFields";
import type {
  ActivityItem,
  ContactMessage,
  IntakeAnswer,
  IntakeQuestion,
  IntakeSubmission,
  Profile,
  Project,
  ProjectStatus,
  QuestionType,
  SiteSettings,
  Subscription,
  SubscriptionStatus,
  WorkItem,
  WorkItemNote,
  WorkItemPriority,
  WorkItemStatus
} from "@/lib/types";

const workStatuses: WorkItemStatus[] = [
  "new",
  "reviewing",
  "needs_client_info",
  "approved",
  "staged",
  "in_progress",
  "internal_review",
  "waiting_for_client_approval",
  "complete",
  "archived"
];
const priorities: WorkItemPriority[] = ["low", "normal", "high", "urgent"];
const projectStatuses: ProjectStatus[] = [
  "new",
  "intake_submitted",
  "in_review",
  "planning",
  "in_progress",
  "waiting_for_client",
  "ready_for_approval",
  "completed",
  "archived"
];
const subscriptionStatuses: SubscriptionStatus[] = ["active", "pending", "past_due", "cancelled"];
const questionTypes: QuestionType[] = ["short_text", "long_text", "email", "phone", "url", "single_select", "multi_select", "checkbox", "date"];

export function DeveloperOverview({
  customers,
  workItems,
  submissions,
  projects,
  activity
}: {
  customers: Profile[];
  workItems: WorkItem[];
  submissions: IntakeSubmission[];
  projects: Project[];
  activity: ActivityItem[];
}) {
  const { language, t } = useLanguage();

  const openWorkItems = workItems.filter((item) => !["complete", "archived"].includes(item.status));
  const inProgressProjects = projects.filter((project) => project.status === "in_progress");

  return (
    <div className="grid gap-5">
      <SectionHeader title={t("developer.overview")} description="Operational view for customer onboarding and project workflow." />
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title={t("developer.activeCustomers")} value={customers.length} />
        <Metric title={t("developer.openWorkItems")} value={openWorkItems.length} />
        <Metric title={t("developer.awaitingReview")} value={submissions.filter((submission) => submission.status === "submitted").length} />
        <Metric title={t("developer.projectsInProgress")} value={inProgressProjects.length} />
      </div>
      <Card>
        <h2 className="mb-3 text-lg font-bold text-ink">{t("developer.recentActivity")}</h2>
        <div className="grid gap-3">
          {activity.slice(0, 8).map((item) => (
            <div key={item.id} className="rounded-md bg-paper p-3 text-sm text-slate">
              {language === "es" ? item.message_es : item.message_en}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <p className="text-sm font-semibold text-slate">{title}</p>
      <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
    </Card>
  );
}

export function CustomersManager({
  customers,
  subscriptions,
  projects
}: {
  customers: Profile[];
  subscriptions: Subscription[];
  projects: Project[];
}) {
  const { t } = useLanguage();
  const [rows, setRows] = useState(subscriptions);

  const updateSubscription = async (customerId: string, planName: string, status: SubscriptionStatus) => {
    const response = await fetch(`/api/developer/customers/${customerId}/subscription`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_name: planName, status })
    });
    if (response.ok) {
      setRows((current) => current.map((row) => (row.customer_id === customerId ? { ...row, plan_name: planName, status } : row)));
    }
  };

  return (
    <Card>
      <SectionHeader title={t("developer.customers")} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs uppercase text-slate">
            <tr>
              <th className="border-b border-line py-3 pr-4">Customer</th>
              <th className="border-b border-line py-3 pr-4">Business</th>
              <th className="border-b border-line py-3 pr-4">Email</th>
              <th className="border-b border-line py-3 pr-4">Phone</th>
              <th className="border-b border-line py-3 pr-4">Subscription</th>
              <th className="border-b border-line py-3 pr-4">Projects</th>
              <th className="border-b border-line py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const subscription = rows.find((item) => item.customer_id === customer.id);
              const activeProjectCount = projects.filter((project) => project.customer_id === customer.id && project.status !== "archived").length;
              return (
                <tr key={customer.id}>
                  <td className="border-b border-line py-3 pr-4 font-semibold text-ink">{customer.full_name}</td>
                  <td className="border-b border-line py-3 pr-4 text-slate">{customer.business_name}</td>
                  <td className="border-b border-line py-3 pr-4 text-slate">{customer.email}</td>
                  <td className="border-b border-line py-3 pr-4 text-slate">{customer.phone}</td>
                  <td className="border-b border-line py-3 pr-4">
                    <div className="grid gap-2">
                      <input
                        className={inputClass}
                        defaultValue={subscription?.plan_name ?? "Starter"}
                        onBlur={(event) => updateSubscription(customer.id, event.target.value, subscription?.status ?? "pending")}
                      />
                      <select
                        className={inputClass}
                        value={subscription?.status ?? "pending"}
                        onChange={(event) => updateSubscription(customer.id, subscription?.plan_name ?? "Starter", event.target.value as SubscriptionStatus)}
                      >
                        {subscriptionStatuses.map((status) => (
                          <option key={status} value={status}>
                            {t(`status.${status}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="border-b border-line py-3 pr-4 text-slate">{activeProjectCount}</td>
                  <td className="border-b border-line py-3">
                    <Button type="button" variant="secondary">
                      {t("common.viewDetails")}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function WorkItemsManager({
  workItems,
  customers,
  submissions,
  answers,
  questions,
  notes,
  projects
}: {
  workItems: WorkItem[];
  customers: Profile[];
  submissions: IntakeSubmission[];
  answers: IntakeAnswer[];
  questions: IntakeQuestion[];
  notes: WorkItemNote[];
  projects: Project[];
}) {
  const { language, t } = useLanguage();
  const [rows, setRows] = useState(workItems);
  const [selected, setSelected] = useState<WorkItem | null>(rows[0] ?? null);
  const selectedSubmission = selected?.intake_submission_id ? submissions.find((submission) => submission.id === selected.intake_submission_id) : null;
  const selectedAnswers = selectedSubmission ? answers.filter((answer) => answer.submission_id === selectedSubmission.id) : [];
  const selectedNotes = selected ? notes.filter((note) => note.work_item_id === selected.id) : [];

  const updateWorkItem = async (id: string, updates: Partial<WorkItem> & { note?: string }) => {
    const response = await fetch(`/api/developer/work-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (!response.ok) return;
    const payload = (await response.json()) as { workItem: WorkItem };
    setRows((current) => current.map((item) => (item.id === id ? payload.workItem : item)));
    setSelected(payload.workItem);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <SectionHeader title={t("developer.workItems")} />
        <div className="grid gap-3">
          {rows.map((item) => {
            const customer = customers.find((profile) => profile.id === item.customer_id);
            return (
              <button
                key={item.id}
                type="button"
                className={`rounded-md border p-4 text-left transition ${selected?.id === item.id ? "border-teal bg-teal/5" : "border-line bg-white hover:bg-paper"}`}
                onClick={() => setSelected(item)}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-bold text-ink">{item.title}</h2>
                    <p className="mt-1 text-sm text-slate">{customer?.business_name || "Contact lead"} · {item.source_type}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge value={item.status} language={language} />
                    <Badge value={item.priority} language={language} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card>
        {selected ? (
          <div className="grid gap-4">
            <SectionHeader title={selected.title} description="Open the work item, read intake responses, update workflow, and add internal notes." />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Status">
                <select className={inputClass} value={selected.status} onChange={(event) => updateWorkItem(selected.id, { status: event.target.value as WorkItemStatus })}>
                  {workStatuses.map((status) => (
                    <option key={status} value={status}>
                      {t(`status.${status}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Priority">
                <select className={inputClass} value={selected.priority} onChange={(event) => updateWorkItem(selected.id, { priority: event.target.value as WorkItemPriority })}>
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {t(`status.${priority}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Linked project">
                <select
                  className={inputClass}
                  value={selected.project_id ?? ""}
                  onChange={(event) => updateWorkItem(selected.id, { project_id: event.target.value || null })}
                >
                  <option value="">None</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex items-end">
                <Button type="button" variant="secondary" onClick={() => updateWorkItem(selected.id, { archived: true, status: "archived" })}>
                  <Archive size={16} />
                  {t("common.archived")}
                </Button>
              </div>
            </div>

            {selectedAnswers.length ? (
              <div>
                <h3 className="mb-2 text-sm font-bold uppercase text-slate">Intake responses</h3>
                <div className="grid gap-2">
                  {selectedAnswers.map((answer) => {
                    const question = questions.find((item) => item.id === answer.question_id);
                    return (
                      <div key={answer.id} className="rounded-md bg-paper p-3">
                        <p className="text-sm font-semibold text-ink">{language === "es" ? question?.label_es : question?.label_en}</p>
                        <p className="mt-1 text-sm text-slate">{Array.isArray(answer.answer_json) ? answer.answer_json.join(", ") : String(answer.answer_json)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <InternalNoteForm workItemId={selected.id} onSave={updateWorkItem} />
            {selectedNotes.length ? (
              <div className="grid gap-2">
                {selectedNotes.map((note) => (
                  <div key={note.id} className="rounded-md bg-paper p-3 text-sm text-slate">
                    {note.note}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-slate">Select a work item.</p>
        )}
      </Card>
    </div>
  );
}

function InternalNoteForm({
  workItemId,
  onSave
}: {
  workItemId: string;
  onSave: (id: string, updates: Partial<WorkItem> & { note?: string }) => Promise<void>;
}) {
  const { t } = useLanguage();
  const [note, setNote] = useState("");

  return (
    <div className="grid gap-2">
      <Field label={t("developer.internalNotes")}>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} className={`${inputClass} min-h-24`} />
      </Field>
      <Button
        type="button"
        variant="secondary"
        onClick={async () => {
          await onSave(workItemId, { note });
          setNote("");
        }}
      >
        <Save size={16} />
        {t("common.save")}
      </Button>
    </div>
  );
}

export function IntakeQuestionManager({ questions }: { questions: IntakeQuestion[] }) {
  const { language, t } = useLanguage();
  const [rows, setRows] = useState([...questions].sort((a, b) => a.display_order - b.display_order));
  const [editing, setEditing] = useState<IntakeQuestion | null>(null);

  const saveQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: editing?.id,
      label_en: String(formData.get("label_en") ?? ""),
      label_es: String(formData.get("label_es") ?? ""),
      help_text_en: String(formData.get("help_text_en") ?? ""),
      help_text_es: String(formData.get("help_text_es") ?? ""),
      question_type: String(formData.get("question_type") ?? "short_text") as QuestionType,
      required: formData.get("required") === "on",
      active: formData.get("active") === "on",
      archived: false,
      options_json: String(formData.get("options_json") ?? "")
        .split("\n")
        .map((option) => option.trim())
        .filter(Boolean)
    };
    const response = await fetch("/api/developer/intake-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      const result = (await response.json()) as { question: IntakeQuestion };
      setRows((current) => {
        const without = current.filter((question) => question.id !== result.question.id);
        return [...without, result.question].sort((a, b) => a.display_order - b.display_order);
      });
      setEditing(null);
      event.currentTarget.reset();
    }
  };

  const patchQuestion = async (question: IntakeQuestion, updates: Partial<IntakeQuestion>) => {
    const response = await fetch(`/api/developer/intake-questions/${question.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (response.ok) {
      const result = (await response.json()) as { question: IntakeQuestion };
      setRows((current) => current.map((item) => (item.id === question.id ? result.question : item)).sort((a, b) => a.display_order - b.display_order));
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <SectionHeader title={editing ? "Edit question" : t("developer.createQuestion")} />
        <form className="grid gap-4" onSubmit={saveQuestion}>
          <Field label="Label EN">
            <input name="label_en" defaultValue={editing?.label_en} className={inputClass} required />
          </Field>
          <Field label="Label ES">
            <input name="label_es" defaultValue={editing?.label_es} className={inputClass} required />
          </Field>
          <Field label="Help text EN">
            <textarea name="help_text_en" defaultValue={editing?.help_text_en} className={inputClass} />
          </Field>
          <Field label="Help text ES">
            <textarea name="help_text_es" defaultValue={editing?.help_text_es} className={inputClass} />
          </Field>
          <Field label="Question type">
            <select name="question_type" defaultValue={editing?.question_type ?? "short_text"} className={inputClass}>
              {questionTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Options">
            <textarea name="options_json" defaultValue={editing?.options_json.join("\n")} className={`${inputClass} min-h-24`} />
          </Field>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              <input name="required" type="checkbox" defaultChecked={editing?.required} />
              {t("common.required")}
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              <input name="active" type="checkbox" defaultChecked={editing?.active ?? true} />
              {t("common.active")}
            </label>
          </div>
          <Button type="submit">
            <Plus size={16} />
            {t("common.save")}
          </Button>
        </form>
      </Card>

      <Card>
        <SectionHeader title={t("developer.intakeManager")} />
        <div className="grid gap-3">
          {rows.map((question) => (
            <div key={question.id} className="rounded-md border border-line p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-bold text-ink">{language === "es" ? question.label_es : question.label_en}</h2>
                  <p className="mt-1 text-sm text-slate">{question.question_type.replaceAll("_", " ")} · {question.required ? t("common.required") : t("common.optional")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={() => patchQuestion(question, { display_order: Math.max(1, question.display_order - 1) })}>
                    <ArrowUp size={16} />
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => patchQuestion(question, { display_order: question.display_order + 1 })}>
                    <ArrowDown size={16} />
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setEditing(question)}>
                    Edit
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => patchQuestion(question, { active: !question.active })}>
                    {question.active ? t("common.inactive") : t("common.active")}
                  </Button>
                  <Button type="button" variant="danger" onClick={() => patchQuestion(question, { archived: true, active: false })}>
                    <Archive size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function DeveloperProjects({ projects, customers }: { projects: Project[]; customers: Profile[] }) {
  const { language, t } = useLanguage();
  const [rows, setRows] = useState(projects);

  const update = async (projectId: string, status: ProjectStatus) => {
    const response = await fetch(`/api/developer/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      setRows((current) => current.map((project) => (project.id === projectId ? { ...project, status } : project)));
    }
  };

  return (
    <Card>
      <SectionHeader title={t("developer.projects")} />
      <div className="grid gap-3">
        {rows.map((project) => {
          const customer = customers.find((item) => item.id === project.customer_id);
          return (
            <div key={project.id} className="grid gap-3 rounded-md border border-line p-4 md:grid-cols-[1fr_220px]">
              <div>
                <h2 className="font-bold text-ink">{project.name}</h2>
                <p className="text-sm text-slate">{customer?.business_name} · {project.service_type}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{project.description}</p>
              </div>
              <div className="grid gap-2">
                <Badge value={project.status} language={language} />
                <select className={inputClass} value={project.status} onChange={(event) => update(project.id, event.target.value as ProjectStatus)}>
                  {projectStatuses.map((status) => (
                    <option key={status} value={status}>
                      {t(`status.${status}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function ContactMessagesManager({ messages }: { messages: ContactMessage[] }) {
  const { language, t } = useLanguage();
  const [rows, setRows] = useState(messages);

  const archive = async (id: string) => {
    const response = await fetch(`/api/developer/contact-messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "archived" })
    });
    if (response.ok) {
      setRows((current) => current.map((message) => (message.id === id ? { ...message, status: "archived" } : message)));
    }
  };

  return (
    <Card>
      <SectionHeader title={t("developer.contactMessages")} />
      <div className="grid gap-3">
        {rows.map((message) => (
          <div key={message.id} className="rounded-md border border-line p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-bold text-ink">{message.name} · {message.business_name}</h2>
                <p className="text-sm text-slate">{message.email} · {message.phone} · {message.preferred_language.toUpperCase()}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{message.message}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge value={message.status} language={language} />
                <Button type="button" variant="secondary" onClick={() => archive(message.id)}>
                  <Archive size={16} />
                  {t("common.archived")}
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!rows.length ? <p className="text-sm text-slate">No contact messages yet.</p> : null}
      </div>
    </Card>
  );
}

export function SiteSettingsForm({ settings }: { settings: SiteSettings }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [form, setForm] = useState(settings);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/developer/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setStatus(response.ok ? "success" : "error");
  };

  return (
    <Card>
      <SectionHeader title={t("developer.siteSettings")} />
      <form className="grid gap-4 md:grid-cols-2" onSubmit={save}>
        <Field label="Business display name">
          <input className={inputClass} value={form.business_display_name} onChange={(event) => setForm({ ...form, business_display_name: event.target.value })} />
        </Field>
        <Field label="Contact email">
          <input className={inputClass} value={form.contact_email} onChange={(event) => setForm({ ...form, contact_email: event.target.value })} />
        </Field>
        <Field label="Phone number">
          <input className={inputClass} value={form.phone_number} onChange={(event) => setForm({ ...form, phone_number: event.target.value })} />
        </Field>
        <Field label="Default language">
          <select className={inputClass} value={form.default_language} onChange={(event) => setForm({ ...form, default_language: event.target.value as "en" | "es" })}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </Field>
        <Field label="Facebook">
          <input className={inputClass} value={form.social_links.facebook} onChange={(event) => setForm({ ...form, social_links: { ...form.social_links, facebook: event.target.value } })} />
        </Field>
        <Field label="Instagram">
          <input className={inputClass} value={form.social_links.instagram} onChange={(event) => setForm({ ...form, social_links: { ...form.social_links, instagram: event.target.value } })} />
        </Field>
        <Field label="LinkedIn">
          <input className={inputClass} value={form.social_links.linkedin} onChange={(event) => setForm({ ...form, social_links: { ...form.social_links, linkedin: event.target.value } })} />
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            checked={form.maintenance_mode}
            onChange={(event) => setForm({ ...form, maintenance_mode: event.target.checked })}
          />
          Maintenance mode placeholder
        </label>
        <div className="md:col-span-2">
          <Button type="submit">
            <Save size={16} />
            {t("common.save")}
          </Button>
          {status === "success" ? <p className="mt-3 text-sm font-semibold text-teal">{t("common.success")}</p> : null}
          {status === "error" ? <p className="mt-3 text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
        </div>
      </form>
    </Card>
  );
}
