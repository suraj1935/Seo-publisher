import { getAdminAccessToken, getAdminPage } from "@/lib/backend-api";
import PageEditor from "@/components/PageEditor";
import { notFound, redirect } from "next/navigation";
 
export default async function EditSeoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = await getAdminAccessToken();
  if (!token) redirect("/admin/login");

  const page = await getAdminPage(id, token);
 
  if (!page) notFound();
 
  return (
    <PageEditor
      initial={{
        ...page,
        meta_keywords: page.meta_keywords || undefined,
        og_title: page.og_title || undefined,
        og_description: page.og_description || undefined,
        og_image_url: page.og_image_url || undefined,
      }}
    />
  );
}
