import type { ButtonHTMLAttributes } from "react";
import { appHref } from "@/lib/paths";

const styles = {
  primary: "bg-coral text-white shadow-lg shadow-coral/20 hover:bg-[#e5483c]",
  secondary: "border border-line bg-white text-ink shadow-sm hover:border-blue-600 hover:text-blue-700",
  dashboard: "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",
  ghost: "text-slate hover:bg-paper hover:text-ink",
  dark: "border border-white/20 bg-white/10 text-white hover:bg-white/15",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

type Variant = keyof typeof styles;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  children,
  className = "",
  variant = "primary"
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}) {
  return (
    <a
      href={appHref(href)}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
