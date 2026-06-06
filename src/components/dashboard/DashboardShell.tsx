"use client";

import { BriefcaseBusiness, ClipboardList, ContactRound, FileText, Home, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

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
  { href: "/developer/site-settings", label: "developer.siteSettings", icon: Settings }
];

export function DashboardShell({
  children,
  mode
}: {
  children: React.ReactNode;
  mode: "customer" | "developer";
}) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const navItems = mode === "developer" ? developerNav : customerNav;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <aside className="rounded-md border border-line bg-white p-3 shadow-soft lg:sticky lg:top-24 lg:h-fit">
        <a href="/" className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate hover:bg-paper">
          <Home size={16} />
          {t("nav.home")}
        </a>
        <nav className="grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                  active ? "bg-teal text-white" : "text-slate hover:bg-paper hover:text-ink"
                }`}
              >
                <Icon size={16} />
                {t(item.label)}
              </a>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
