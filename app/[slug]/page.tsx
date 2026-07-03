import { createPublicClient } from "@/lib/supabase/public";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
 
// Allow slugs not known at build time to render on-demand, then get cached.
export const dynamicParams = true;
 
// Revalidate published content at most every hour even without a rebuild —
// tune this down if you need near-instant edits to reflect.
export const revalidate = 3600;
 
interface SeoPage {
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  html_content: string;
  css_content: string;
  js_content: string;
  json_ld: Record<string, unknown>;
  status: string;
}
 
async function getPage(slug: string): Promise<SeoPage | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("seo_pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
 
  if (error || !data) return null;
  return data as SeoPage;
}
 
// Pre-build every currently-published slug at deploy time (SSG).
// Anything published after deploy falls through to on-demand SSR above.
export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase.from("seo_pages").select("slug").eq("status", "published");
  return (data || []).map((row) => ({ slug: row.slug }));
}
 
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
 
  return {
    title: page.meta_title,
    description: page.meta_description,
    keywords: page.meta_keywords || undefined,
    openGraph: {
      title: page.og_title || page.meta_title,
      description: page.og_description || page.meta_description,
      images: page.og_image_url ? [page.og_image_url] : undefined,
    },
    alternates: {
      canonical: `/${page.slug}`,
    },
  };
}
 
export default async function SeoPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
 
  if (!page) notFound();
 
  return (
    <>
      {/* Real, server-rendered HTML — visible to every crawler, no JS required */}
      {page.css_content && <style dangerouslySetInnerHTML={{ __html: page.css_content }} />}
 
      {page.json_ld && Object.keys(page.json_ld).length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.json_ld) }}
        />
      )}
 
      <div dangerouslySetInnerHTML={{ __html: page.html_content }} />
 
      {/* Custom JS runs client-side only, after hydration — never relied on for SEO content */}
      {page.js_content && (
        <script dangerouslySetInnerHTML={{ __html: page.js_content }} />
      )}
    </>
  );
}
