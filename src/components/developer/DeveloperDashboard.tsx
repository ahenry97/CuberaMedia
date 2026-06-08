"use client";

import { Archive, ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Plus, RefreshCw, Save, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/FormFields";
import { appHref, isStaticExport } from "@/lib/paths";
import { appFetch } from "@/lib/staticApi";
import type {
  ActivityItem,
  ContactMessage,
  IntakeAnswer,
  IntakeQuestion,
  IntakeSubmission,
  OperationWorkflow,
  Profile,
  Plan,
  Project,
  ProjectStatus,
  QuestionType,
  SiteSettings,
  SourceType,
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
  "rejected",
  "complete",
  "archived"
];
const workflowStatuses: WorkItemStatus[] = workStatuses.filter((status) => status !== "archived");
const priorities: WorkItemPriority[] = ["low", "normal", "high", "urgent"];
const sourceTypes: SourceType[] = ["intake", "contact", "support_request", "subscription_request", "manual"];
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

function workflowForSource(sourceType: SourceType, workflows: OperationWorkflow[]) {
  return (
    workflows.find((workflow) => workflow.active && workflow.source_type === sourceType) ??
    workflows.find((workflow) => workflow.active && workflow.source_type === "intake") ??
    workflows.find((workflow) => workflow.active) ??
    null
  );
}

function validWorkflowMoves(currentStatus: WorkItemStatus, statuses: WorkItemStatus[]) {
  if (currentStatus === "archived") return ["archived"] as WorkItemStatus[];
  const index = statuses.indexOf(currentStatus);
  if (index === -1) return Array.from(new Set([currentStatus, statuses[0]].filter(Boolean))) as WorkItemStatus[];
  return [statuses[index - 1], statuses[index], statuses[index + 1]].filter(Boolean) as WorkItemStatus[];
}

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
        <Metric title={t("developer.activeCustomers")} value={customers.length} href="/developer/customers" />
        <Metric title={t("developer.openWorkItems")} value={openWorkItems.length} href="/developer/work-items" />
        <Metric title={t("developer.awaitingReview")} value={submissions.filter((submission) => submission.status === "submitted").length} href="/developer/work-items?source=intake" />
        <Metric title={t("developer.projectsInProgress")} value={inProgressProjects.length} href="/developer/projects" />
      </div>
      <Card>
        <h2 className="mb-3 text-lg font-bold text-ink">{t("developer.recentActivity")}</h2>
        <div className="grid gap-3">
          {activity.slice(0, 8).map((item) => (
            <a key={item.id} href={appHref("/developer/work-items")} className="rounded-md bg-paper p-3 text-sm text-slate transition hover:bg-blue-50 hover:text-ink">
              {language === "es" ? item.message_es : item.message_en}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ title, value, href }: { title: string; value: number; href?: string }) {
  const content = (
    <>
      <p className="text-sm font-semibold text-slate">{title}</p>
      <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
    </>
  );

  return href ? (
    <a href={appHref(href)} className="rounded-md border border-line bg-white p-5 shadow-soft transition hover:border-blue-600 hover:shadow-md">
      {content}
    </a>
  ) : (
    <Card>{content}</Card>
  );
}

export function CustomersManager({
  customers,
  subscriptions,
  projects,
  plans
}: {
  customers: Profile[];
  subscriptions: Subscription[];
  projects: Project[];
  plans: Plan[];
}) {
  const { t } = useLanguage();
  const [customerRows, setCustomerRows] = useState(customers);
  const [subscriptionRows, setSubscriptionRows] = useState(subscriptions);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id ?? "");
  const [messages, setMessages] = useState<Record<string, string>>({});
  const selectedCustomer = customerRows.find((customer) => customer.id === selectedCustomerId);
  const selectedProjects = selectedCustomer ? projects.filter((project) => project.customer_id === selectedCustomer.id && project.status !== "archived") : [];

  const saveAccount = async (event: React.FormEvent<HTMLFormElement>, customerId: string) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await appFetch(`/api/developer/customers/${customerId}/subscription`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_name: String(formData.get("plan_name") ?? ""),
        status: String(formData.get("status") ?? "pending"),
        phone: String(formData.get("phone") ?? ""),
        developer_note: String(formData.get("developer_note") ?? "")
      })
    });
    if (response.ok) {
      const phone = String(formData.get("phone") ?? "");
      const planName = String(formData.get("plan_name") ?? "");
      const status = String(formData.get("status") ?? "pending") as SubscriptionStatus;
      setCustomerRows((current) => current.map((customer) => (customer.id === customerId ? { ...customer, phone } : customer)));
      setSubscriptionRows((current) => current.map((row) => (row.customer_id === customerId ? { ...row, plan_name: planName, status } : row)));
      setMessages((current) => ({ ...current, [customerId]: "Saved and account notification recorded." }));
    } else {
      const payload = (await response.json()) as { error?: string };
      setMessages((current) => ({ ...current, [customerId]: payload.error ?? "Update failed." }));
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Card>
        <SectionHeader title={t("developer.customers")} description="Edit customer account details, subscription plan, and notification notes." />
        <div className="grid gap-4">
          {customerRows.map((customer) => {
            const subscription = subscriptionRows.find((item) => item.customer_id === customer.id);
            const activeProjectCount = projects.filter((project) => project.customer_id === customer.id && project.status !== "archived").length;
            return (
              <form key={customer.id} className="grid gap-4 rounded-md border border-line p-4" onSubmit={(event) => saveAccount(event, customer.id)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <a href={appHref(`/developer/customers/${customer.id}`)} className="text-left" onClick={() => setSelectedCustomerId(customer.id)}>
                    <p className="font-bold text-ink hover:text-ocean-700">{customer.full_name}</p>
                    <p className="text-sm text-slate">{customer.business_name} · {customer.email}</p>
                  </a>
                  <ButtonLink href={`/developer/customers/${customer.id}`} variant="secondary">
                    {t("common.viewDetails")}
                  </ButtonLink>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Phone">
                    <input name="phone" defaultValue={customer.phone} className={inputClass} required />
                  </Field>
                  <Field label="Plan">
                    <select name="plan_name" defaultValue={subscription?.plan_name ?? plans[0]?.name ?? "Starter"} className={inputClass}>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.name}>
                          {plan.name} - {plan.monthly_price}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Status">
                    <select name="status" defaultValue={subscription?.status ?? "pending"} className={inputClass}>
                      {subscriptionStatuses.map((status) => (
                        <option key={status} value={status}>
                          {t(`status.${status}`)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="rounded-md bg-paper p-3">
                    <p className="text-sm font-semibold text-slate">Projects</p>
                    <a href={appHref(`/developer/customers/${customer.id}#projects`)} className="mt-1 block text-2xl font-bold text-ink hover:text-ocean-700">{activeProjectCount}</a>
                  </div>
                </div>
                <Field label="Developer note for account notification">
                  <textarea name="developer_note" className={`${inputClass} min-h-20`} required placeholder="Explain what changed and why." />
                </Field>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit">
                    <Save size={16} />
                    {t("common.save")}
                  </Button>
                  {messages[customer.id] ? <p className="text-sm font-semibold text-ocean-700">{messages[customer.id]}</p> : null}
                </div>
              </form>
            );
          })}
        </div>
      </Card>
      <Card>
        <SectionHeader title="Customer details" description="Selected account manager view." />
        {selectedCustomer ? (
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-semibold text-slate">Customer</p>
              <p className="text-xl font-bold text-ink">{selectedCustomer.full_name}</p>
              <p className="text-sm text-slate">{selectedCustomer.email}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate">Active projects</p>
              <div className="mt-2 grid gap-2">
                {selectedProjects.map((project) => (
                  <a key={project.id} href={appHref(`/developer/customers/${selectedCustomer.id}#projects`)} className="rounded-md bg-paper p-3 text-sm font-semibold text-ink hover:bg-blue-50">
                    {project.name}
                  </a>
                ))}
                {!selectedProjects.length ? <p className="text-sm text-slate">No active projects.</p> : null}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate">Select a customer.</p>
        )}
      </Card>
    </div>
  );
}

export function DeveloperCustomerAccount({
  customer,
  subscription,
  plans,
  projects,
  workItems
}: {
  customer: Profile;
  subscription?: Subscription;
  plans: Plan[];
  projects: Project[];
  workItems: WorkItem[];
}) {
  const { language, t } = useLanguage();
  const [phone, setPhone] = useState(customer.phone);
  const [planName, setPlanName] = useState(subscription?.plan_name ?? plans[0]?.name ?? "Starter");
  const [status, setStatus] = useState<SubscriptionStatus>(subscription?.status ?? "pending");
  const [message, setMessage] = useState("");
  const activeProjects = projects.filter((project) => project.status !== "archived");
  const openWorkItems = workItems.filter((item) => item.status !== "complete" && item.status !== "archived");

  const saveAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await appFetch(`/api/developer/customers/${customer.id}/subscription`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_name: planName,
        status,
        phone,
        developer_note: String(formData.get("developer_note") ?? "")
      })
    });
    if (response.ok) {
      setMessage("Saved and account notification recorded.");
    } else {
      const payload = (await response.json()) as { error?: string };
      setMessage(payload.error ?? "Update failed.");
    }
  };

  return (
    <div className="grid gap-5">
      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader title={customer.full_name} description={`${customer.business_name} · ${customer.email}`} />
          <ButtonLink href="/developer/customers" variant="secondary">
            Back to customers
          </ButtonLink>
        </div>
        <form className="grid gap-4 md:grid-cols-3" onSubmit={saveAccount}>
          <Field label="Phone">
            <input value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} required />
          </Field>
          <Field label="Plan">
            <select value={planName} onChange={(event) => setPlanName(event.target.value)} className={inputClass}>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.name}>
                  {plan.name} - {plan.monthly_price}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select value={status} onChange={(event) => setStatus(event.target.value as SubscriptionStatus)} className={inputClass}>
              {subscriptionStatuses.map((option) => (
                <option key={option} value={option}>
                  {t(`status.${option}`)}
                </option>
              ))}
            </select>
          </Field>
          <div className="md:col-span-3">
            <Field label="Developer note for account notification">
              <textarea name="developer_note" className={`${inputClass} min-h-24`} required placeholder="Explain what changed and why." />
            </Field>
          </div>
          <div className="md:col-span-3">
            <Button type="submit">
              <Save size={16} />
              {t("common.save")}
            </Button>
            {message ? <p className="mt-3 text-sm font-semibold text-ocean-700">{message}</p> : null}
          </div>
        </form>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <div id="projects">
          <Card>
            <SectionHeader title="Active projects" description="Account project list with quick access to project management." />
            <div className="grid gap-3">
              {activeProjects.map((project) => (
                <a key={project.id} href={appHref("/developer/projects")} className="rounded-md border border-line p-4 transition hover:border-blue-600">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-bold text-ink">{project.name}</p>
                      <p className="text-sm text-slate">{project.service_type}</p>
                    </div>
                    <Badge value={project.status} language={language} />
                  </div>
                </a>
              ))}
              {!activeProjects.length ? <p className="text-sm text-slate">No active projects.</p> : null}
            </div>
          </Card>
        </div>

        <Card>
          <SectionHeader title="Open work items" description="Customer requests and internal tasks." />
          <div className="grid gap-3">
            {openWorkItems.map((item) => (
              <a key={item.id} href={appHref("/developer/work-items")} className="rounded-md bg-paper p-3 text-sm font-semibold text-ink hover:bg-blue-50">
                <span>{item.title}</span>
                <span className="mt-2 block text-xs font-medium text-slate">{t(`status.${item.status}`)}</span>
              </a>
            ))}
            {!openWorkItems.length ? <p className="text-sm text-slate">No open work items.</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function WorkItemsManager({
  workItems,
  customers,
  submissions,
  answers,
  questions,
  notes,
  projects,
  workflows
}: {
  workItems: WorkItem[];
  customers: Profile[];
  submissions: IntakeSubmission[];
  answers: IntakeAnswer[];
  questions: IntakeQuestion[];
  notes: WorkItemNote[];
  projects: Project[];
  workflows: OperationWorkflow[];
}) {
  const { language, t } = useLanguage();
  const [rows, setRows] = useState(workItems);
  const [selected, setSelected] = useState<WorkItem | null>(rows[0] ?? null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [query, setQuery] = useState("");
  const selectedSubmission = selected?.intake_submission_id ? submissions.find((submission) => submission.id === selected.intake_submission_id) : null;
  const selectedAnswers = selectedSubmission ? answers.filter((answer) => answer.submission_id === selectedSubmission.id) : [];
  const selectedNotes = selected ? notes.filter((note) => note.work_item_id === selected.id) : [];
  const selectedWorkflow = selected ? workflowForSource(selected.source_type, workflows) : null;
  const selectedWorkflowStatuses = selectedWorkflow?.statuses?.length ? selectedWorkflow.statuses : workflowStatuses;
  const selectedStatusOptions = selected ? validWorkflowMoves(selected.status, selectedWorkflowStatuses) : workflowStatuses;
  const projectOptions = selected ? projects.filter((project) => project.customer_id === selected.customer_id && project.status !== "archived") : [];
  const linkedProject = selected?.project_id
    ? projects.find((project) => project.id === selected.project_id) ?? null
    : projectOptions[0] ?? null;
  const defaultTransferProjectId = linkedProject?.id ?? projectOptions[0]?.id ?? "";
  const [transferProjectId, setTransferProjectId] = useState(defaultTransferProjectId);
  const filteredRows = rows.filter((item) => {
    const customer = customers.find((profile) => profile.id === item.customer_id);
    const matchesQuery = `${item.title} ${customer?.business_name ?? ""}`.toLowerCase().includes(query.toLowerCase());
    return (
      matchesQuery &&
      (statusFilter === "all" || item.status === statusFilter) &&
      (priorityFilter === "all" || item.priority === priorityFilter) &&
      (sourceFilter === "all" || item.source_type === sourceFilter)
    );
  });
  const selectedStageIndex = selected ? selectedWorkflowStatuses.indexOf(selected.status) : -1;
  const canStageSelected = selectedStageIndex >= 0 && selectedStageIndex < selectedWorkflowStatuses.length - 1;
  const canStageBackSelected = selectedStageIndex > 0;

  useEffect(() => {
    setTransferProjectId(defaultTransferProjectId);
  }, [defaultTransferProjectId, selected?.id]);

  const updateWorkItem = async (id: string, updates: Partial<WorkItem> & { note?: string }) => {
    const applyUpdate = (item: WorkItem): WorkItem => ({
      ...item,
      ...updates,
      updated_at: new Date().toISOString()
    });

    if (isStaticExport) {
      const currentItem = rows.find((item) => item.id === id);
      if (!currentItem) return;
      const updated = applyUpdate(currentItem);
      setRows((current) => current.map((item) => (item.id === id ? updated : item)));
      setSelected(updated);
      return;
    }

    const response = await appFetch(`/api/developer/work-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (!response.ok) return;
    const payload = (await response.json()) as { workItem: WorkItem };
    setRows((current) => current.map((item) => (item.id === id ? payload.workItem : item)));
    setSelected(payload.workItem);
  };

  const stageSelected = async (direction: "forward" | "back" = "forward") => {
    if (!selected) return;
    const currentIndex = selectedWorkflowStatuses.indexOf(selected.status);
    const nextStatus = selectedWorkflowStatuses[currentIndex + (direction === "forward" ? 1 : -1)];
    if (!nextStatus) return;
    await updateWorkItem(selected.id, {
      status: nextStatus,
      note: `Staged from ${selected.status} to ${nextStatus}. Notification/document behavior follows the configured workflow.`
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <SectionHeader title={t("developer.workItems")} />
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <Field label="Search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 text-slate" size={16} />
              <input className={`${inputClass} pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title or customer" />
            </div>
          </Field>
          <Field label="Status">
            <select className={inputClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All</option>
              {workStatuses.map((status) => (
                <option key={status} value={status}>
                  {t(`status.${status}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select className={inputClass} value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              <option value="all">All</option>
              {priorities.map((priority) => (
                <option key={priority} value={priority}>
                  {t(`status.${priority}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Source">
            <select className={inputClass} value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              <option value="all">All</option>
              {sourceTypes.map((source) => (
                <option key={source} value={source}>
                  {source.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid gap-3">
          {filteredRows.map((item) => {
            const customer = customers.find((profile) => profile.id === item.customer_id);
            return (
              <button
                key={item.id}
                type="button"
                className={`rounded-md border p-4 text-left transition ${selected?.id === item.id ? "border-blue-600 bg-blue-50" : "border-line bg-white hover:bg-paper"}`}
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
          {!filteredRows.length ? <p className="text-sm text-slate">No work items match the current filters.</p> : null}
        </div>
      </Card>

      <Card>
        {selected ? (
          <div className="grid gap-4">
            <SectionHeader title={selected.title} description="Open the work item, read intake responses, update workflow, and add internal notes." />
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Status">
                <select className={inputClass} value={selected.status} onChange={(event) => updateWorkItem(selected.id, { status: event.target.value as WorkItemStatus })}>
                  {selectedStatusOptions.map((status) => (
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
                <div className={`${inputClass} flex items-center bg-paper`}>
                  {linkedProject?.name ?? "Account project queue"}
                </div>
              </Field>
              <Field label="Transfer to project">
                <select className={inputClass} value={transferProjectId} onChange={(event) => setTransferProjectId(event.target.value)}>
                  {projectOptions.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                  {!projectOptions.length ? <option value="">No customer projects</option> : null}
                </select>
              </Field>
              <div className="flex flex-wrap items-end gap-2 md:col-span-2">
                <Button type="button" variant="secondary" onClick={() => stageSelected("back")} disabled={!canStageBackSelected}>
                  <ChevronLeft size={16} />
                  Stage back
                </Button>
                <Button type="button" variant="secondary" onClick={() => stageSelected("forward")} disabled={!canStageSelected}>
                  <ChevronRight size={16} />
                  Stage
                </Button>
                <Button type="button" variant="dashboard" onClick={() => updateWorkItem(selected.id, { project_id: transferProjectId || null })} disabled={!transferProjectId}>
                  Transfer
                </Button>
              </div>
            </div>
            <div className="grid gap-3 rounded-md bg-paper p-4 text-sm text-slate md:grid-cols-2">
              <div>
                <p className="font-bold text-ink">Workflow notices</p>
                <p className="mt-1">Active workflow: {selectedWorkflow?.name ?? "Default workflow"}. Status choices show the current stage, previous stage, and next stage.</p>
              </div>
              <div>
                <p className="font-bold text-ink">Documents</p>
                <p className="mt-1">Document review/request steps are tracked here once a work type requires them.</p>
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
                        <p className="mt-1 text-sm text-slate">{formatAnswer(answer.answer_json)}</p>
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

function formatAnswer(value: IntakeAnswer["answer_json"]): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) {
    const hasWebsite = value.hasWebsite === true ? "Yes" : "No";
    const url = typeof value.url === "string" && value.url ? `, URL: ${value.url}` : "";
    return `Has website: ${hasWebsite}${url}`;
  }
  return String(value);
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

export function DeveloperManager({ questions, plans, workflows }: { questions: IntakeQuestion[]; plans: Plan[]; workflows: OperationWorkflow[] }) {
  const { language, t } = useLanguage();
  const [rows, setRows] = useState([...questions].sort((a, b) => a.display_order - b.display_order));
  const [editing, setEditing] = useState<IntakeQuestion | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [planRows, setPlanRows] = useState(plans);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [workflowRows, setWorkflowRows] = useState(workflows);
  const [editingWorkflow, setEditingWorkflow] = useState<OperationWorkflow | null>(workflows[0] ?? null);
  const [managerSearch, setManagerSearch] = useState("");
  const filteredRows = rows.filter((question) => {
    const label = `${question.label_en} ${question.label_es}`.toLowerCase();
    return (
      label.includes(search.toLowerCase()) &&
      (typeFilter === "all" || question.question_type === typeFilter) &&
      (activeFilter === "all" || String(question.active) === activeFilter)
    );
  });
  const managerQuery = managerSearch.toLowerCase();
  const filteredWorkflowRows = workflowRows.filter((workflow) => `${workflow.name} ${workflow.description} ${workflow.source_type}`.toLowerCase().includes(managerQuery));
  const filteredPlanRows = planRows.filter((plan) => `${plan.name} ${plan.description_en} ${plan.description_es}`.toLowerCase().includes(managerQuery));
  const filteredManagerQuestions = rows.filter((question) => `${question.label_en} ${question.label_es}`.toLowerCase().includes(managerQuery));
  const openAddTarget = (target: "workflow" | "question" | "plan") => {
    if (target === "workflow") {
      setEditingWorkflow(null);
      window.location.hash = "workflow-editor";
    } else if (target === "question") {
      setEditing(null);
      window.location.hash = "question-editor";
    } else {
      setEditingPlan(null);
      window.location.hash = "plan-editor";
    }
  };

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
    if (isStaticExport) {
      const question: IntakeQuestion = {
        ...payload,
        id: payload.id ?? `question-static-${Date.now()}`,
        display_order: editing?.display_order ?? rows.length + 1,
        created_at: editing?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setRows((current) => {
        const without = current.filter((item) => item.id !== question.id);
        return [...without, question].sort((a, b) => a.display_order - b.display_order);
      });
      setEditing(null);
      event.currentTarget.reset();
      return;
    }

    const response = await appFetch("/api/developer/intake-questions", {
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
    if (isStaticExport) {
      const updated = { ...question, ...updates, updated_at: new Date().toISOString() };
      setRows((current) => current.map((item) => (item.id === question.id ? updated : item)).sort((a, b) => a.display_order - b.display_order));
      return;
    }

    const response = await appFetch(`/api/developer/intake-questions/${question.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (response.ok) {
      const result = (await response.json()) as { question: IntakeQuestion };
      setRows((current) => current.map((item) => (item.id === question.id ? result.question : item)).sort((a, b) => a.display_order - b.display_order));
    }
  };

  const savePlan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      id: editingPlan?.id,
      name: String(formData.get("name") ?? ""),
      monthly_price: String(formData.get("monthly_price") ?? ""),
      description_en: String(formData.get("description_en") ?? ""),
      description_es: String(formData.get("description_es") ?? ""),
      features_en: String(formData.get("features_en") ?? ""),
      features_es: String(formData.get("features_es") ?? ""),
      requires_verification: formData.get("requires_verification") === "on",
      notification_note_en: String(formData.get("notification_note_en") ?? ""),
      notification_note_es: String(formData.get("notification_note_es") ?? "")
    };
    if (isStaticExport) {
      const plan: Plan = {
        id: payload.id ?? `plan-static-${Date.now()}`,
        name: payload.name,
        monthly_price: payload.monthly_price,
        description_en: payload.description_en,
        description_es: payload.description_es,
        features_en: payload.features_en
          .split("\n")
          .map((feature) => feature.trim())
          .filter(Boolean),
        features_es: payload.features_es
          .split("\n")
          .map((feature) => feature.trim())
          .filter(Boolean),
        requires_verification: payload.requires_verification,
        notification_note_en: payload.notification_note_en,
        notification_note_es: payload.notification_note_es
      };
      setPlanRows((current) => {
        const without = current.filter((item) => item.id !== plan.id);
        return [...without, plan].sort((a, b) => a.name.localeCompare(b.name));
      });
      setEditingPlan(null);
      event.currentTarget.reset();
      return;
    }

    const response = await appFetch("/api/developer/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      const result = (await response.json()) as { plan: Plan };
      setPlanRows((current) => {
        const without = current.filter((plan) => plan.id !== result.plan.id);
        return [...without, result.plan].sort((a, b) => a.name.localeCompare(b.name));
      });
      setEditingPlan(null);
      event.currentTarget.reset();
    }
  };

  const deletePlan = async (planId: string) => {
    if (isStaticExport) {
      setPlanRows((current) => current.filter((plan) => plan.id !== planId));
      if (editingPlan?.id === planId) setEditingPlan(null);
      return;
    }

    const response = await appFetch("/api/developer/plans", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: planId })
    });
    if (response.ok) {
      setPlanRows((current) => current.filter((plan) => plan.id !== planId));
      if (editingPlan?.id === planId) setEditingPlan(null);
    }
  };

  const saveWorkflow = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const statuses = String(formData.get("statuses") ?? "")
      .split("\n")
      .map((status) => status.trim())
      .filter(Boolean);
    if (isStaticExport) {
      const workflow: OperationWorkflow = {
        id: editingWorkflow?.id ?? `workflow-static-${Date.now()}`,
        name: String(formData.get("name") ?? ""),
        description: String(formData.get("description") ?? ""),
        source_type: String(formData.get("source_type") ?? "manual") as SourceType,
        statuses: statuses as WorkItemStatus[],
        notification_rules: String(formData.get("notification_rules") ?? ""),
        document_rules: String(formData.get("document_rules") ?? ""),
        active: formData.get("active") === "on",
        created_at: editingWorkflow?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setWorkflowRows((current) => {
        const without = current.filter((item) => item.id !== workflow.id);
        return [...without, workflow].sort((a, b) => a.name.localeCompare(b.name));
      });
      setEditingWorkflow(workflow);
      return;
    }

    const response = await appFetch("/api/developer/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingWorkflow?.id,
        name: String(formData.get("name") ?? ""),
        description: String(formData.get("description") ?? ""),
        source_type: String(formData.get("source_type") ?? "manual"),
        statuses,
        notification_rules: String(formData.get("notification_rules") ?? ""),
        document_rules: String(formData.get("document_rules") ?? ""),
        active: formData.get("active") === "on"
      })
    });
    if (response.ok) {
      const result = (await response.json()) as { workflow: OperationWorkflow };
      setWorkflowRows((current) => {
        const without = current.filter((workflow) => workflow.id !== result.workflow.id);
        return [...without, result.workflow].sort((a, b) => a.name.localeCompare(b.name));
      });
      setEditingWorkflow(result.workflow);
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    if (isStaticExport) {
      setWorkflowRows((current) => current.filter((workflow) => workflow.id !== workflowId));
      if (editingWorkflow?.id === workflowId) setEditingWorkflow(null);
      return;
    }

    const response = await appFetch("/api/developer/workflows", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: workflowId })
    });
    if (response.ok) {
      setWorkflowRows((current) => current.filter((workflow) => workflow.id !== workflowId));
      if (editingWorkflow?.id === workflowId) setEditingWorkflow(null);
    }
  };

  return (
    <div className="grid gap-5">
      <Card>
        <SectionHeader title={t("developer.intakeManager")} description="Search configured workflows, request questions, and subscription plan tasks from one manager view." />
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
          <Field label="Search configured items">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 text-slate" size={16} />
              <input className={`${inputClass} pl-9`} value={managerSearch} onChange={(event) => setManagerSearch(event.target.value)} placeholder="Workflow, question, plan, or task" />
            </div>
          </Field>
          <Button type="button" variant="secondary" onClick={() => openAddTarget("workflow")}>
            <Plus size={16} />
            New workflow
          </Button>
          <Button type="button" variant="secondary" onClick={() => openAddTarget("question")}>
            <Plus size={16} />
            New question
          </Button>
          <Button type="button" variant="secondary" onClick={() => openAddTarget("plan")}>
            <Plus size={16} />
            New plan
          </Button>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-line bg-paper p-4">
            <p className="font-black text-ink">Workflows</p>
            <p className="mt-1 text-sm text-slate">{filteredWorkflowRows.length} configured</p>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-4">
            <p className="font-black text-ink">Request questions</p>
            <p className="mt-1 text-sm text-slate">{filteredManagerQuestions.length} configured</p>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-4">
            <p className="font-black text-ink">Plan tasks</p>
            <p className="mt-1 text-sm text-slate">{filteredPlanRows.length} configured</p>
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title={t("developer.intakeManager")} description="Configure operational workflows, intake questions, and subscription options." />
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <form id="workflow-editor" key={editingWorkflow?.id ?? "new-workflow"} className="grid gap-4 rounded-md bg-paper p-4" onSubmit={saveWorkflow}>
            <h2 className="font-bold text-ink">{editingWorkflow ? "Edit operation workflow" : "Create operation workflow"}</h2>
            <Field label="Workflow name">
              <input name="name" defaultValue={editingWorkflow?.name} className={inputClass} required />
            </Field>
            <Field label="Source type">
              <select name="source_type" defaultValue={editingWorkflow?.source_type ?? "manual"} className={inputClass}>
                {sourceTypes.map((source) => (
                  <option key={source} value={source}>
                    {source.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Description">
              <textarea name="description" defaultValue={editingWorkflow?.description} className={inputClass} />
            </Field>
            <Field label="Statuses">
              <textarea
                name="statuses"
                defaultValue={(editingWorkflow?.statuses ?? workflowStatuses).join("\n")}
                className={`${inputClass} min-h-28`}
                required
              />
            </Field>
            <Field label="Notification rules">
              <textarea name="notification_rules" defaultValue={editingWorkflow?.notification_rules} className={inputClass} />
            </Field>
            <Field label="Document rules">
              <textarea name="document_rules" defaultValue={editingWorkflow?.document_rules} className={inputClass} />
            </Field>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              <input name="active" type="checkbox" defaultChecked={editingWorkflow?.active ?? true} />
              {t("common.active")}
            </label>
            <div className="flex flex-wrap gap-2">
              <Button type="submit">
                <Save size={16} />
                {t("common.save")}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setEditingWorkflow(null)}>
                New workflow
              </Button>
            </div>
          </form>
          <div className="grid gap-3">
            {filteredWorkflowRows.map((workflow) => (
              <div key={workflow.id} className="rounded-md border border-line p-4">
                <button type="button" className="w-full text-left" onClick={() => setEditingWorkflow(workflow)}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-bold text-ink">{workflow.name}</h2>
                      <p className="text-sm text-slate">{workflow.source_type.replaceAll("_", " ")} · {workflow.description}</p>
                    </div>
                    <Badge value={workflow.active ? "active" : "archived"} language={language} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {workflow.statuses.map((status) => (
                      <Badge key={status} value={status} language={language} />
                    ))}
                  </div>
                  <div className="mt-3 grid gap-2 text-xs font-semibold text-slate">
                    {workflow.statuses.map((status, index) => (
                      <span key={`${workflow.id}-${status}`} className="rounded-lg bg-paper px-3 py-2">
                        {t(`status.${status}`)} · back: {workflow.statuses[index - 1] ? t(`status.${workflow.statuses[index - 1]}`) : "none"} · next: {workflow.statuses[index + 1] ? t(`status.${workflow.statuses[index + 1]}`) : "none"}
                      </span>
                    ))}
                  </div>
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={() => setEditingWorkflow(workflow)}>
                    Edit
                  </Button>
                  <Button type="button" variant="danger" onClick={() => deleteWorkflow(workflow.id)}>
                    <Archive size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-md bg-paper p-4">
            <h2 className="font-bold text-ink">Conditional intake rules</h2>
            <p className="mt-3 text-sm leading-6 text-slate">Current rule: when the customer confirms they already have a website, the intake form requires a valid website URL before submission.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <SectionHeader title={editing ? "Edit question" : t("developer.createQuestion")} />
          <form id="question-editor" key={editing?.id ?? "new-question"} className="grid gap-4" onSubmit={saveQuestion}>
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
          <SectionHeader title="Intake questions" />
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <Field label="Search">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 text-slate" size={16} />
                <input className={`${inputClass} pl-9`} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Question label" />
              </div>
            </Field>
            <Field label="Type">
              <select className={inputClass} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                <option value="all">All</option>
                {questionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Active">
              <select className={inputClass} value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)}>
                <option value="all">All</option>
                <option value="true">{t("common.active")}</option>
                <option value="false">{t("common.inactive")}</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-3">
            {filteredRows.map((question) => (
              <div key={question.id} className="rounded-md border border-line p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <button type="button" className="text-left" onClick={() => setEditing(question)}>
                    <h2 className="font-bold text-ink">{language === "es" ? question.label_es : question.label_en}</h2>
                    <p className="mt-1 text-sm text-slate">{question.question_type.replaceAll("_", " ")} · {question.required ? t("common.required") : t("common.optional")}</p>
                  </button>
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
            {!filteredRows.length ? <p className="text-sm text-slate">No intake questions match the filters.</p> : null}
          </div>
        </Card>
      </div>

      <Card>
          <SectionHeader title={t("developer.planCatalog")} description="Plans shown to customers when they request a subscription change." />
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <form id="plan-editor" key={editingPlan?.id ?? "new-plan"} className="grid gap-4" onSubmit={savePlan}>
            <Field label="Plan name">
              <input name="name" defaultValue={editingPlan?.name} className={inputClass} required />
            </Field>
            <Field label="Monthly price">
              <input name="monthly_price" defaultValue={editingPlan?.monthly_price} className={inputClass} required />
            </Field>
            <Field label="Description EN">
              <textarea name="description_en" defaultValue={editingPlan?.description_en} className={inputClass} />
            </Field>
            <Field label="Description ES">
              <textarea name="description_es" defaultValue={editingPlan?.description_es} className={inputClass} />
            </Field>
            <Field label="Features EN">
              <textarea name="features_en" defaultValue={editingPlan?.features_en.join("\n")} className={`${inputClass} min-h-24`} />
            </Field>
            <Field label="Features ES">
              <textarea name="features_es" defaultValue={editingPlan?.features_es.join("\n")} className={`${inputClass} min-h-24`} />
            </Field>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              <input name="requires_verification" type="checkbox" defaultChecked={editingPlan?.requires_verification} />
              Requires developer verification
            </label>
            <Field label="Notification note EN">
              <textarea name="notification_note_en" defaultValue={editingPlan?.notification_note_en} className={inputClass} />
            </Field>
            <Field label="Notification note ES">
              <textarea name="notification_note_es" defaultValue={editingPlan?.notification_note_es} className={inputClass} />
            </Field>
            <Button type="submit">
              <Save size={16} />
              {t("common.save")}
            </Button>
          </form>
          <div className="grid gap-3">
            {filteredPlanRows.map((plan) => (
              <div key={plan.id} className="rounded-md border border-line p-4">
                <button type="button" className="w-full text-left" onClick={() => setEditingPlan(plan)}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-bold text-ink">{plan.name}</h2>
                      <p className="text-sm text-slate">{plan.monthly_price} · {language === "es" ? plan.description_es : plan.description_en}</p>
                    </div>
                    <Badge value={plan.requires_verification ? "reviewing" : "approved"} language={language} />
                  </div>
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" onClick={() => setEditingPlan(plan)}>
                    Edit
                  </Button>
                  <Button type="button" variant="danger" onClick={() => deletePlan(plan.id)}>
                    <Archive size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function DeveloperProjects({ projects, customers }: { projects: Project[]; customers: Profile[] }) {
  const { language, t } = useLanguage();
  const [rows, setRows] = useState(projects);

  const update = async (projectId: string, status: ProjectStatus) => {
    if (isStaticExport) {
      setRows((current) => current.map((project) => (project.id === projectId ? { ...project, status, updated_at: new Date().toISOString() } : project)));
      return;
    }

    const response = await appFetch(`/api/developer/projects/${projectId}`, {
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
                <a href={appHref(`/developer/projects/${project.id}`)} className="text-lg font-black text-ink hover:text-blue-700">{project.name}</a>
                <p className="text-sm text-slate">
                  <a href={appHref(customer ? `/developer/customers/${customer.id}` : "/developer/customers")} className="font-semibold text-ink hover:text-ocean-700">{customer?.business_name}</a> · {project.service_type}
                </p>
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
                <ButtonLink href={`/developer/projects/${project.id}`} variant="secondary">
                  {t("common.viewDetails")}
                </ButtonLink>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function DeveloperProjectDetail({ project, customer, workItems }: { project: Project; customer?: Profile; workItems: WorkItem[] }) {
  const { language, t } = useLanguage();
  const [form, setForm] = useState(project);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const relatedWorkItems = workItems.filter((item) => item.project_id === project.id);

  const saveProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const response = await appFetch(`/api/developer/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        service_type: form.service_type,
        description: form.description,
        status: form.status
      })
    }, { project: form });

    if (response.ok) {
      const result = (await response.json()) as { project?: Project };
      setForm(result.project ?? form);
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
      <Card>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader title={form.name} description={`${customer?.business_name ?? "Customer account"} · ${form.service_type}`} />
          <ButtonLink href="/developer/projects" variant="secondary">
            Back to projects
          </ButtonLink>
        </div>
        <form className="grid gap-4" onSubmit={saveProject}>
          <Field label="Project name">
            <input className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <Field label="Service type">
            <input className={inputClass} value={form.service_type} onChange={(event) => setForm({ ...form, service_type: event.target.value })} />
          </Field>
          <Field label="Description">
            <textarea className={`${inputClass} min-h-32`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </Field>
          <Field label="Status">
            <select className={inputClass} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProjectStatus })}>
              {projectStatuses.map((option) => (
                <option key={option} value={option}>
                  {t(`status.${option}`)}
                </option>
              ))}
            </select>
          </Field>
          <Button type="submit" variant="dashboard" disabled={status === "loading"}>
            <Save size={16} />
            {t("common.save")}
          </Button>
          {status === "success" ? <p className="text-sm font-bold text-ocean-700">{t("common.success")}</p> : null}
          {status === "error" ? <p className="text-sm font-bold text-red-600">{t("common.error")}</p> : null}
        </form>
      </Card>

      <Card>
        <SectionHeader title="Project review" description="Related work items and current project state." />
        <div className="grid gap-3">
          <div className="rounded-2xl bg-paper p-4">
            <p className="text-sm font-bold text-slate">Current status</p>
            <div className="mt-2">
              <Badge value={form.status} language={language} />
            </div>
          </div>
          {relatedWorkItems.map((item) => (
            <a key={item.id} href={appHref("/developer/work-items")} className="rounded-2xl border border-line p-4 transition hover:border-blue-600">
              <p className="font-black text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-slate">{item.source_type.replaceAll("_", " ")}</p>
            </a>
          ))}
          {!relatedWorkItems.length ? <p className="text-sm text-slate">No linked work items yet.</p> : null}
        </div>
      </Card>
    </div>
  );
}

export function ContactMessagesManager({ messages }: { messages: ContactMessage[] }) {
  const { language, t } = useLanguage();
  const [rows, setRows] = useState(messages);
  const [refreshStatus, setRefreshStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const refresh = useCallback(async () => {
    setRefreshStatus("loading");
    const response = await appFetch("/api/developer/contact-messages");
    if (response.ok) {
      const payload = (await response.json()) as { messages?: ContactMessage[] };
      setRows(payload.messages ?? []);
      setRefreshStatus("success");
    } else {
      setRefreshStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(refresh, 15000);
    window.addEventListener("cubera-static-data-change", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("cubera-static-data-change", refresh);
    };
  }, [refresh]);

  const archive = async (id: string) => {
    if (isStaticExport) {
      setRows((current) => current.map((message) => (message.id === id ? { ...message, status: "archived" } : message)));
      return;
    }

    const response = await appFetch(`/api/developer/contact-messages/${id}`, {
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
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeader title={t("developer.contactMessages")} description="Review new contact submissions and refresh for messages submitted during testing." />
        <Button type="button" variant="secondary" onClick={refresh} disabled={refreshStatus === "loading"}>
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>
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
    const response = await appFetch("/api/developer/site-settings", {
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
          {status === "success" ? <p className="mt-3 text-sm font-semibold text-ocean-700">{t("common.success")}</p> : null}
          {status === "error" ? <p className="mt-3 text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
        </div>
      </form>
    </Card>
  );
}
