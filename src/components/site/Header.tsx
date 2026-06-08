"use client";

import { useEffect, useState } from "react";
import { Globe, LogOut, Menu, UserCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useLanguage } from "@/components/LanguageProvider";
import { appHref, appPathname, isStaticExport } from "@/lib/paths";
import { getStaticProfile, logoutStaticProfile } from "@/lib/staticAuth";
import type { Profile } from "@/lib/types";
import { Logo } from "@/components/site/Logo";

const publicLinks = [
  { href: "/services", label: "nav.services" },
  { href: "/#process", label: "nav.howItWorks" },
  { href: "/pricing", label: "nav.plans" },
  { href: "/contact", label: "nav.contact" }
];

const customerLinks = [
  { href: "/dashboard", label: "nav.dashboard" },
  { href: "/dashboard/projects", label: "dashboard.projects" },
  { href: "/dashboard/support", label: "dashboard.support" },
  { href: "/dashboard/profile", label: "nav.profile" }
];

const developerLinks = [
  { href: "/developer", label: "nav.dashboard" },
  { href: "/developer/work-items", label: "nav.workItems" },
  { href: "/developer/customers", label: "developer.customers" },
  { href: "/developer/intake-manager", label: "developer.intakeManager" }
];

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = appPathname(usePathname());
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileChecked, setProfileChecked] = useState(false);

  const isProtectedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/developer");
  const isDeveloperPath = pathname.startsWith("/developer");
  const darkHeader = pathname === "/" || isProtectedPath;

  useEffect(() => {
    if (isStaticExport) {
      const syncStaticProfile = () => {
        setProfile(getStaticProfile());
        setProfileChecked(true);
      };
      syncStaticProfile();
      window.addEventListener("cubera-static-auth-change", syncStaticProfile);
      window.addEventListener("storage", syncStaticProfile);
      return () => {
        window.removeEventListener("cubera-static-auth-change", syncStaticProfile);
        window.removeEventListener("storage", syncStaticProfile);
      };
    }

    fetch(appHref("/api/auth/me"))
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => setProfile(payload?.profile ?? null))
      .catch(() => setProfile(null))
      .finally(() => setProfileChecked(true));
  }, []);

  const assumedDashboardHref = isDeveloperPath ? "/developer" : "/dashboard";
  const dashboardHref = profile?.role === "developer" ? "/developer" : profile?.role === "customer" ? "/dashboard" : assumedDashboardHref;
  const protectedLinks = isDeveloperPath ? developerLinks : customerLinks;
  const navLinks = profile ? (profile.role === "developer" ? developerLinks : customerLinks) : isProtectedPath ? protectedLinks : publicLinks;
  const accountHref = profile?.role === "developer" ? "/developer/site-settings" : "/dashboard/profile";
  const accountLabel = profile?.role === "developer" ? t("developer.siteSettings") : t("nav.profile");
  const foreground = darkHeader ? "text-white" : "text-ink";
  const muted = darkHeader ? "text-white/70" : "text-slate";
  const hover = darkHeader ? "hover:bg-white/10 hover:text-white" : "hover:bg-paper hover:text-ink";

  const logout = async () => {
    if (isStaticExport) {
      logoutStaticProfile();
      window.location.href = appHref("/");
      return;
    }

    await fetch(appHref("/api/auth/logout"), { method: "POST" });
    window.location.href = appHref("/");
  };

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur ${darkHeader ? "border-white/10 bg-navy-950/95" : "border-line bg-white/95"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo href={profile || isProtectedPath ? dashboardHref : "/"} inverse={darkHeader} />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={appHref(link.href)} className={`rounded-xl px-3 py-2 text-sm font-bold ${muted} ${hover}`}>
              {t(link.label)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            className={`inline-flex h-11 items-center gap-2 rounded-xl border px-3 text-sm font-black ${darkHeader ? "border-white/15 text-white hover:bg-white/10" : "border-line text-ink hover:border-blue-600"}`}
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            aria-label="Toggle language"
          >
            <Globe size={16} />
            <span className={language === "en" ? "text-coral" : ""}>EN</span>
            <span className={foreground}>/</span>
            <span className={language === "es" ? "text-coral" : ""}>ES</span>
          </button>
          {profile ? (
            <>
              <ButtonLink href={accountHref} variant="secondary">
                <UserCircle size={16} />
                {accountLabel}
              </ButtonLink>
              <Button type="button" variant="ghost" onClick={logout}>
                <LogOut size={16} />
                {t("nav.logout")}
              </Button>
            </>
          ) : isProtectedPath && !profileChecked ? (
            <span className={`rounded-xl px-3 py-2 text-sm font-bold ${muted}`}>{t("common.loading")}</span>
          ) : (
            <>
              <ButtonLink href="/login" variant="secondary">
                {t("nav.clientPortal")}
              </ButtonLink>
              <ButtonLink href="/register">{t("nav.getStarted")}</ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border lg:hidden ${darkHeader ? "border-white/15 text-white" : "border-line text-ink"}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Open menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen ? (
        <div className={`border-t px-4 py-3 lg:hidden ${darkHeader ? "border-white/10 bg-navy-950" : "border-line bg-white"}`}>
          <nav className="grid gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={appHref(link.href)} className={`rounded-xl px-3 py-2 text-sm font-bold ${muted} ${hover}`}>
                {t(link.label)}
              </a>
            ))}
            <button
              type="button"
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold ${foreground} ${hover}`}
              onClick={() => setLanguage(language === "en" ? "es" : "en")}
            >
              <Globe size={16} />
              {language === "en" ? "Español" : "English"}
            </button>
            {profile ? (
              <>
                <a href={appHref(accountHref)} className={`rounded-xl px-3 py-2 text-sm font-bold ${foreground} ${hover}`}>
                  {accountLabel}
                </a>
                <button type="button" className={`rounded-xl px-3 py-2 text-left text-sm font-bold ${foreground} ${hover}`} onClick={logout}>
                  {t("nav.logout")}
                </button>
              </>
            ) : isProtectedPath && !profileChecked ? (
              <span className={`rounded-xl px-3 py-2 text-sm font-bold ${muted}`}>{t("common.loading")}</span>
            ) : (
              <>
                <a href={appHref("/login")} className={`rounded-xl px-3 py-2 text-sm font-bold ${foreground} ${hover}`}>
                  {t("nav.clientPortal")}
                </a>
                <a href={appHref("/register")} className="rounded-xl bg-coral px-3 py-2 text-sm font-bold text-white">
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
