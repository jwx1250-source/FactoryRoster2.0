import { apiError } from "@/lib/http";
import { contactPreview } from "@/lib/domain/rules";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PUBLIC_SUPPLIER_FIELDS = "id,slug,company_name,chinese_name,record_id,province,city,district,address_public,established_year,employee_range,factory_size,annual_revenue_range,main_products,capabilities,export_markets,certifications,trade_terms,moq,website_url,factory_type,supplier_type,supply_evidence_type,moq_level,supports_small_orders,supports_sample_orders,supports_private_label,supply_model,overview,last_verified_at,has_verified_contact,industries!factories_industry_id_fkey(name,slug,code),secondary_category:industries!factories_secondary_category_id_fkey(name,slug)";

export async function GET(_request: Request, context: RouteContext<"/api/factories/[slug]">) {
  try {
    const { slug } = await context.params;
    const supabase = await createSupabaseServerClient();
    const { data: supplier, error } = await supabase
      .from("factories")
      .select(PUBLIC_SUPPLIER_FIELDS)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw error;
    if (!supplier) return Response.json({ error: "Supplier not found" }, { status: 404 });

    const { data: verifications, error: verificationError } = await supabase
      .from("verification_records")
      .select("verification_type,status,checked_items,verification_method,verified_at,evidence_note")
      .eq("factory_id", supplier.id)
      .eq("status", "verified");
    if (verificationError) throw verificationError;

    return Response.json({ supplier, factory: supplier, verifications, contact: contactPreview(supplier.has_verified_contact) });
  } catch (error) {
    return apiError(error);
  }
}
