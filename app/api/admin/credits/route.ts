import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { apiError, noStoreJson } from "@/lib/http";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const schema = z.object({ userId: z.string().uuid(), amount: z.number().int().refine((value) => value !== 0), description: z.string().trim().min(3).max(300) });

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const input = schema.parse(await request.json());
    const { data, error } = await createSupabaseAdminClient().rpc("admin_adjust_contact_credits", { p_user_id: input.userId, p_amount: input.amount, p_description: input.description });
    if (error) throw error;
    return noStoreJson({ balance: data });
  } catch (error) { return apiError(error); }
}
