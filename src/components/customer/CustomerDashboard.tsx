"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/FormFields";
import type { ActivityItem, IntakeQuestion, Profile, Project, Subscription, WorkItem } from "@/lib/types";

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
  const activeProjects = projects.filter((project) => project.status !== "completed" && project.status !== "archived");
  const pendingWorkItems = workItems.filter((item) => item.status !== "complete" && item.status !== "archived");

  return (
    <div className="grid gap-5">
      <SectionHeader title={`${t("dashboard.welcome")}, ${profile.full_name}`} description={profile.business_name} />
      <div className="grid gap-4 md:grid-cols-3">
        <Metric title={t("dashboard.currentPlan")} value={subscription?.plan_name ?? "Starter"} badge={subscription?.status} language={language} />
        <Metric title={t("dashboard.activeProjects")} value={activeProjects.length.toString()} />
        <Metric title={t("dashboard.pendingForms")} value={pendingWorkItems.length.toString()} />
      </div>
      <Card>
        <h2 className="mb-3 text-lg font-bold text-ink">{t("dashboard.recentUpdates")}</h2>
        <div className="grid gap-3">
          {activity.slice(0, 5).map((item) => (
            <div key={item.id} className="rounded-md bg-paper p-3 text-sm text-slate">
              {language === "es" ? item.message_es : item.message_en}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ title, value, badge, language = "en" }: { title: string; value: string; badge?: string; language?: "en" | "es" }) {
  return (
    <Card>
      <p className="text-sm font-semibold text-slate">{title}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-3xl font-bold text-ink">{value}</p>
        {badge ? <Badge value={badge} language={language} /> : null}
      </div>
    </Card>
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
          <Button type="button" variant="secondary">
            Upgrade/change plan
          </Button>
        </div>
      ) : (
        <p className="text-slate">No subscription record found.</p>
      )}
    </Card>
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
                  <Button type="button" variant="secondary">
                    {t("common.viewDetails")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function IntakeForm({ questions }: { questions: IntakeQuestion[] }) {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const answers: Record<string, string | string[] | boolean> = {};

    questions.forEach((question) => {
      if (question.question_type === "multi_select") {
        answers[question.id] = formData.getAll(question.id).map(String);
      } else if (question.question_type === "checkbox") {
        answers[question.id] = formData.get(question.id) === "on";
      } else {
        answers[question.id] = String(formData.get(question.id) ?? "");
      }
    });

    const response = await fetch("/api/intake/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });

    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  };

  return (
    <Card>
      <SectionHeader title={t("dashboard.intake")} description="Questions are loaded from the stored intake configuration." />
      <form className="grid gap-5" onSubmit={submit}>
        {questions.map((question) => (
          <DynamicQuestion key={question.id} question={question} language={language} />
        ))}
        <Button type="submit" disabled={status === "loading"}>
          <Send size={16} />
          {t("common.submit")}
        </Button>
        {status === "success" ? <p className="text-sm font-semibold text-teal">{t("common.success")}</p> : null}
        {status === "error" ? <p className="text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
      </form>
    </Card>
  );
}

function DynamicQuestion({ question, language }: { question: IntakeQuestion; language: "en" | "es" }) {
  const label = language === "es" ? question.label_es : question.label_en;
  const help = language === "es" ? question.help_text_es : question.help_text_en;
  const commonProps = {
    name: question.id,
    required: question.required,
    className: inputClass
  };

  let control: React.ReactNode;
  if (question.question_type === "long_text") {
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
    control = <input type="checkbox" name={question.id} className="h-5 w-5 rounded border-line text-teal" />;
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

export function SupportForm() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    setStatus(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  };

  return (
    <Card>
      <SectionHeader title={t("dashboard.support")} />
      <form className="grid gap-4" onSubmit={submit}>
        <Field label="Title">
          <input name="title" className={inputClass} required />
        </Field>
        <Field label="Details">
          <textarea name="note" className={`${inputClass} min-h-32`} required />
        </Field>
        <Button type="submit">{t("dashboard.requestSupport")}</Button>
        {status === "success" ? <p className="text-sm font-semibold text-teal">{t("common.success")}</p> : null}
        {status === "error" ? <p className="text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
      </form>
    </Card>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    setStatus(response.ok ? "success" : "error");
  };

  return (
    <Card>
      <SectionHeader title={t("dashboard.profile")} />
      <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <Field label={t("auth.fullName")}>
          <input name="full_name" defaultValue={profile.full_name} className={inputClass} required />
        </Field>
        <Field label={t("auth.phone")}>
          <input name="phone" defaultValue={profile.phone} className={inputClass} required />
        </Field>
        <Field label={t("auth.businessName")}>
          <input name="business_name" defaultValue={profile.business_name} className={inputClass} required />
        </Field>
        <Field label={t("auth.preferredLanguage")}>
          <select name="preferred_language" defaultValue={profile.preferred_language || language} className={inputClass}>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </Field>
        <div className="md:col-span-2">
          <Button type="submit">{t("dashboard.updateProfile")}</Button>
          {status === "success" ? <p className="mt-3 text-sm font-semibold text-teal">{t("common.success")}</p> : null}
          {status === "error" ? <p className="mt-3 text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
        </div>
      </form>
    </Card>
  );
}
