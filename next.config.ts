import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_PAGES_REPOSITORY_NAME ?? "CuberaMedia";
const pagesBasePath = isGitHubPages ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath: pagesBasePath || undefined,
  assetPrefix: pagesBasePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: pagesBasePath,
    NEXT_PUBLIC_STATIC_EXPORT: isGitHubPages ? "true" : "false"
  },
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb"
    }
  }
};

export default nextConfig;
