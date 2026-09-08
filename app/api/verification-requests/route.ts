import { z } from "zod";

import { apiError } from "@/lib/http";
import { getAuthenticatedUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  factory_id: z.uuid().optional(),
  factory_name: z.string().trim().max(200).optional(),
  factory_profile_url: z.url().max(1000).optional(),
  product_category: z.string().trim().min(2).max(160),
  request_type: z.string().trim().min(2).max(100),
  buyer_name: z.string().trim().min(2).max(100),
  buyer_email: z.email().max(254),
  company_name: z.string().trim().max(160).optional(),
  country: z.string().trim().max(100).optional(),
  message: z.string().trim().max(5000).optional(),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const user = await getAuthenticatedUser().catch(() => null);
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("verification_requests")
      .insert({ ...input, user_id: user?.id ?? null })
      .select("id,status,created_at")
      .single();
    if (error) throw error;
    return Response.json({ message: "Verification request submitted.", request: data }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
