const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function appHref(href: string) {
  if (!href.startsWith("/") || href.startsWith("//") || !basePath) {
    return href;
  }

  if (href === basePath || href.startsWith(`${basePath}/`)) {
    return href;
  }

  return href === "/" ? `${basePath}/` : `${basePath}${href}`;
}
