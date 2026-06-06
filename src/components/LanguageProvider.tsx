"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionary, translate } from "@/lib/i18n";
import type { Language } from "@/lib/types";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (path: string) => string;
  tArray: (path: string) => string[];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const languageCookieMaxAge = 60 * 60 * 24 * 365;

export function LanguageProvider({ children, initialLanguage = "en" }: { children: React.ReactNode; initialLanguage?: Language }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    const stored = window.localStorage.getItem("cubera-language");
    if (stored === "en" || stored === "es") {
      setLanguageState(stored);
      document.documentElement.lang = stored;
      writeLanguageCookie(stored);
      return;
    }

    window.localStorage.setItem("cubera-language", initialLanguage);
    document.documentElement.lang = initialLanguage;
    writeLanguageCookie(initialLanguage);
  }, [initialLanguage]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem("cubera-language", nextLanguage);
    document.documentElement.lang = nextLanguage;
    writeLanguageCookie(nextLanguage);
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (path: string) => translate(language, path),
      tArray: (path: string) => {
        const segments = path.split(".");
        let current: unknown = dictionary[language];
        for (const segment of segments) {
          if (typeof current !== "object" || current === null || !(segment in current)) {
            return [];
          }
          current = (current as Record<string, unknown>)[segment];
        }
        return Array.isArray(current) ? current.filter((item): item is string => typeof item === "string") : [];
      }
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function writeLanguageCookie(language: Language) {
  document.cookie = `cubera-language=${language}; path=/; max-age=${languageCookieMaxAge}; SameSite=Lax`;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }
  return context;
}
