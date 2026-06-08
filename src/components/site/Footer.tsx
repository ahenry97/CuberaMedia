"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { ButtonLink } from "@/components/ui/Button";
import { appHref } from "@/lib/paths";
import { Logo } from "@/components/site/Logo";

export function Footer() {
  const { language, t } = useLanguage();
  const columns =
    language === "es"
      ? [
          {
            title: "Servicios",
            links: [
              ["Sitios web", "/services"],
              ["Google Business Profile", "/services"],
              ["Redes sociales", "/services"],
              ["Sistemas de mercadeo", "/services"]
            ]
          },
          {
            title: "Compania",
            links: [
              ["Como funciona", "/#process"],
              ["Planes", "/pricing"],
              ["Sobre nosotros", "/about"],
              ["Contacto", "/contact"]
            ]
          },
          {
            title: "Recursos",
            links: [
              ["Portal del cliente", "/login"],
              ["FAQ", "/pricing#faq"],
              ["Privacidad", "#privacy"],
              ["Terminos", "#terms"]
            ]
          }
        ]
      : [
          {
            title: "Services",
            links: [
              ["Custom Websites", "/services"],
              ["Google Business Profile", "/services"],
              ["Social Media", "/services"],
              ["Marketing Systems", "/services"]
            ]
          },
          {
            title: "Company",
            links: [
              ["How It Works", "/#process"],
              ["Plans", "/pricing"],
              ["About", "/about"],
              ["Contact", "/contact"]
            ]
          },
          {
            title: "Resources",
            links: [
              ["Client Portal", "/login"],
              ["FAQ", "/pricing#faq"],
              ["Privacy Policy", "#privacy"],
              ["Terms of Service", "#terms"]
            ]
          }
        ];

  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_2fr_0.9fr] lg:px-8">
        <div>
          <Logo inverse />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">{t("tagline")}</p>
          <div className="mt-5 flex gap-3 text-sm font-black text-white/75">
            <span>f</span>
            <span>ig</span>
            <span>in</span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-black uppercase tracking-[0.22em] text-white/70">{column.title}</h2>
              <div className="mt-4 grid gap-2">
                {column.links.map(([label, href]) => (
                  <a key={label} href={appHref(href)} className="text-sm font-semibold text-white/70 hover:text-white">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.22em] text-white/70">{language === "es" ? "Hablemos" : "Let's Talk"}</h2>
          <p className="mt-4 text-sm leading-6 text-white/70">
            {language === "es" ? "Listo para crecer su negocio? Estamos aqui para ayudar." : "Ready to grow your business? We are here to help."}
          </p>
          <ButtonLink href="/register" className="mt-5 w-full">
            {t("nav.getStarted")}
          </ButtonLink>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs font-semibold text-white/55 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 {t("brand")}. {language === "es" ? "Todos los derechos reservados." : "All rights reserved."}</p>
          <div className="flex gap-6">
            <a href={appHref("#privacy")} className="hover:text-white">{language === "es" ? "Privacidad" : "Privacy Policy"}</a>
            <a href={appHref("#terms")} className="hover:text-white">{language === "es" ? "Terminos" : "Terms of Service"}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
