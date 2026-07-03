import { createClient } from "@/lib/supabase/server";
import PageEditor from "@/components/PageEditor";
import { notFound } from "next/navigation";
 
export default async function EditSeoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase.from("seo_pages").select("*").eq("id", id).single();
 
  if (!page) notFound();
 
  return <PageEditor initial={page} />;
}
