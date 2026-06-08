const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export function appHref(href: string) {
  if (!href.startsWith("/") || href.startsWith("//") || !basePath) {
    return href;
  }

  if (href === basePath || href.startsWith(`${basePath}/`)) {
    return href;
  }

  return href === "/" ? `${basePath}/` : `${basePath}${href}`;
}

export function appPathname(pathname: string) {
  if (basePath && pathname === basePath) {
    return "/";
  }

  if (basePath && pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || "/";
  }

  return pathname;
}
