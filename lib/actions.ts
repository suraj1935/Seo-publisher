"use server";

import { getAdminAccessToken, saveAdminPage } from "@/lib/backend-api";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface SavePageResult {
  success: boolean;
  issues?: { field: string; message: string; severity: "error" | "warning" }[];
  duplicateOf?: string;
}

const RESERVED_SLUGS = new Set(["admin", "api", "sitemap.xml", "robots.txt", "_next", "favicon.ico"]);

interface PageFormData {
  id?: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  html_content: string;
  css_content?: string;
  js_content?: string;
  json_ld: Record<string, unknown>;
  publish: boolean;
}

export async function savePage(form: PageFormData): Promise<SavePageResult> {
  const token = await getAdminAccessToken();

  if (!token) {
    return {
      success: false,
      issues: [{ field: "form", message: "Admin session expired. Sign in again.", severity: "error" }],
    };
  }

  const slug = form.slug.trim().toLowerCase().replace(/^\/+/, "");

  if (RESERVED_SLUGS.has(slug)) {
    return {
      success: false,
      issues: [{ field: "slug", message: `"${slug}" is a reserved route and can't be used as a slug.`, severity: "error" }],
    };
  }

  const result = await saveAdminPage({ ...form, slug }, token, form.id);
  if (!result.success) return result;

  revalidatePath(`/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/seo-pages");
  redirect("/admin/seo-pages");
}
