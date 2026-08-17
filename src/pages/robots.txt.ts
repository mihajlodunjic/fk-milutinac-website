import { business, hasConfiguredSiteUrl } from "@/data/business";

export function GET() {
  const noindex = business.environment !== "production" || !hasConfiguredSiteUrl;
  const body = noindex
    ? `User-agent: *\nDisallow: /\nSitemap: ${business.siteUrl}/sitemap-index.xml\n`
    : `User-agent: *\nAllow: /\nSitemap: ${business.siteUrl}/sitemap-index.xml\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
