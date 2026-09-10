import AdminFactoryForm from "@/components/admin-factory-form";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function NewFactoryPage() {
  await requireAdmin();
  const { data: industries } = await createSupabaseAdminClient().from("industries").select("id,name,parent_id,primary_industry,secondary_category").order("sort_order").order("name");
  return <section><h1 className="admin-title">Create supplier</h1><p className="admin-subtitle">New profiles start as private drafts with three pending verification checks.</p><AdminFactoryForm industries={industries ?? []} /></section>;
}
