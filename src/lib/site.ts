// Production URL for canonical, OG and sitemap. NEXT_PUBLIC_SITE_URL wins (set it for a custom domain);
// on Vercel the project's production domain is used; locally it falls back to localhost.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
