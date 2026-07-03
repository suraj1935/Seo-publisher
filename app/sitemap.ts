import { createPublicClient } from "@/lib/supabase/public";
import type { MetadataRoute } from "next";
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("seo_pages")
    .select("slug, updated_at")
    .eq("status", "published");
 
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
 
  return (data || []).map((row) => ({
    url: `${baseUrl}/${row.slug}`,
    lastModified: row.updated_at,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
