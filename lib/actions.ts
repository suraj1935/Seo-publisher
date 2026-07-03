"use server";
 
import { createClient } from "@/lib/supabase/server";
import { runQualityChecks, isDuplicateHash, type PageInput } from "@/lib/quality-checker";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
 
export interface SavePageResult {
  success: boolean;
  issues?: { field: string; message: string; severity: "error" | "warning" }[];
  duplicateOf?: string;
}
 
const RESERVED_SLUGS = new Set(["admin", "api", "sitemap.xml", "robots.txt", "_next", "favicon.ico"]);
 
interface PageFormData extends PageInput {
  id?: string;
  slug: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  css_content?: string;
  js_content?: string;
  publish: boolean;
}
 
export async function savePage(form: PageFormData): Promise<SavePageResult> {
  const supabase = await createClient();
 
  const slug = form.slug.trim().toLowerCase().replace(/^\/+/, "");
 
  if (RESERVED_SLUGS.has(slug)) {
    return {
      success: false,
      issues: [{ field: "slug", message: `"${slug}" is a reserved route and can't be used as a slug.`, severity: "error" }],
    };
  }
 
  // Run quality gates before allowing publish (drafts can save with warnings)
  const report = runQualityChecks({
    meta_title: form.meta_title,
    meta_description: form.meta_description,
    html_content: form.html_content,
    json_ld: form.json_ld,
  });
 
  if (form.publish && !report.passed) {
    return { success: false, issues: report.issues };
  }
 
  // Thin/duplicate content guard — check against other published pages
  if (form.publish) {
    const { data: existing } = await supabase
      .from("seo_pages")
      .select("slug, content_hash")
      .eq("status", "published")
      .neq("id", form.id || "");
 
    const existingHashes = (existing || []).map((r) => r.content_hash);
    if (isDuplicateHash(report.contentHash, existingHashes)) {
      const match = existing?.find((r) => r.content_hash === report.contentHash);
      return {
        success: false,
        duplicateOf: match?.slug,
        issues: [
          {
            field: "html_content",
            message: `Content is near-identical to an already-published page (/${match?.slug}). Add unique detail before publishing.`,
            severity: "error",
          },
        ],
      };
    }
  }
 
  const payload = {
    slug,
    meta_title: form.meta_title,
    meta_description: form.meta_description,
    meta_keywords: form.meta_keywords || null,
    og_title: form.og_title || null,
    og_description: form.og_description || null,
    og_image_url: form.og_image_url || null,
    html_content: form.html_content,
    css_content: form.css_content || "",
    js_content: form.js_content || "",
    json_ld: form.json_ld || {},
    content_hash: report.contentHash,
    quality_passed: report.passed,
    quality_report: report,
    status: form.publish ? "published" : "draft",
    published_at: form.publish ? new Date().toISOString() : null,
  };
 
  if (form.id) {
    const { error } = await supabase.from("seo_pages").update(payload).eq("id", form.id);
    if (error) return { success: false, issues: [{ field: "form", message: error.message, severity: "error" }] };
  } else {
    const { error } = await supabase.from("seo_pages").insert(payload);
    if (error) return { success: false, issues: [{ field: "form", message: error.message, severity: "error" }] };
  }
 
  revalidatePath(`/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/seo-pages");
  redirect("/admin/seo-pages");
}
