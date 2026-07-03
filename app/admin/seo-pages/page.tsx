import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
 
export default async function SeoPagesList() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("seo_pages")
    .select("id, slug, meta_title, status, quality_passed, updated_at")
    .order("updated_at", { ascending: false });
 
  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">SEO Pages</h1>
        <Link
          href="/admin/seo-pages/new"
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          + New Page
        </Link>
      </div>
 
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Quality</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y text-black">
            {(pages || []).map((page) => (
              <tr key={page.id}>
                <td className="px-4 py-3 font-mono text-xs">/{page.slug}</td>
                <td className="px-4 py-3">{page.meta_title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      page.status === "published"
                        ? "bg-green-100 text-green-700"
                        : page.status === "archived"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {page.status}
                  </span>
                </td>
                <td className="px-4 py-3">{page.quality_passed ? "✅" : "⚠️"}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(page.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/seo-pages/${page.id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(!pages || pages.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No pages yet. Click &quot;New Page&quot; to create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
