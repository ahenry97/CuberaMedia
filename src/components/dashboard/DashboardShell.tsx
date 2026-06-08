"use client";

import { BriefcaseBusiness, ClipboardList, ContactRound, FileText, Home, LayoutDashboard, MessageSquare, Settings, Users, Wrench } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { appHref, appPathname, isStaticExport } from "@/lib/paths";
import { getStaticProfile, staticDashboardHref } from "@/lib/staticAuth";

const customerNav = [
  { href: "/dashboard", label: "dashboard.overview", icon: LayoutDashboard },
  { href: "/dashboard/subscription", label: "dashboard.subscription", icon: FileText },
  { href: "/dashboard/projects", label: "dashboard.projects", icon: BriefcaseBusiness },
  { href: "/dashboard/intake", label: "dashboard.intake", icon: ClipboardList },
  { href: "/dashboard/support", label: "dashboard.support", icon: MessageSquare },
  { href: "/dashboard/profile", label: "dashboard.profile", icon: ContactRound }
];

const developerNav = [
  { href: "/developer", label: "developer.overview", icon: LayoutDashboard },
  { href: "/developer/customers", label: "developer.customers", icon: Users },
  { href: "/developer/work-items", label: "developer.workItems", icon: ClipboardList },
  { href: "/developer/intake-manager", label: "developer.intakeManager", icon: FileText },
  { href: "/developer/projects", label: "developer.projects", icon: BriefcaseBusiness },
  { href: "/developer/contact-messages", label: "developer.contactMessages", icon: MessageSquare },
  { href: "/developer/site-settings", label: "developer.siteSettings", icon: Settings },
  { href: "/developer/sites", label: "developer.websiteBuilder", icon: Wrench }
];

export function DashboardShell({
  children,
  mode
}: {
  children: React.ReactNode;
  mode: "customer" | "developer";
}) {
  const pathname = appPathname(usePathname());
  const { t } = useLanguage();
  const [authorized, setAuthorized] = useState(!isStaticExport);
  const navItems = mode === "developer" ? developerNav : customerNav;
  const homeHref = mode === "developer" ? "/developer" : "/dashboard";

  useEffect(() => {
    if (!isStaticExport) return;

    const profile = getStaticProfile();
    if (!profile) {
      window.location.href = appHref("/login");
      return;
    }

    if (mode === "developer" && profile.role !== "developer") {
      window.location.href = staticDashboardHref(profile.role);
      return;
    }

    if (mode === "customer" && profile.role !== "customer") {
      window.location.href = staticDashboardHref(profile.role);
      return;
    }

    setAuthorized(true);
  }, [mode]);

  if (!authorized) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm font-bold text-slate sm:px-6 lg:px-8">
        Checking account access...
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[270px_1fr] lg:px-8">
      <aside className="rounded-2xl border border-white/10 bg-navy-950 p-3 shadow-premium lg:sticky lg:top-24 lg:h-fit">
        <a href={appHref(homeHref)} className="mb-3 flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-white/75 hover:bg-white/10 hover:text-white">
          <Home size={16} />
          {t("nav.dashboard")}
        </a>
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={appHref(item.href)}
                className={`flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${
                  active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {t(item.label)}
              </a>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0 pb-10">{children}</main>
      </div>
    </div>
  );
}
