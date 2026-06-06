import type { Metadata } from "next";
import { DevelopmentIssueBar } from "@/components/dev/DevelopmentIssueBar";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cubera Digital Solutions",
  description: "Simple digital solutions for local businesses."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
          {process.env.NODE_ENV === "development" ? <DevelopmentIssueBar /> : null}
        </LanguageProvider>
      </body>
    </html>
  );
}
