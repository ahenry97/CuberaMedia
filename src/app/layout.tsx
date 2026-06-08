import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DevelopmentIssueBar } from "@/components/dev/DevelopmentIssueBar";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { LanguageProvider } from "@/components/LanguageProvider";
import type { Language } from "@/lib/types";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cubera Media",
  description: "Websites, profiles, and marketing systems for local businesses."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = process.env.GITHUB_PAGES === "true" ? null : await cookies();
  const cookieLanguage = cookieStore?.get("cubera-language")?.value;
  const initialLanguage: Language = cookieLanguage === "es" ? "es" : "en";

  return (
    <html lang={initialLanguage}>
      <body>
        <LanguageProvider initialLanguage={initialLanguage}>
          <Header />
          {children}
          <Footer />
          {process.env.NODE_ENV === "development" ? <DevelopmentIssueBar /> : null}
        </LanguageProvider>
      </body>
    </html>
  );
}
