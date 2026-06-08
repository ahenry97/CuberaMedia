"use client";

import { ArrowRight, CheckCircle2, ClipboardCheck, ExternalLink, Send } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/FormFields";
import { appFetch } from "@/lib/staticApi";
import type { Plan } from "@/lib/types";

const serviceKeys = [
  ["website", "websiteText"],
  ["profile", "profileText"],
  ["google", "googleText"],
  ["social", "socialText"],
  ["maintenance", "maintenanceText"],
  ["strategy", "strategyText"]
];

export function HomePage() {
  const { t, tArray } = useLanguage();
  const process = tArray("public.process");
  const processDescriptions = tArray("public.processDescriptions");

  return (
    <main>
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
          <div className="self-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal">{t("tagline")}</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink md:text-5xl">{t("public.heroTitle")}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate">{t("public.heroText")}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register">
                {t("public.primaryCta")}
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary">
                {t("public.secondaryCta")}
              </ButtonLink>
            </div>
          </div>

          <div className="rounded-md border border-line bg-paper p-4 shadow-soft">
            <div className="rounded-md border border-line bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal">Client workspace</p>
                  <h2 className="text-lg font-bold text-ink">Rivera Cafe launch</h2>
                </div>
                <Badge value="in_progress" />
              </div>
              <div className="grid gap-3">
                {[
                  ["Website copy", "complete"],
                  ["Google profile", "planning"],
                  ["Intake review", "reviewing"],
                  ["Client approval", "pending"]
                ].map(([label, status]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-line p-3">
                    <span className="text-sm font-medium text-ink">{label}</span>
                    <Badge value={status} />
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {["Register", "Plan", "Launch"].map((item, index) => (
                  <div key={item} className="rounded-md bg-paper p-3 text-center">
                    <p className="text-xl font-bold text-teal">{index + 1}</p>
                    <p className="text-xs font-semibold text-slate">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal">Workflow</p>
              <h2 className="text-2xl font-bold leading-tight text-ink md:text-3xl">{t("public.processTitle")}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate">{t("public.servicesIntro")}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {process.map((step, index) => (
              <div key={step} className="rounded-md border border-line bg-white p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md bg-teal text-sm font-bold text-white">{index + 1}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate">Step</span>
                </div>
                <h3 className="text-base font-bold leading-6 text-ink">{step}</h3>
                <p className="mt-2 text-sm leading-6 text-slate">{processDescriptions[index]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function ServicesPage() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title={t("nav.services")} description={t("public.servicesIntro")} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {serviceKeys.map(([title, description]) => (
          <Card key={title}>
            <CheckCircle2 className="mb-4 text-teal" size={24} />
            <h2 className="text-lg font-bold text-ink">{t(`services.${title}`)}</h2>
            <p className="mt-2 min-h-20 text-sm leading-6 text-slate">{t(`services.${description}`)}</p>
            <ButtonLink href="/register" variant="secondary" className="mt-4 w-full">
              {t("nav.getStarted")}
            </ButtonLink>
          </Card>
        ))}
      </div>
    </main>
  );
}

export function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title={t("public.aboutTitle")} description={t("public.aboutText")} />
      <div className="grid gap-4 md:grid-cols-3">
        {["services.website", "services.google", "services.strategy"].map((key) => (
          <Card key={key} className="shadow-none">
            <h2 className="text-base font-bold text-ink">{t(key)}</h2>
          </Card>
        ))}
      </div>
    </main>
  );
}

export function PricingPage({ plans }: { plans: Plan[] }) {
  const { language, t } = useLanguage();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title={t("nav.pricing")} description={t("public.pricingIntro")} />
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <h2 className="text-xl font-bold text-ink">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold text-teal">{plan.monthly_price}</p>
            <p className="mt-3 min-h-16 text-sm leading-6 text-slate">{language === "es" ? plan.description_es : plan.description_en}</p>
            <ul className="mt-5 grid gap-2 text-sm text-slate">
              {(language === "es" ? plan.features_es : plan.features_en).map((feature) => (
                <li key={feature} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-teal" size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/register" className="mt-6 w-full">
              {t("nav.getStarted")}
            </ButtonLink>
          </Card>
        ))}
      </div>
    </main>
  );
}

export function ContactPage() {
  const { language, t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    const formData = new FormData(event.currentTarget);
    const response = await appFetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    setStatus(response.ok ? "success" : "error");
    if (response.ok) {
      event.currentTarget.reset();
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title={t("nav.contact")} description={t("public.contactIntro")} />
      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Field label={t("contact.name")}>
            <input name="name" className={inputClass} required />
          </Field>
          <Field label={t("contact.email")}>
            <input name="email" type="email" className={inputClass} required />
          </Field>
          <Field label={t("contact.phone")}>
            <input name="phone" className={inputClass} required />
          </Field>
          <Field label={t("contact.businessName")}>
            <input name="business_name" className={inputClass} required />
          </Field>
          <Field label={t("contact.preferredLanguage")}>
            <select name="preferred_language" className={inputClass} defaultValue={language}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label={t("contact.message")}>
              <textarea name="message" className={`${inputClass} min-h-32`} required />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={status === "loading"}>
              <Send size={16} />
              {t("contact.submit")}
            </Button>
            {status === "success" ? <p className="mt-3 text-sm font-semibold text-teal">{t("contact.sent")}</p> : null}
            {status === "error" ? <p className="mt-3 text-sm font-semibold text-red-600">{t("common.error")}</p> : null}
          </div>
        </form>
      </Card>
    </main>
  );
}

export function PlaceholderProviderNotice() {
  const { t } = useLanguage();
  return (
    <p className="mt-4 flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-800">
      <ExternalLink className="mt-0.5 shrink-0" size={16} />
      {t("auth.oauthNotice")}
    </p>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-md border border-dashed border-line bg-white p-6 text-center">
      <ClipboardCheck className="mx-auto mb-3 text-teal" size={28} />
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-slate">{description}</p>
    </div>
  );
}
