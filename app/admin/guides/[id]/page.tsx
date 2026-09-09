import { notFound } from "next/navigation";
import AdminGuideManager, { type GuideInput } from "@/components/admin-guide-manager";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function AdminGuideEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(); const { id } = await params;
  const { data } = await createSupabaseAdminClient().from("guides").select("slug,title,topic,summary,content,read_time,seo_title,seo_description,is_published,published_at").eq("id", id).maybeSingle();
  if (!data) notFound();
  const guide: GuideInput = { ...data, seo_title: data.seo_title ?? "", seo_description: data.seo_description ?? "" };
  return <section><h1 className="admin-title">Edit guide</h1><p className="admin-subtitle">Save as draft, publish, unpublish or preview the public article.</p><AdminGuideManager initialGuide={guide} guideId={id} /></section>;
}
