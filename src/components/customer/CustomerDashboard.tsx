"use client";

import { ArrowRight, Download, Edit3, FileText, History, Search, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/FormFields";
import { appHref } from "@/lib/paths";
import { appFetch } from "@/lib/staticApi";
import { getStaticProfile } from "@/lib/staticAuth";
import type { ActivityItem, IntakeAnswerValue, IntakeQuestion, Plan, Profile, Project, Subscription, WorkItem } from "@/lib/types";

export function CustomerOverview({
  profile,
  subscription,
  projects,
  workItems,
  activity
}: {
  profile: Profile;
  subscription?: Subscription;
  projects: Project[];
  workItems: WorkItem[];
  activity: ActivityItem[];
}) {
  const { language, t } = useLanguage();
  const [displayProfile, setDisplayProfile] = useState(profile);
  const activeProjects = projects.filter((project) => project.status !== "completed" && project.status !== "archived");
  const pendingWorkItems = workItems.filter((item) => item.status !== "complete" && item.status !== "archived");

  useEffect(() => {
    setDisplayProfile(getStaticProfile() ?? profile);
  }, [profile]);

  return (
    <div className="grid gap-5">
      <SectionHeader title={`${t("dashboard.welcome")}, ${displayProfile.full_name}`} description={displayProfile.business_name} />
      <div className="grid gap-4 md:grid-cols-3">
        <Metric
          title={t("dashboard.currentPlan")}
          value={subscription?.plan_name ?? "Starter"}
          badge={subscription?.status}
          language={language}
          href="/dashboard/subscription"
        />
        <Metric title={t("dashboard.activeProjects")} value={activeProjects.length.toString()} href="/dashboard/projects" />
        <Metric title={t("dashboard.pendingForms")} value={pendingWorkItems.length.toString()} href="/dashboard/intake" />
      </div>
      <Card>
        <h2 className="mb-3 text-lg font-bold text-ink">{t("dashboard.recentUpdates")}</h2>
        <div className="grid gap-3">
          {activity.slice(0, 5).map((item) => (
            <a key={item.id} href={appHref("/dashboard/projects")} className="rounded-md bg-paper p-3 text-sm text-slate transition hover:bg-blue-50 hover:text-ink">
              {language === "es" ? item.message_es : item.message_en}
            </a>
          ))}
          {!activity.length ? <p className="text-sm text-slate">No recent updates yet.</p> : null}
        </div>
      </Card>
      <Card>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-ink">{t("dashboard.supportRequests")}</h2>
          <ButtonLink href="/dashboard/support" variant="secondary">
            {t("dashboard.requestSupport")}
          </ButtonLink>
        </div>
        <div className="grid gap-3">
          {pendingWorkItems
            .filter((item) => item.source_type === "support_request" || item.source_type === "subscription_request")
            .slice(0, 4)
            .map((item) => (
              <a key={item.id} href={appHref("/dashboard/support")} className="flex flex-col gap-2 rounded-md bg-paper p-3 text-sm transition hover:bg-blue-50 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold text-ink">{item.title}</span>
                <Badge value={item.status} language={language} />
              </a>
            ))}
          {!pendingWorkItems.filter((item) => item.source_type === "support_request" || item.source_type === "subscription_request").length ? (
            <p className="text-sm text-slate">No open support or subscription requests.</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

function Metric({ title, value, badge, language = "en", href }: { title: string; value: string; badge?: string; language?: "en" | "es"; href?: string }) {
  const content = (
    <>
      <p className="text-sm font-semibold text-slate">{title}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-3xl font-bold text-ink">{value}</p>
        {badge ? <Badge value={badge} language={language} /> : null}
      </div>
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

export function SubscriptionPanel({ subscription }: { subscription?: Subscription }) {
  const { language, t } = useLanguage();

  return (
    <Card>
      <SectionHeader title={t("dashboard.subscription")} />
      {subscription ? (
        <div className="grid gap-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate">{t("dashboard.currentPlan")}</p>
              <h2 className="text-2xl font-bold text-ink">{subscription.plan_name}</h2>
            </div>
            <Badge value={subscription.status} language={language} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate">{t("dashboard.renewal")}</p>
            <p className="text-ink">{subscription.renewal_date ?? "TBD"}</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate">{t("dashboard.includedServices")}</p>
            <ul className="grid gap-2 text-sm text-slate">
              {subscription.included_services.map((service) => (
                <li key={service} className="rounded-md bg-paper p-3">
                  {service}
                </li>
              ))}
            </ul>
          </div>
          <ButtonLink href="/dashboard/subscription/manage" variant="secondary">
            {t("dashboard.manageSubscription")}
          </ButtonLink>
        </div>
      ) : (
        <p className="text-slate">No subscription record found.</p>
      )}
    </Card>
  );
}

export function SubscriptionManagePanel({ subscription, plans }: { subscription?: Subscription; plans: Plan[] }) {
  const { language, t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState(subscription?.plan_name ?? plans[0]?.name ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const selected = plans.find((plan) => plan.name === selectedPlan) ?? plans[0];

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const response = await appFetch("/api/subscription/change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan_name: selectedPlan,
        note: String(formData.get("note") ?? "")
      })
    });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  };

  return (
    <div className="grid gap-5">
      <Card>
        <SectionHeader
          title={t("dashboard.manageSubscription")}
          description="Choose a plan and submit a request. Plans marked for verification create a developer work item before activation."
        />
        <form className="grid gap-4" onSubmit={submit}>
          <Field label="Plan">
            <select className={inputClass} value={selectedPlan} onChange={(event) => setSelectedPlan(event.target.value)} required>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.name}>
                  {plan.name} - {plan.monthly_price}
                </option>
              ))}
            </select>
          </Field>
          {selected ? (
            <div className="rounded-md bg-paper p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-bold text-ink">{selected.name}</p>
                  <p className="text-sm text-slate">{language === "es" ? selected.description_es : selected.description_en}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge value={selected.requires_verification ? "reviewing" : "approved"} language={language} />
                  <span className="rounded-md bg-white px-3 py-2 text-sm font-bold text-ink">{selected.monthly_price}</span>
                </div>
              </div>
              <ul className="mt-3 grid gap-2 text-sm text-slate">
                {(language === "es" ? selected.features_es : selected.features_en).map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <Field label="Request note">
            <textarea name="note" className={`${inputClass} min-h-28`} placeholder="Share timing, approval notes, or questions for this plan change." />
          </Field>
          <Button type="submit" disabled={status === "loading"}>
            {t("common.submit")}
          </Button>
          {status === "success" ? <p className="text-sm font-semibold text-ocean-700">{t("common.success")}</p> : null}
          {status === "error" ? <p className="text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
        </form>
      </Card>
    </div>
  );
}

export function ProjectsPanel({ projects }: { projects: Project[] }) {
  const { language, t } = useLanguage();

  return (
    <Card>
      <SectionHeader title={t("dashboard.projects")} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-slate">
            <tr>
              <th className="border-b border-line py-3 pr-4">Project</th>
              <th className="border-b border-line py-3 pr-4">Service</th>
              <th className="border-b border-line py-3 pr-4">Status</th>
              <th className="border-b border-line py-3 pr-4">Last updated</th>
              <th className="border-b border-line py-3 pr-4">Assigned</th>
              <th className="border-b border-line py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td className="border-b border-line py-3 pr-4 font-semibold text-ink">{project.name}</td>
                <td className="border-b border-line py-3 pr-4 text-slate">{project.service_type}</td>
                <td className="border-b border-line py-3 pr-4">
                  <Badge value={project.status} language={language} />
                </td>
                <td className="border-b border-line py-3 pr-4 text-slate">{new Date(project.updated_at).toLocaleDateString()}</td>
                <td className="border-b border-line py-3 pr-4 text-slate">{project.assigned_to ? "Team member" : "TBD"}</td>
                <td className="border-b border-line py-3">
                  <ButtonLink href={`/dashboard/projects/${project.id}`} variant="secondary">
                    {t("common.viewDetails")}
                  </ButtonLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function ProjectDetailPanel({ project, workItems }: { project: Project; workItems: WorkItem[] }) {
  const { language, t } = useLanguage();
  const relatedItems = workItems.filter((item) => item.project_id === project.id);

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader title={project.name} description={project.description} />
          <Badge value={project.status} language={language} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md bg-paper p-4">
            <p className="text-sm font-semibold text-slate">Service</p>
            <p className="mt-2 font-bold text-ink">{project.service_type}</p>
          </div>
          <div className="rounded-md bg-paper p-4">
            <p className="text-sm font-semibold text-slate">Last updated</p>
            <p className="mt-2 font-bold text-ink">{new Date(project.updated_at).toLocaleDateString()}</p>
          </div>
          <div className="rounded-md bg-paper p-4">
            <p className="text-sm font-semibold text-slate">Account manager</p>
            <p className="mt-2 font-bold text-ink">{project.assigned_to ? "Assigned team member" : "Pending assignment"}</p>
          </div>
        </div>
      </Card>
      <Card>
        <SectionHeader title="Project workflow" description="Related tasks and requests for this project." />
        <div className="grid gap-3">
          {relatedItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 rounded-md border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-ink">{item.title}</p>
                <p className="text-sm text-slate">{item.source_type.replaceAll("_", " ")}</p>
              </div>
              <Badge value={item.status} language={language} />
            </div>
          ))}
          {!relatedItems.length ? <p className="text-sm text-slate">No linked work items yet.</p> : null}
        </div>
      </Card>
      <Card>
        <SectionHeader title="Metrics imports" description="Future reporting imports from website analytics, social media, and marketing data sources will appear here." />
        <div className="grid gap-3 md:grid-cols-3">
          {["Website analytics", "Social media", "Marketing performance"].map((label) => (
            <div key={label} className="rounded-md border border-dashed border-line p-4">
              <p className="font-bold text-ink">{label}</p>
              <p className="mt-2 text-sm text-slate">Import setup placeholder</p>
            </div>
          ))}
        </div>
        <ButtonLink href="/dashboard/projects" variant="secondary" className="mt-5">
          <ArrowRight size={16} />
          {t("dashboard.projects")}
        </ButtonLink>
      </Card>
    </div>
  );
}

export function IntakeForm({ questions }: { questions: IntakeQuestion[] }) {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const answers: Record<string, IntakeAnswerValue> = {};

    questions.forEach((question) => {
      if (question.id === "question-2") {
        const selected = formData.getAll(question.id).map(String);
        const other = String(formData.get(`${question.id}_other`) ?? "").trim();
        answers[question.id] = other ? [...selected, `Other: ${other}`] : selected;
      } else if (question.id === "question-3") {
        const hasWebsite = formData.get(question.id) === "on";
        const rawUrl = String(formData.get(`${question.id}_url`) ?? "").trim();
        const normalizedUrl = rawUrl && !/^[a-z][a-z0-9+.-]*:/i.test(rawUrl) ? `https://${rawUrl}` : rawUrl;
        answers[question.id] = {
          hasWebsite,
          url: hasWebsite ? normalizedUrl : ""
        };
      } else if (question.question_type === "multi_select") {
        answers[question.id] = formData.getAll(question.id).map(String);
      } else if (question.question_type === "checkbox") {
        answers[question.id] = formData.get(question.id) === "on";
      } else {
        answers[question.id] = String(formData.get(question.id) ?? "");
      }
    });

    const response = await appFetch("/api/intake/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });

    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  };

  return (
    <Card>
      <SectionHeader title={t("dashboard.intake")} description={language === "es" ? "Busque formularios activos y envie solicitudes configuradas por el equipo." : "Search active forms and submit requests configured by the development team."} />
      <RequestFormsManager questionCount={questions.length} language={language} />
      <form className="grid gap-5" onSubmit={submit}>
        {questions.map((question) => (
          <DynamicQuestion key={question.id} question={question} language={language} />
        ))}
        <Button type="submit" disabled={status === "loading"}>
          <Send size={16} />
          {t("common.submit")}
        </Button>
        {status === "success" ? <p className="text-sm font-semibold text-ocean-700">{t("common.success")}</p> : null}
        {status === "error" ? <p className="text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
      </form>
    </Card>
  );
}

function RequestFormsManager({ questionCount, language }: { questionCount: number; language: "en" | "es" }) {
  const [query, setQuery] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const forms = [
    {
      id: "digital-project-request",
      title: language === "es" ? "Solicitud de proyecto digital" : "Digital project request",
      description:
        language === "es"
          ? `${questionCount} preguntas activas para iniciar o actualizar un proyecto.`
          : `${questionCount} active questions for starting or updating a project.`,
      active: questionCount > 0
    },
    {
      id: "support-request",
      title: language === "es" ? "Solicitud de soporte" : "Support request",
      description: language === "es" ? "Abra un ticket para cambios, dudas o problemas." : "Open a ticket for changes, questions, or issues.",
      href: "/dashboard/support",
      active: true
    },
    {
      id: "subscription-request",
      title: language === "es" ? "Cambio de suscripcion" : "Subscription change",
      description: language === "es" ? "Solicite un cambio de plan para revision." : "Request a plan change for review.",
      href: "/dashboard/subscription/manage",
      active: true
    }
  ];
  const filteredForms = forms.filter((form) => {
    const matchesQuery = `${form.title} ${form.description}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!activeOnly || form.active);
  });

  return (
    <div className="mb-6 rounded-2xl border border-line bg-paper p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <Field label={language === "es" ? "Buscar formularios" : "Search forms"}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 text-slate" size={16} />
            <input className={`${inputClass} pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "es" ? "Proyecto, soporte o plan" : "Project, support, or plan"} />
          </div>
        </Field>
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-bold text-ink">
          <input type="checkbox" checked={activeOnly} onChange={(event) => setActiveOnly(event.target.checked)} />
          {language === "es" ? "Solo activos" : "Active only"}
        </label>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {filteredForms.map((form) => {
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <p className="font-black text-ink">{form.title}</p>
                <Badge value={form.active ? "active" : "archived"} language={language} />
              </div>
              <p className="mt-2 text-sm leading-6 text-slate">{form.description}</p>
            </>
          );

          return form.href ? (
            <a key={form.id} href={appHref(form.href)} className="rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:border-blue-600">
              {content}
            </a>
          ) : (
            <div key={form.id} className="rounded-2xl border border-blue-600 bg-white p-4 shadow-sm">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DynamicQuestion({ question, language }: { question: IntakeQuestion; language: "en" | "es" }) {
  const [hasWebsite, setHasWebsite] = useState(false);
  const label = language === "es" ? question.label_es : question.label_en;
  const help = language === "es" ? question.help_text_es : question.help_text_en;
  const commonProps = {
    name: question.id,
    required: question.required,
    className: inputClass
  };

  let control: React.ReactNode;
  if (question.id === "question-2") {
    control = (
      <div className="grid gap-3">
        <div className="grid gap-2">
          {question.options_json.map((option) => (
            <label key={option} className="flex items-center gap-2 rounded-md border border-line p-3 text-sm text-slate">
              <input type="checkbox" name={question.id} value={option} />
              {option}
            </label>
          ))}
        </div>
        <input name={`${question.id}_other`} className={inputClass} placeholder="Other service need" />
      </div>
    );
  } else if (question.id === "question-3") {
    control = (
      <div className="grid gap-3">
        <label className="flex items-center gap-2 rounded-md border border-line p-3 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            name={question.id}
            className="h-5 w-5 rounded border-line text-ocean-700"
            checked={hasWebsite}
            onChange={(event) => setHasWebsite(event.target.checked)}
          />
          {language === "es" ? "Si, ya tengo un sitio web" : "Yes, I already have a website"}
        </label>
        {hasWebsite ? (
          <input
            name={`${question.id}_url`}
            type="text"
            inputMode="url"
            className={inputClass}
            placeholder="example.com or https://example.com"
            required
          />
        ) : null}
      </div>
    );
  } else if (question.question_type === "long_text") {
    control = <textarea {...commonProps} className={`${inputClass} min-h-28`} />;
  } else if (question.question_type === "single_select") {
    control = (
      <select {...commonProps}>
        <option value="">Select</option>
        {question.options_json.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  } else if (question.question_type === "multi_select") {
    control = (
      <div className="grid gap-2">
        {question.options_json.map((option) => (
          <label key={option} className="flex items-center gap-2 rounded-md border border-line p-3 text-sm text-slate">
            <input type="checkbox" name={question.id} value={option} />
            {option}
          </label>
        ))}
      </div>
    );
  } else if (question.question_type === "checkbox") {
    control = <input type="checkbox" name={question.id} className="h-5 w-5 rounded border-line text-ocean-700" />;
  } else {
    const typeMap = {
      short_text: "text",
      email: "email",
      phone: "tel",
      url: "url",
      date: "date"
    } as const;
    control = <input {...commonProps} type={typeMap[question.question_type as keyof typeof typeMap] ?? "text"} />;
  }

  return <Field label={`${label}${question.required ? " *" : ""}`} help={help}>{control}</Field>;
}

const supportCategories = [
  "Website update",
  "Google Business Profile",
  "Social media",
  "Billing or subscription",
  "Project question",
  "Technical issue",
  "Other"
];

export function SupportForm({ workItems = [] }: { workItems?: WorkItem[] }) {
  const { language, t } = useLanguage();
  const initialSupportItems = workItems.filter((item) => item.source_type === "support_request" || item.source_type === "subscription_request");
  const [items, setItems] = useState(initialSupportItems);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedId, setSelectedId] = useState(initialSupportItems[0]?.id ?? "");
  const [editTitle, setEditTitle] = useState(initialSupportItems[0]?.title ?? "");
  const [editNote, setEditNote] = useState("");
  const [editStatus, setEditStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0] ?? null;
  const statusOptions = Array.from(new Set(items.map((item) => item.status)));
  const visibleItems = items.filter((item) => {
    const isHistory = item.status === "complete" || item.status === "archived";
    const matchesQuery = `${item.title} ${item.source_type}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (showHistory || !isHistory) && (statusFilter === "all" || item.status === statusFilter);
  });

  useEffect(() => {
    const item = items.find((supportItem) => supportItem.id === selectedId) ?? items[0];
    if (!item) return;
    setSelectedId(item.id);
    setEditTitle(item.title);
  }, [items, selectedId]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const now = new Date().toISOString();
    const payload = Object.fromEntries(formData.entries());
    const optimisticWorkItem: WorkItem = {
      id: `support-static-${Date.now()}`,
      customer_id: "",
      project_id: null,
      intake_submission_id: null,
      title: `${payload.category}: ${payload.title}`,
      source_type: "support_request",
      status: "new",
      priority: "normal",
      assigned_to: null,
      archived: false,
      created_at: now,
      updated_at: now
    };
    const response = await appFetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }, { workItem: optimisticWorkItem });
    if (response.ok) {
      const result = (await response.json()) as { workItem?: WorkItem };
      const savedItem = result.workItem ?? optimisticWorkItem;
      setItems((current) => [savedItem, ...current]);
      setSelectedId(savedItem.id);
      setStatus("success");
      event.currentTarget.reset();
    } else {
      setStatus("error");
    }
  };

  const saveSelected = async () => {
    if (!selectedItem) return;
    setEditStatus("loading");
    const updatedItem = { ...selectedItem, title: editTitle, updated_at: new Date().toISOString() };
    const response = await appFetch(`/api/support/${selectedItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, note: editNote })
    }, { workItem: updatedItem });

    if (response.ok) {
      const result = (await response.json()) as { workItem?: WorkItem };
      const savedItem = result.workItem ?? updatedItem;
      setItems((current) => current.map((item) => (item.id === savedItem.id ? savedItem : item)));
      setSelectedId(savedItem.id);
      setEditNote("");
      setEditStatus("success");
    } else {
      setEditStatus("error");
    }
  };

  return (
    <div className="grid gap-5">
      <Card>
        <SectionHeader title={t("dashboard.support")} />
        <form className="grid gap-4" onSubmit={submit}>
          <Field label="Category">
            <select name="category" className={inputClass} required>
              {supportCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Title">
            <input name="title" className={inputClass} required />
          </Field>
          <Field label="Details">
            <textarea name="note" className={`${inputClass} min-h-32`} required />
          </Field>
          <Button type="submit">{t("dashboard.requestSupport")}</Button>
          {status === "success" ? <p className="text-sm font-semibold text-ocean-700">{t("common.success")}</p> : null}
          {status === "error" ? <p className="text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
        </form>
      </Card>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
      <Card>
        <SectionHeader title={t("dashboard.supportRequests")} description={language === "es" ? "Busque, filtre y revise solicitudes abiertas. El historial se muestra solo cuando esta activado." : "Search, filter, and review open requests. Completed history is shown only when enabled."} />
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <Field label="Search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 text-slate" size={16} />
              <input className={`${inputClass} pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title or source" />
            </div>
          </Field>
          <Field label="Status">
            <select className={inputClass} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {t(`status.${option}`)}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-bold text-ink">
            <input type="checkbox" checked={showHistory} onChange={(event) => setShowHistory(event.target.checked)} />
            <History size={16} />
            History
          </label>
        </div>
        <div className="grid gap-3">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition sm:flex-row sm:items-center sm:justify-between ${
                selectedId === item.id ? "border-blue-600 bg-blue-50" : "border-line bg-white hover:border-blue-600"
              }`}
              onClick={() => setSelectedId(item.id)}
            >
              <div>
                <p className="font-bold text-ink">{item.title}</p>
                <p className="text-sm text-slate">Updated {new Date(item.updated_at).toLocaleDateString()}</p>
              </div>
              <Badge value={item.status} language={language} />
            </button>
          ))}
          {!visibleItems.length ? <p className="text-sm text-slate">No support requests match the current filters.</p> : null}
        </div>
      </Card>
      <Card>
        {selectedItem ? (
          <div className="grid gap-4">
            <SectionHeader title={selectedItem.title} description={language === "es" ? "Abra y edite la solicitud antes de que el equipo la marque completa." : "Open and edit the request before the team marks it complete."} />
            <div className="grid gap-3 rounded-2xl bg-paper p-4 text-sm text-slate">
              <div className="flex items-center justify-between gap-3">
                <span>{selectedItem.source_type.replaceAll("_", " ")}</span>
                <Badge value={selectedItem.status} language={language} />
              </div>
              <p>Created {new Date(selectedItem.created_at).toLocaleDateString()}</p>
            </div>
            <Field label="Request title">
              <input className={inputClass} value={editTitle} onChange={(event) => setEditTitle(event.target.value)} disabled={selectedItem.status === "complete" || selectedItem.status === "archived"} />
            </Field>
            <Field label="Add update note">
              <textarea className={`${inputClass} min-h-28`} value={editNote} onChange={(event) => setEditNote(event.target.value)} disabled={selectedItem.status === "complete" || selectedItem.status === "archived"} />
            </Field>
            <Button type="button" variant="dashboard" onClick={saveSelected} disabled={editStatus === "loading" || selectedItem.status === "complete" || selectedItem.status === "archived"}>
              <Edit3 size={16} />
              {t("common.save")}
            </Button>
            {editStatus === "success" ? <p className="text-sm font-semibold text-ocean-700">{t("common.success")}</p> : null}
            {editStatus === "error" ? <p className="text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
          </div>
        ) : (
          <p className="text-sm text-slate">Select a request to review.</p>
        )}
      </Card>
      </div>
    </div>
  );
}

export function ProfileForm({ profile, projects = [] }: { profile: Profile; projects?: Project[] }) {
  const { language, t } = useLanguage();
  const [displayProfile, setDisplayProfile] = useState(profile);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const activeProjects = projects.filter((project) => project.status !== "completed" && project.status !== "archived");

  useEffect(() => {
    setDisplayProfile(getStaticProfile() ?? profile);
  }, [profile]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const response = await appFetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    setStatus(response.ok ? "success" : "error");
  };

  return (
    <div className="grid gap-5">
      <Card>
        <SectionHeader title={t("dashboard.profile")} />
        <form key={displayProfile.id} className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Field label={t("auth.fullName")}>
            <input name="full_name" defaultValue={displayProfile.full_name} className={inputClass} required />
          </Field>
          <Field label={t("auth.phone")}>
            <input name="phone" defaultValue={displayProfile.phone} className={inputClass} required />
          </Field>
          <Field label={t("auth.businessName")}>
            <input name="business_name" defaultValue={displayProfile.business_name} className={inputClass} required />
          </Field>
          <Field label={t("auth.preferredLanguage")}>
            <select name="preferred_language" defaultValue={displayProfile.preferred_language || language} className={inputClass}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Button type="submit">{t("dashboard.updateProfile")}</Button>
            {status === "success" ? <p className="mt-3 text-sm font-semibold text-ocean-700">{t("common.success")}</p> : null}
            {status === "error" ? <p className="mt-3 text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
          </div>
        </form>
      </Card>
      <Card>
        <SectionHeader title={t("dashboard.activeProjects")} description="Quick links to active project dashboards." />
        <div className="grid gap-3">
          {activeProjects.map((project) => (
            <a key={project.id} href={appHref(`/dashboard/projects/${project.id}`)} className="flex flex-col gap-2 rounded-md border border-line p-4 transition hover:border-blue-600 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-ink">{project.name}</p>
                <p className="text-sm text-slate">{project.service_type}</p>
              </div>
              <Badge value={project.status} language={language} />
            </a>
          ))}
          {!activeProjects.length ? <p className="text-sm text-slate">No active projects yet.</p> : null}
        </div>
      </Card>
      <Card>
        <SectionHeader title={t("dashboard.reportsDocuments")} description="Reporting downloads will be connected when the reporting module is added." />
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-line p-4">
            <div className="mb-3 flex items-center gap-2 text-ink">
              <FileText size={18} />
              <p className="font-bold">Sample monthly report</p>
            </div>
            <p className="text-sm text-slate">Example document slot for future analytics and project reporting.</p>
            <Button type="button" variant="secondary" className="mt-4" disabled>
              <Download size={16} />
              Download pending
            </Button>
          </div>
          <div className="rounded-md bg-paper p-4">
            <p className="font-bold text-ink">Reporting reminder</p>
            <p className="mt-2 text-sm leading-6 text-slate">Review document downloads when the reporting feature is added.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
