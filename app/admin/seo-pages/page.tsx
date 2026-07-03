import { getAdminAccessToken, listAdminPages, type SeoPageSummary } from "@/lib/backend-api";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SeoPagesList() {
  const token = await getAdminAccessToken();
  if (!token) redirect("/admin/login");

  let pages: SeoPageSummary[] = [];
  let error: Error | null = null;

  try {
    pages = await listAdminPages(token);
  } catch (caught) {
    error = caught instanceof Error ? caught : new Error("Backend API is unavailable.");
  }

  const pageCount = pages?.length || 0;

  return (
    <main className="min-h-screen bg-[#f3f8fb] text-[#061d22]">
      <section className="relative overflow-hidden bg-[#061d22] px-5 py-8 text-white sm:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/95 px-4 py-3 text-[#061d22] shadow-xl">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 text-base font-black text-white">
                S
              </span>
              <div>
                <p className="text-sm font-black leading-none">Sun Sky</p>
                <p className="mt-1 text-xs font-semibold text-[#5f767d]">Product publisher</p>
              </div>
            </div>
            <Link
              href="/admin/seo-pages/new"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#17b886] px-5 text-sm font-black text-[#021b18] shadow-[0_16px_34px_rgba(23,184,134,0.24)]"
            >
              New Product Page
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="mb-4 w-fit rounded-full bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#17b886]">
                Product display control
              </p>
              <h1 className="max-w-2xl text-4xl font-black leading-[0.98] tracking-normal sm:text-6xl">
                Build product pages with proof, structure, and SEO.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#cfe3e6]">
                Create polished product display pages, run quality checks, publish
                live slugs, and keep every offer ready for search and conversion.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-[#d7e8eb]">
                  Product templates
                </span>
                <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-[#d7e8eb]">
                  Quality gates
                </span>
                <span className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-[#d7e8eb]">
                  Live publishing
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0a1f27] p-4 shadow-[0_32px_80px_rgba(0,0,0,0.34)]">
              <div className="mb-4 flex items-center justify-between px-2">
                <div>
                  <p className="text-sm font-black">Publishing dashboard</p>
                  <p className="mt-1 text-xs font-semibold text-[#9fb9be]">
                    Pages, status, quality, delivery
                  </p>
                </div>
                <span className="rounded-full bg-[#f8b93f] px-3 py-2 text-xs font-black text-[#0c1b18]">
                  {pageCount} pages
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardSignal
                  title="Published"
                  value={pages?.filter((page) => page.status === "published").length || 0}
                />
                <DashboardSignal
                  title="Drafts"
                  value={pages?.filter((page) => page.status === "draft").length || 0}
                />
                <DashboardSignal
                  title="Quality passed"
                  value={pages?.filter((page) => page.quality_passed).length || 0}
                />
                <DashboardSignal title="Needs setup" value={error ? 1 : 0} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
            <p className="font-black">Database setup required</p>
            <p className="mt-2 text-sm leading-6">
              The FastAPI backend is connected to Supabase, but the{" "}
              <code className="rounded bg-white px-1">seo_pages</code> table was not found.
              Run <code className="rounded bg-white px-1">schema.sql</code> in Supabase, start
              the backend with <code className="rounded bg-white px-1">npm run dev:backend</code>,
              then refresh this dashboard.
            </p>
          </div>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#138c68]">
              Product pages
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-normal text-[#061d22]">
              Display pages ready to manage
            </h2>
          </div>
          <Link
            href="/admin/seo-pages/new"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#cfe2e6] bg-white px-5 text-sm font-black text-[#061d22] shadow-sm"
          >
            Open product page builder
          </Link>
        </div>

        {pages && pages.length > 0 ? (
          <div className="grid gap-4">
            {pages.map((page) => (
              <article
                key={page.id}
                className="grid gap-4 rounded-2xl border border-[#dce8ec] bg-white p-5 shadow-[0_18px_44px_rgba(6,29,34,0.06)] md:grid-cols-[1fr_auto] md:items-center"
              >
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        page.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : page.status === "archived"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {page.status}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        page.quality_passed
                          ? "bg-blue-100 text-blue-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {page.quality_passed ? "Quality passed" : "Needs review"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#061d22]">{page.meta_title}</h3>
                  <p className="mt-2 font-mono text-sm text-[#567078]">/{page.slug}</p>
                  <p className="mt-3 text-sm font-semibold text-[#6b8289]">
                  Updated {page.updated_at ? new Date(page.updated_at).toLocaleDateString() : "not yet"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {page.status === "published" && (
                    <Link
                      href={`/${page.slug}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#17b886] px-5 text-sm font-black text-[#021b18]"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/admin/seo-pages/${page.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#061d22] px-5 text-sm font-black text-white"
                  >
                    Edit
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <EmptyCard
              title="Create the offer"
              text="Start with the product display template and replace the sample copy with your offer."
            />
            <EmptyCard
              title="Run quality checks"
              text="The publisher checks title, description, H1 structure, JSON-LD, and duplicate content."
            />
            <EmptyCard
              title="Publish the slug"
              text="Once Supabase tables exist, publish a clean URL that renders server-side for crawlers."
            />
          </div>
        )}
      </section>
    </main>
  );
}

function DashboardSignal({ title, value }: { title: string; value: number }) {
  return (
    <article className="rounded-xl bg-[#102c34] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9fb9be]">{title}</p>
      <strong className="mt-3 block text-3xl font-black text-white">{value}</strong>
    </article>
  );
}

function EmptyCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="min-h-52 rounded-2xl border border-[#dce8ec] bg-white p-6 shadow-[0_18px_44px_rgba(6,29,34,0.06)]">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#17b886] font-black text-[#021b18]">
        +
      </span>
      <h3 className="mt-8 text-xl font-black text-[#061d22]">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#567078]">{text}</p>
    </article>
  );
}
