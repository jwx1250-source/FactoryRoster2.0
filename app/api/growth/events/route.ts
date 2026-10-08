import { z } from "zod";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth";
import { GROWTH_EVENTS, recordGrowthEvent } from "@/lib/growth";
import { apiError } from "@/lib/http";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  event_name: z.enum(GROWTH_EVENTS),
  path: z.string().trim().max(500).optional(),
  referrer: z.string().trim().max(1000).optional(),
  session_id: z.string().trim().max(120).optional(),
  source_guide_slug: z.string().trim().max(180).optional(),
  source_industry_slug: z.string().trim().max(180).optional(),
  source_supplier_slug: z.string().trim().max(180).optional(),
  utm_source: z.string().trim().max(120).optional(),
  utm_medium: z.string().trim().max(120).optional(),
  utm_campaign: z.string().trim().max(180).optional(),
  entity_type: z.string().trim().max(80).optional(),
  entity_id: z.string().trim().max(180).optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  idempotency_key: z.string().trim().max(180).optional(),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const cookieStore = await cookies();
    const existingVisitor = cookieStore.get("fr_visitor_id")?.value;
    const visitorId = existingVisitor || crypto.randomUUID();
    const user = await getAuthenticatedUser();
    const attribution = {
      visitor_id: visitorId,
      user_id: user?.id ?? null,
      last_path: input.path ?? null,
      last_referrer: input.referrer ?? null,
      last_utm_source: input.utm_source ?? null,
      last_utm_medium: input.utm_medium ?? null,
      last_utm_campaign: input.utm_campaign ?? null,
      last_seen_at: new Date().toISOString(),
    };
    const admin = createSupabaseAdminClient();
    const { data: existing } = await admin.from("visitor_attribution").select("first_landing_path,first_referrer,first_utm_source,first_utm_medium,first_utm_campaign").eq("visitor_id", visitorId).maybeSingle();
    await admin.from("visitor_attribution").upsert({
      ...attribution,
      first_landing_path: existing?.first_landing_path ?? input.path ?? null,
      first_referrer: existing?.first_referrer ?? input.referrer ?? null,
      first_utm_source: existing?.first_utm_source ?? input.utm_source ?? null,
      first_utm_medium: existing?.first_utm_medium ?? input.utm_medium ?? null,
      first_utm_campaign: existing?.first_utm_campaign ?? input.utm_campaign ?? null,
    }, { onConflict: "visitor_id" });

    await recordGrowthEvent({
      eventName: input.event_name,
      userId: user?.id,
      anonymousId: visitorId,
      sessionId: input.session_id,
      path: input.path,
      referrer: input.referrer,
      firstLandingPath: existing?.first_landing_path ?? input.path,
      sourceGuideSlug: input.source_guide_slug,
      sourceIndustrySlug: input.source_industry_slug,
      sourceSupplierSlug: input.source_supplier_slug,
      utmSource: input.utm_source,
      utmMedium: input.utm_medium,
      utmCampaign: input.utm_campaign,
      entityType: input.entity_type,
      entityId: input.entity_id,
      properties: input.properties,
      idempotencyKey: input.idempotency_key,
    });
    const response = NextResponse.json({ recorded: true, visitor_id: visitorId }, { headers: { "Cache-Control": "private, no-store" } });
    if (!existingVisitor) response.cookies.set("fr_visitor_id", visitorId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 });
    return response;
  } catch (error) {
    return apiError(error);
  }
}
