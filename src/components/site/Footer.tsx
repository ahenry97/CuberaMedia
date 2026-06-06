"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p className="font-semibold text-ink">{t("brand")}</p>
        <p>{t("tagline")}</p>
      </div>
    </footer>
  );
}
