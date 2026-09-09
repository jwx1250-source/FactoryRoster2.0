import { notFound } from "next/navigation";

import AdminFactoryForm from "@/components/admin-factory-form";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function FactoryAdminPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = createSupabaseAdminClient();
  const [factory, verifications, contact, industries] = await Promise.all([
    supabase.from("factories").select("*").eq("id", id).maybeSingle(),
    supabase.from("verification_records").select("*").eq("factory_id", id).order("verification_type"),
    supabase.from("factory_contacts").select("*").eq("factory_id", id).maybeSingle(),
    supabase.from("industries").select("id,name").order("name"),
  ]);
  if (!factory.data) notFound();
  return <section><h1 className="admin-title">Edit factory</h1><p className="admin-subtitle">Internal fields and locked contact details never appear in the public Data API.</p><AdminFactoryForm initialFactory={factory.data} initialVerifications={verifications.data ?? []} initialContact={contact.data} industries={industries.data ?? []} /></section>;
}
