import { createClient } from "@/lib/supabase/server";

export interface SeoPage {
  id: string;
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
  content_hash: string;
  quality_passed: boolean;
  quality_report: Record<string, unknown>;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
}

export interface SeoPageSummary {
  id: string;
  slug: string;
  meta_title: string;
  status: "draft" | "published" | "archived";
  quality_passed: boolean;
  updated_at: string | null;
}

export interface SavePagePayload {
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

export interface SavePageResponse {
  success: boolean;
  page?: SeoPage | null;
  issues?: { field: string; message: string; severity: "error" | "warning" }[];
  duplicateOf?: string;
}

export class BackendApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: unknown
  ) {
    super(message);
    this.name = "BackendApiError";
  }
}

const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("accept", "application/json");

  if (options.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  if (options.token) {
    headers.set("authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "detail" in data
        ? JSON.stringify(data.detail)
        : `Backend API request failed with status ${response.status}.`;
    throw new BackendApiError(message, response.status, data);
  }

  return data as T;
}

export async function getAdminAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token || null;
}

export async function listAdminPages(token: string): Promise<SeoPageSummary[]> {
  return apiRequest<SeoPageSummary[]>("/api/pages", { token, cache: "no-store" });
}

export async function getAdminPage(id: string, token: string): Promise<SeoPage | null> {
  try {
    return await apiRequest<SeoPage>(`/api/pages/${id}`, { token, cache: "no-store" });
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 404) return null;
    throw error;
  }
}

export async function saveAdminPage(
  payload: SavePagePayload,
  token: string,
  id?: string
): Promise<SavePageResponse> {
  return apiRequest<SavePageResponse>(id ? `/api/pages/${id}` : "/api/pages", {
    method: id ? "PUT" : "POST",
    token,
    body: JSON.stringify(payload),
    cache: "no-store",
  });
}

export async function getPublishedPage(slug: string): Promise<SeoPage | null> {
  try {
    return await apiRequest<SeoPage>(`/api/public/pages/${slug}`, {
      next: { revalidate: 3600 },
    });
  } catch (error) {
    if (error instanceof BackendApiError && error.status === 404) return null;
    return null;
  }
}

export async function listPublishedSlugs(): Promise<{ slug: string; updated_at: string | null }[]> {
  try {
    return await apiRequest<{ slug: string; updated_at: string | null }[]>("/api/public/slugs", {
      next: { revalidate: 3600 },
    });
  } catch {
    return [];
  }
}
