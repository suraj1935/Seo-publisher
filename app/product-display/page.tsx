import type { Metadata } from "next";
import { productDisplayTemplate } from "@/lib/product-template";

export const metadata: Metadata = {
  title: productDisplayTemplate.meta_title,
  description: productDisplayTemplate.meta_description,
  keywords: productDisplayTemplate.meta_keywords,
  openGraph: {
    title: productDisplayTemplate.og_title,
    description: productDisplayTemplate.og_description,
  },
};

export default function ProductDisplayPreview() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: productDisplayTemplate.css_content }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productDisplayTemplate.json_ld),
        }}
      />
      <div dangerouslySetInnerHTML={{ __html: productDisplayTemplate.html_content }} />
    </>
  );
}
