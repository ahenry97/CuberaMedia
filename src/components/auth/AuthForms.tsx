"use client";

import { Apple, LogIn, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { PlaceholderProviderNotice } from "@/components/public/PublicPages";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/FormFields";

export function LoginForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const notice = searchParams.get("notice");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    if (!response.ok) {
      setError(t("common.error"));
      return;
    }

    const payload = (await response.json()) as { redirectTo: string };
    window.location.href = payload.redirectTo;
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title={t("auth.loginTitle")} />
      <Card>
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
          <ButtonLink href="/api/auth/oauth/google" variant="secondary">
            <Mail size={16} />
            {t("auth.google")}
          </ButtonLink>
          <ButtonLink href="/api/auth/oauth/apple" variant="secondary">
            <Apple size={16} />
            {t("auth.apple")}
          </ButtonLink>
        </div>

        <p className="mt-5 text-sm text-slate">
          {t("auth.noAccount")}{" "}
          <a href="/register" className="font-semibold text-teal">
            {t("nav.getStarted")}
          </a>
        </p>
      </Card>
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
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? t("common.error"));
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader title={t("auth.registerTitle")} />
      <Card>
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
          <a href="/login" className="font-semibold text-teal">
            {t("nav.login")}
          </a>
        </p>
      </Card>
    </main>
  );
}
