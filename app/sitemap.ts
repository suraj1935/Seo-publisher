import { listPublishedSlugs } from "@/lib/backend-api";
import type { MetadataRoute } from "next";
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await listPublishedSlugs();
 
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
 
  return pages.map((row) => ({
    url: `${baseUrl}/${row.slug}`,
    lastModified: row.updated_at || undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
