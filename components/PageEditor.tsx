"use client";
 
import { useState, useMemo } from "react";
import { savePage } from "@/lib/actions";
import { productDisplayTemplate } from "@/lib/product-template";
 
export interface PageEditorProps {
  initial?: {
    id?: string;
    slug?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image_url?: string;
    html_content?: string;
    css_content?: string;
    js_content?: string;
    json_ld?: Record<string, unknown>;
  };
}
 
type Tab = "meta" | "html" | "css" | "js" | "jsonld" | "preview";
 
export default function PageEditor({ initial = {} }: PageEditorProps) {
  const [tab, setTab] = useState<Tab>("meta");
  const [saving, setSaving] = useState(false);
  const [issues, setIssues] = useState<{ field: string; message: string; severity: string }[]>([]);
 
  const [form, setForm] = useState({
    slug: initial.slug || productDisplayTemplate.slug,
    meta_title: initial.meta_title || productDisplayTemplate.meta_title,
    meta_description: initial.meta_description || productDisplayTemplate.meta_description,
    meta_keywords: initial.meta_keywords || productDisplayTemplate.meta_keywords,
    og_title: initial.og_title || productDisplayTemplate.og_title,
    og_description: initial.og_description || productDisplayTemplate.og_description,
    og_image_url: initial.og_image_url || "",
    html_content: initial.html_content || productDisplayTemplate.html_content,
    css_content: initial.css_content || productDisplayTemplate.css_content,
    js_content: initial.js_content || productDisplayTemplate.js_content,
    json_ld: initial.json_ld
      ? JSON.stringify(initial.json_ld, null, 2)
      : JSON.stringify(productDisplayTemplate.json_ld, null, 2),
  });
 
  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function loadProductDisplayTemplate() {
    setForm({
      slug: productDisplayTemplate.slug,
      meta_title: productDisplayTemplate.meta_title,
      meta_description: productDisplayTemplate.meta_description,
      meta_keywords: productDisplayTemplate.meta_keywords,
      og_title: productDisplayTemplate.og_title,
      og_description: productDisplayTemplate.og_description,
      og_image_url: productDisplayTemplate.og_image_url,
      html_content: productDisplayTemplate.html_content,
      css_content: productDisplayTemplate.css_content,
      js_content: productDisplayTemplate.js_content,
      json_ld: JSON.stringify(productDisplayTemplate.json_ld, null, 2),
    });
  }
 
  const previewSrcDoc = useMemo(() => {
    return `<!DOCTYPE html><html><head><style>${form.css_content}</style></head><body>${form.html_content}</body></html>`;
  }, [form.css_content, form.html_content]);
 
  async function handleSubmit(publish: boolean) {
    setSaving(true);
    setIssues([]);
 
    let parsedJsonLd: Record<string, unknown> = {};
    try {
      parsedJsonLd = JSON.parse(form.json_ld);
    } catch {
      setIssues([{ field: "json_ld", message: "JSON-LD is not valid JSON.", severity: "error" }]);
      setSaving(false);
      return;
    }
 
    const result = await savePage({
      id: initial.id,
      slug: form.slug,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      meta_keywords: form.meta_keywords,
      og_title: form.og_title,
      og_description: form.og_description,
      og_image_url: form.og_image_url,
      html_content: form.html_content,
      css_content: form.css_content,
      js_content: form.js_content,
      json_ld: parsedJsonLd,
      publish,
    });
 
    setSaving(false);
    if (result && !result.success) {
      setIssues(result.issues || []);
    }
    // On success, savePage() redirects server-side.
  }
 
  const tabs: { key: Tab; label: string }[] = [
    { key: "meta", label: "Meta" },
    { key: "html", label: "HTML" },
    { key: "css", label: "CSS" },
    { key: "js", label: "JS" },
    { key: "jsonld", label: "JSON-LD" },
    { key: "preview", label: "Preview" },
  ];
 
  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Product publisher
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-black">
            {initial.id ? "Edit Product Display Page" : "New Product Display Page"}
          </h1>
        </div>
        <button
          type="button"
          onClick={loadProductDisplayTemplate}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
        >
          Load product display template
        </button>
      </div>
 
      {issues.length > 0 && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4">
          <p className="mb-2 text-sm font-medium text-red-800">Quality check failed:</p>
          <ul className="list-inside list-disc text-sm text-red-700">
            {issues.map((issue, i) => (
              <li key={i}>
                <span className="font-mono">{issue.field}</span>: {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}
 
      <div className="mb-4 flex gap-2 border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 text-sm font-medium ${
              tab === t.key ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
 
      {tab === "meta" && (
        <div className="space-y-4">
          <Field label="Slug (URL path, e.g. fast-shipping-london)">
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm font-mono text-black"
              placeholder="fast-shipping-london"
            />
          </Field>
          <Field label={`Meta Title (${form.meta_title.length}/60)`}>
            <input
              value={form.meta_title}
              onChange={(e) => update("meta_title", e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm text-black"
            />
          </Field>
          <Field label={`Meta Description (${form.meta_description.length}/160)`}>
            <textarea
              value={form.meta_description}
              onChange={(e) => update("meta_description", e.target.value)}
              rows={3}
              className="w-full rounded border px-3 py-2 text-sm text-black"
            />
          </Field>
          <Field label="Meta Keywords (comma-separated)">
            <input
              value={form.meta_keywords}
              onChange={(e) => update("meta_keywords", e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm text-black"
            />
          </Field>
          <Field label="OG Title">
            <input
              value={form.og_title}
              onChange={(e) => update("og_title", e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm text-black"
            />
          </Field>
          <Field label="OG Description">
            <textarea
              value={form.og_description}
              onChange={(e) => update("og_description", e.target.value)}
              rows={2}
              className="w-full rounded border px-3 py-2 text-sm text-black"
            />
          </Field>
          <Field label="OG Image URL">
            <input
              value={form.og_image_url}
              onChange={(e) => update("og_image_url", e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm text-black"
            />
          </Field>
        </div>
      )}
 
      {tab === "html" && (
        <textarea
          value={form.html_content}
          onChange={(e) => update("html_content", e.target.value)}
          rows={20}
          className="w-full rounded border p-3 font-mono text-xs text-black"
        />
      )}
 
      {tab === "css" && (
        <textarea
          value={form.css_content}
          onChange={(e) => update("css_content", e.target.value)}
          rows={20}
          className="w-full rounded border p-3 font-mono text-xs text-black"
        />
      )}
 
      {tab === "js" && (
        <textarea
          value={form.js_content}
          onChange={(e) => update("js_content", e.target.value)}
          rows={20}
          className="w-full rounded border p-3 font-mono text-xs text-black"
        />
      )}
 
      {tab === "jsonld" && (
        <textarea
          value={form.json_ld}
          onChange={(e) => update("json_ld", e.target.value)}
          rows={20}
          className="w-full rounded border p-3 font-mono text-xs text-black"
        />
      )}
 
      {tab === "preview" && (
        <iframe
          srcDoc={previewSrcDoc}
          className="h-[600px] w-full rounded border bg-white"
          sandbox="allow-same-origin"
          title="Page preview"
        />
      )}
 
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => handleSubmit(false)}
          disabled={saving}
          className="rounded border px-4 py-2 text-sm font-medium disabled:opacity-50 text-black"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSubmit(true)}
          disabled={saving}
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Checking & publishing..." : "Run Quality Check & Publish"}
        </button>
      </div>
    </div>
  );
}
 
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
