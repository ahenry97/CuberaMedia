"use client";

import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Globe,
  MapPin,
  Megaphone,
  MessageSquare,
  MonitorSmartphone,
  Rocket,
  Send,
  Workflow,
  Wrench
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Badge } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/FormFields";
import { appFetch } from "@/lib/staticApi";
import type { Plan } from "@/lib/types";

const serviceCards = [
  { key: "website", description: "websiteText", icon: MonitorSmartphone },
  { key: "google", description: "googleText", icon: MapPin },
  { key: "social", description: "socialText", icon: Megaphone },
  { key: "strategy", description: "strategyText", icon: BarChart3 },
  { key: "maintenance", description: "maintenanceText", icon: Wrench },
  { key: "profile", description: "profileText", icon: Globe }
] as const;

const trustedBusinesses = ["Sunset Deck Builder", "Coastal Cleaning Co.", "Marina Chiropractic", "Prime Automotive", "Bluewater Plumbing"];

export function HomePage() {
  const { language, t, tArray } = useLanguage();
  const process = tArray("public.process");
  const processDescriptions = tArray("public.processDescriptions");

  return (
    <main>
      <section className="ocean-texture wave-lines overflow-hidden text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
          <div className="self-center">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-coral">{t("public.heroEyebrow")}</p>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.04] md:text-6xl">{t("public.heroTitle")}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">{t("public.heroText")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register">
                {t("public.primaryCta")}
                <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/#process" variant="dark">
                <Rocket size={18} />
                {t("public.secondaryCta")}
              </ButtonLink>
            </div>
          </div>

          <DashboardPreview language={language} />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-coral">{t("public.servicesEyebrow")}</p>
            <h2 className="mt-2 text-2xl font-black text-ink md:text-3xl">{t("public.servicesTitle")}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {serviceCards.slice(0, 4).map((service, index) => (
              <ServiceCard key={service.key} service={service} tone={index % 2 === 0 ? "blue" : "coral"} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-black uppercase tracking-[0.28em] text-slate">{t("public.trustedBy")}</p>
          <div className="mt-6 grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-5">
            {trustedBusinesses.map((business) => (
              <div key={business} className="rounded-xl border border-line bg-white px-4 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate shadow-sm">
                {business}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-coral">{language === "es" ? "Nuestro proceso" : "Our process"}</p>
            <h2 className="mt-2 text-2xl font-black text-ink md:text-3xl">{t("public.processTitle")}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {process.map((step, index) => (
              <div key={step} className="relative rounded-2xl border border-line bg-white p-5 shadow-sm">
                <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-paper text-blue-700 ring-1 ring-line">
                  {[MessageSquare, FileText, Rocket, BarChart3].map((Icon, iconIndex) => (iconIndex === index ? <Icon key={step} size={24} /> : null))}
                </div>
                <p className="text-sm font-black text-ink">
                  {index + 1}. {step}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate">{processDescriptions[index]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}

function DashboardPreview({ language }: { language: "en" | "es" }) {
  const copy = {
    en: {
      dashboard: "Dashboard",
      morning: "Good morning, Alex",
      status: "Project Status",
      statusText: "Your project is moving forward. We are building momentum.",
      nextMilestone: "Next Milestone",
      launch: "Site Launch",
      nav: ["Overview", "Website", "Google Profile", "Social Media", "Tasks", "Reports"],
      items: [
        ["Website Build", "60%", "in_progress"],
        ["Google Business Profile", "Complete", "active"],
        ["Social Media", "40%", "planning"]
      ]
    },
    es: {
      dashboard: "Panel",
      morning: "Buenos dias, Alex",
      status: "Estado del proyecto",
      statusText: "Su proyecto avanza. Estamos creando impulso.",
      nextMilestone: "Proximo hito",
      launch: "Lanzamiento",
      nav: ["Resumen", "Sitio web", "Perfil Google", "Redes", "Tareas", "Reportes"],
      items: [
        ["Sitio web", "60%", "in_progress"],
        ["Google Business Profile", "Completo", "active"],
        ["Redes sociales", "40%", "planning"]
      ]
    }
  }[language];
  const previewItems = [
    ...copy.items
  ];

  return (
    <div className="relative self-center">
      <div className="rounded-[1.6rem] border border-white/18 bg-white p-2 shadow-premium">
        <div className="grid overflow-hidden rounded-[1.25rem] border border-line bg-white text-ink md:grid-cols-[180px_1fr]">
          <aside className="hidden bg-navy-950 p-5 text-white md:block">
            <div className="mb-7 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-xs font-black text-blue-700">C</span>
              <div className="leading-none">
                <p className="text-xs font-black uppercase tracking-[0.24em]">Cubera</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.34em] text-coral">Media</p>
              </div>
            </div>
            {copy.nav.map((item, index) => (
              <div key={item} className={`mb-2 rounded-xl px-3 py-2 text-xs font-bold ${index === 0 ? "bg-blue-600 text-white" : "text-white/70"}`}>
                {item}
              </div>
            ))}
          </aside>
          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-black">{copy.dashboard}</p>
                <p className="text-sm font-semibold text-slate">{copy.morning}</p>
              </div>
              <span className="rounded-full bg-paper px-3 py-1 text-xs font-black text-slate">Sunset Deck Builder</span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-2xl border border-line p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-black">{copy.status}</p>
                  <Badge value="active" />
                </div>
                <p className="mt-2 text-sm text-slate">{copy.statusText}</p>
                <div className="mt-4 h-2 rounded-full bg-paper">
                  <div className="h-2 w-3/4 rounded-full bg-blue-600" />
                </div>
              </div>
              <div className="rounded-2xl border border-line p-4 shadow-sm">
                <Calendar className="text-blue-600" size={22} />
                <p className="mt-3 text-sm font-black">{copy.nextMilestone}</p>
                <p className="text-sm text-slate">{copy.launch}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {previewItems.map(([title, value, status]) => (
                <div key={title} className="rounded-2xl border border-line p-4 shadow-sm">
                  <p className="text-sm font-black">{title}</p>
                  <p className="mt-4 text-2xl font-black text-blue-600">{value}</p>
                  <Badge value={status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesPage() {
  const { t } = useLanguage();

  return (
    <main>
      <PageHero eyebrow={t("public.servicesEyebrow")} title={t("nav.services")} description={t("public.servicesIntro")} />
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {serviceCards.map((service, index) => (
            <ServiceCard key={service.key} service={service} tone={index % 2 === 0 ? "blue" : "coral"} />
          ))}
        </div>
      </section>
      <CTASection />
    </main>
  );
}

function ServiceCard({
  service,
  tone = "blue",
  compact = false
}: {
  service: (typeof serviceCards)[number];
  tone?: "blue" | "coral";
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const Icon = service.icon;

  return (
    <Card className="group h-full transition hover:-translate-y-1 hover:shadow-premium">
      <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl text-white ${tone === "coral" ? "bg-coral" : "bg-blue-600"}`}>
        <Icon size={25} />
      </div>
      <h2 className="text-lg font-black leading-6 text-ink">{t(`services.${service.key}`)}</h2>
      <p className={`mt-3 text-sm leading-6 text-slate ${compact ? "min-h-20" : "min-h-24"}`}>{t(`services.${service.description}`)}</p>
      <ButtonLink href="/register" variant="secondary" className="mt-5 w-full">
        {t("common.learnMore")}
        <ArrowRight size={16} />
      </ButtonLink>
    </Card>
  );
}

export function AboutPage() {
  const { language, t } = useLanguage();
  const values =
    language === "es"
      ? [
          ["Enfoque local", "Estrategia practica para negocios de barrio y equipos de servicio."],
          ["Flujo claro", "Solicitudes, actualizaciones y proximos pasos se mantienen organizados."],
          ["Presencia profesional", "Sitios modernos y perfiles optimizados construidos alrededor de confianza."],
          ["Apoyo constante", "Mantenimiento y mercadeo para mantener el sistema avanzando."]
        ]
      : [
          ["Local-first", "Practical strategy for neighborhood businesses and service teams."],
          ["Clear workflow", "Client requests, project updates, and next steps stay organized."],
          ["Professional presence", "Modern websites and optimized profiles built around trust."],
          ["Steady support", "Maintenance and marketing help that keeps the system moving."]
        ];

  return (
    <main>
      <PageHero eyebrow={language === "es" ? "Sobre Cubera Media" : "About Cubera Media"} title={t("public.aboutTitle")} description={t("public.aboutText")} />
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Card>
            <SectionHeader
              eyebrow={language === "es" ? "Mision" : "Mission"}
              title={language === "es" ? "Creado para avanzar con claridad" : "Built for useful momentum"}
              description={
                language === "es"
                  ? "Ayudamos a equipos pequenos a convertir necesidades digitales dispersas en un plan claro y rastreable para sitios, perfiles, mercadeo y solicitudes."
                  : "We help small teams move from scattered digital needs to a clear, trackable plan for websites, profiles, marketing, and customer requests."
              }
            />
          </Card>
          <div className="grid gap-5 md:grid-cols-2">
            {values.map(([title, description]) => (
              <Card key={title}>
                <h2 className="text-lg font-black text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </main>
  );
}

export function PricingPage({ plans }: { plans: Plan[] }) {
  const { language, t } = useLanguage();
  const faqs =
    language === "es"
      ? [
          ["Puedo cambiar de plan?", "Si. Los planes son marcadores por ahora y se pueden ajustar segun crezca su negocio."],
          ["Se requiere aprobacion?", "Algunas solicitudes crean una tarea de revision para confirmar tiempo y alcance."],
          ["Puedo empezar pequeno?", "Si. Starter esta disenado para primeros pasos enfocados."]
        ]
      : [
          ["Can plans change?", "Yes. Plans are placeholders for now and can be adjusted as your business grows."],
          ["Is approval required?", "Some requests create a review item so the development team can confirm timing and scope."],
          ["Can I start small?", "Yes. The Starter plan is designed for focused first steps."]
        ];

  return (
    <main>
      <PageHero eyebrow="Plans" title={t("nav.pricing")} description={t("public.pricingIntro")} />
      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex justify-center">
            <div className="rounded-full border border-line bg-white p-1 text-sm font-black text-slate shadow-sm">
              <span className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-white">{language === "es" ? "Mensual" : "Monthly"}</span>
              <span className="inline-flex px-4 py-2">{language === "es" ? "Anual" : "Yearly"}</span>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const recommended = plan.name.toLowerCase() === "growth";
              return (
                <Card key={plan.id} className={`relative h-full ${recommended ? "border-blue-600 ring-4 ring-blue-600/10" : ""}`}>
                  {recommended ? <span className="absolute right-5 top-5 rounded-full bg-coral px-3 py-1 text-xs font-black text-white">{language === "es" ? "Recomendado" : "Recommended"}</span> : null}
                  <h2 className="text-xl font-black text-ink">{plan.name}</h2>
                  <p className="mt-3 text-4xl font-black text-blue-600">{plan.monthly_price}</p>
                  <p className="mt-3 min-h-16 text-sm leading-6 text-slate">{language === "es" ? plan.description_es : plan.description_en}</p>
                  <ul className="mt-6 grid gap-3 text-sm text-slate">
                    {(language === "es" ? plan.features_es : plan.features_en).map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-ocean-600" size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="/register" variant={recommended ? "primary" : "secondary"} className="mt-7 w-full">
                    {t("nav.getStarted")}
                  </ButtonLink>
                </Card>
              );
            })}
          </div>
          <div id="faq" className="mt-10 grid gap-5 md:grid-cols-3">
            {faqs.map(([title, description]) => (
              <Card key={title}>
                <h2 className="font-black text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
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
    <main>
      <PageHero eyebrow="Contact" title={t("nav.contact")} description={t("public.contactIntro")} />
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.75fr] lg:px-8">
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
                  <textarea name="message" className={`${inputClass} min-h-36`} required />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={status === "loading"}>
                  <Send size={16} />
                  {t("contact.submit")}
                </Button>
                {status === "success" ? <p className="mt-3 text-sm font-bold text-ocean-700">{t("contact.sent")}</p> : null}
                {status === "error" ? <p className="mt-3 text-sm font-bold text-red-600">{t("common.error")}</p> : null}
              </div>
            </form>
          </Card>
          <Card className="bg-navy-950 text-white">
            <div className="mb-7 max-w-3xl">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-coral">{language === "es" ? "Hablemos" : "Let's talk"}</p>
              <h2 className="text-3xl font-black leading-tight text-white">{language === "es" ? "Un proximo paso digital mas claro empieza aqui." : "A clearer digital next step starts here."}</h2>
              <p className="mt-3 text-base leading-7 text-white/70">
                {language === "es"
                  ? "Comparta lo que desea mejorar y lo convertiremos en una solicitud, proyecto o plan practico."
                  : "Share what you want to improve and we will help turn it into a practical request, project, or plan."}
              </p>
            </div>
            <div className="grid gap-3 text-sm text-white/75">
              <p className="flex gap-2"><MessageSquare size={17} /> {language === "es" ? "Los mensajes llegan al panel de desarrollo." : "Contact messages are routed to the developer dashboard."}</p>
              <p className="flex gap-2"><Workflow size={17} /> {language === "es" ? "Las solicitudes pueden convertirse en tareas rastreables." : "Requests can become tracked work items."}</p>
              <p className="flex gap-2"><CheckCircle2 size={17} /> {language === "es" ? "El idioma preferido se respeta desde la primera conversacion." : "Preferred language is honored from the first conversation."}</p>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="ocean-texture wave-lines text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-coral">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">{description}</p>
      </div>
    </section>
  );
}

function CTASection() {
  const { language, t } = useLanguage();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[1.5rem] bg-navy-950 px-6 py-10 text-white shadow-premium md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-coral">{language === "es" ? "Hablemos" : "Let's talk"}</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight">{t("public.finalCtaTitle")}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">{t("public.finalCtaText")}</p>
            </div>
            <ButtonLink href="/register">
              {t("nav.getStarted")}
              <ArrowRight size={17} />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlaceholderProviderNotice() {
  const { t } = useLanguage();
  return (
    <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800">
      <ExternalLink className="mt-0.5 shrink-0" size={16} />
      {t("auth.oauthNotice")}
    </p>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-6 text-center">
      <ClipboardCheck className="mx-auto mb-3 text-blue-600" size={28} />
      <h2 className="text-base font-black text-ink">{title}</h2>
      <p className="mt-2 text-sm text-slate">{description}</p>
    </div>
  );
}
