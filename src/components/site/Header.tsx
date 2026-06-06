"use client";

import { useEffect, useState } from "react";
import { Globe, LogOut, Menu, UserCircle } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useLanguage } from "@/components/LanguageProvider";
import type { Profile } from "@/lib/types";

const publicLinks = [
  { href: "/", label: "nav.home" },
  { href: "/services", label: "nav.services" },
  { href: "/pricing", label: "nav.pricing" },
  { href: "/about", label: "nav.about" },
  { href: "/contact", label: "nav.contact" }
];

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => setProfile(payload?.profile ?? null))
      .catch(() => setProfile(null));
  }, []);

  const dashboardHref = profile?.role === "developer" ? "/developer" : "/dashboard";

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-ink text-sm font-bold text-white">CD</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-ink">{t("brand")}</span>
            <span className="hidden truncate text-xs text-slate sm:block">{t("tagline")}</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {publicLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-slate hover:bg-paper hover:text-ink">
              {t(link.label)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-3 text-sm font-semibold text-ink hover:border-teal"
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            aria-label="Toggle language"
          >
            <Globe size={16} />
            {language.toUpperCase()}
          </button>
          {profile ? (
            <>
              <ButtonLink href={dashboardHref} variant="secondary">
                <UserCircle size={16} />
                {t("nav.dashboard")}
              </ButtonLink>
              <Button type="button" variant="ghost" onClick={logout}>
                <LogOut size={16} />
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="secondary">
                {t("nav.login")}
              </ButtonLink>
              <ButtonLink href="/register">{t("nav.getStarted")}</ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink lg:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-line bg-white px-4 py-3 lg:hidden">
          <nav className="grid gap-1">
            {publicLinks.map((link) => (
              <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-slate hover:bg-paper">
                {t(link.label)}
              </a>
            ))}
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold text-ink hover:bg-paper"
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
            >
              <Globe size={16} />
              {language === "en" ? "Español" : "English"}
            </button>
            {profile ? (
              <>
                <a href={dashboardHref} className="rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-paper">
                  {t("nav.dashboard")}
                </a>
                <button type="button" className="rounded-md px-3 py-2 text-left text-sm font-semibold text-ink hover:bg-paper" onClick={logout}>
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="rounded-md px-3 py-2 text-sm font-semibold text-ink hover:bg-paper">
                  {t("nav.login")}
                </a>
                <a href="/register" className="rounded-md bg-teal px-3 py-2 text-sm font-semibold text-white">
                  {t("nav.getStarted")}
                </a>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
