import { z } from "zod";

import { apiError } from "@/lib/http";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  work_email: z.email().max(254),
  company: z.string().trim().max(160).optional(),
  country: z.string().trim().max(100).optional(),
  inquiry_type: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10).max(5000),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("contact_messages").insert(input).select("id,created_at").single();
    if (error) throw error;
    return Response.json({ message: "Your message has been received.", submission: data }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
