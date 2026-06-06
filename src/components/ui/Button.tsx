import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

const styles = {
  primary: "bg-teal text-white hover:bg-teal/90",
  secondary: "border border-line bg-white text-ink hover:border-teal hover:text-teal",
  ghost: "text-slate hover:bg-paper",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

type Variant = keyof typeof styles;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`}
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
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
