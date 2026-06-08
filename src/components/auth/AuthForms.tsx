"use client";

import { Apple, LogIn, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { PlaceholderProviderNotice } from "@/components/public/PublicPages";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/FormFields";
import { Logo } from "@/components/site/Logo";
import { appFetch } from "@/lib/staticApi";
import { loginStaticAccount, registerStaticAccount, staticDashboardHref } from "@/lib/staticAuth";
import { appHref, isStaticExport } from "@/lib/paths";

export function LoginForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const notice = searchParams.get("notice");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);

    if (isStaticExport) {
      const result = loginStaticAccount(formData);
      if (!result.ok || !result.profile) {
        setError(result.error ?? t("common.error"));
        return;
      }

      window.location.href = staticDashboardHref(result.profile.role);
      return;
    }

    const response = await appFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    if (!response.ok) {
      setError(t("common.error"));
      return;
    }

    const payload = (await response.json()) as { redirectTo: string };
    window.location.href = appHref(payload.redirectTo);
  };

  return (
    <main className="ocean-texture wave-lines min-h-[calc(100vh-76px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
      <div className="mb-7 flex justify-center">
        <Logo inverse />
      </div>
      <Card className="shadow-premium">
        <div className="mb-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-coral">{t("nav.clientPortal")}</p>
          <h1 className="mt-2 text-3xl font-black text-ink">{t("auth.loginTitle")}</h1>
        </div>
        {notice ? <PlaceholderProviderNotice /> : null}
        <form className="mt-4 grid gap-4" onSubmit={submit}>
          <Field label={t("auth.email")}>
            <input name="email" type="email" className={inputClass} required />
          </Field>
          <Field label={t("auth.password")}>
            <input name="password" type="password" className={inputClass} required />
          </Field>
          <Button type="submit" className="w-full">
            <LogIn size={16} />
            {t("auth.loginButton")}
          </Button>
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
        </form>

        <div className="mt-5 grid gap-2">
          {isStaticExport ? (
            <>
              <Button type="button" variant="secondary" onClick={() => setError("Google login requires a server-capable host. Use email/password for this GitHub Pages demo.")}>
                <Mail size={16} />
                {t("auth.google")}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setError("Apple login requires a server-capable host. Use email/password for this GitHub Pages demo.")}>
                <Apple size={16} />
                {t("auth.apple")}
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href="/api/auth/oauth/google" variant="secondary">
                <Mail size={16} />
                {t("auth.google")}
              </ButtonLink>
              <ButtonLink href="/api/auth/oauth/apple" variant="secondary">
                <Apple size={16} />
                {t("auth.apple")}
              </ButtonLink>
            </>
          )}
        </div>

        <p className="mt-5 text-sm text-slate">
          {t("auth.noAccount")}{" "}
          <a href={appHref("/register")} className="font-semibold text-ocean-700">
            {t("nav.getStarted")}
          </a>
        </p>
      </Card>
      </div>
    </main>
  );
}

export function RegisterForm() {
  const { language, t } = useLanguage();
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);

    if (isStaticExport) {
      const result = registerStaticAccount(formData);
      if (!result.ok || !result.profile) {
        setError(result.error ?? t("common.error"));
        return;
      }

      window.location.href = staticDashboardHref(result.profile.role);
      return;
    }

    const response = await appFetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? t("common.error"));
      return;
    }

    window.location.href = appHref("/dashboard");
  };

  return (
    <main className="ocean-texture wave-lines min-h-[calc(100vh-76px)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
      <div className="mb-7 flex justify-center">
        <Logo inverse />
      </div>
      <Card className="shadow-premium">
        <div className="mb-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-coral">{t("nav.getStarted")}</p>
          <h1 className="mt-2 text-3xl font-black text-ink">{t("auth.registerTitle")}</h1>
        </div>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Field label={t("auth.fullName")}>
            <input name="full_name" className={inputClass} required />
          </Field>
          <Field label={t("auth.email")}>
            <input name="email" type="email" className={inputClass} required />
          </Field>
          <Field label={t("auth.password")}>
            <input name="password" type="password" className={inputClass} minLength={8} required />
          </Field>
          <Field label={t("auth.businessName")}>
            <input name="business_name" className={inputClass} required />
          </Field>
          <Field label={t("auth.phone")}>
            <input name="phone" className={inputClass} required />
          </Field>
          <Field label={t("auth.preferredLanguage")}>
            <select name="preferred_language" className={inputClass} defaultValue={language}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </Field>
          <div className="md:col-span-2">
            <Button type="submit" className="w-full">
              {t("auth.registerButton")}
            </Button>
            {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
          </div>
        </form>

        <p className="mt-5 text-sm text-slate">
          {t("auth.hasAccount")}{" "}
          <a href={appHref("/login")} className="font-semibold text-ocean-700">
            {t("nav.login")}
          </a>
        </p>
      </Card>
      </div>
    </main>
  );
}
