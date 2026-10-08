import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const GROWTH_EVENTS = [
  "organic_landing", "supplier_search", "filter_applied", "supplier_profile_view",
  "guide_cta_click", "signup_started", "signup_completed", "checkout_started",
  "checkout_completed", "contact_unlocked", "supplier_saved", "search_saved",
] as const;

export type GrowthEventName = (typeof GROWTH_EVENTS)[number];

type GrowthEventInput = {
  eventName: GrowthEventName;
  userId?: string | null;
  anonymousId?: string | null;
  sessionId?: string | null;
  path?: string | null;
  referrer?: string | null;
  firstLandingPath?: string | null;
  sourceGuideSlug?: string | null;
  sourceIndustrySlug?: string | null;
  sourceSupplierSlug?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  properties?: Record<string, unknown>;
  idempotencyKey?: string | null;
};

export async function recordGrowthEvent(input: GrowthEventInput) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("record_growth_event", {
    p_event_name: input.eventName,
    p_user_id: input.userId ?? null,
    p_anonymous_id: input.anonymousId ?? null,
    p_session_id: input.sessionId ?? null,
    p_path: input.path ?? null,
    p_referrer: input.referrer ?? null,
    p_first_landing_path: input.firstLandingPath ?? null,
    p_source_guide_slug: input.sourceGuideSlug ?? null,
    p_source_industry_slug: input.sourceIndustrySlug ?? null,
    p_source_supplier_slug: input.sourceSupplierSlug ?? null,
    p_utm_source: input.utmSource ?? null,
    p_utm_medium: input.utmMedium ?? null,
    p_utm_campaign: input.utmCampaign ?? null,
    p_entity_type: input.entityType ?? null,
    p_entity_id: input.entityId ?? null,
    p_properties: input.properties ?? {},
    p_idempotency_key: input.idempotencyKey ?? null,
  });
  if (error) throw error;
  return data as string;
}

export async function recordServerGrowthEvent(eventName: GrowthEventName, input: Omit<GrowthEventInput, "eventName"> = {}) {
  return recordGrowthEvent({ ...input, eventName });
}

export async function safeRecordServerGrowthEvent(eventName: GrowthEventName, input: Omit<GrowthEventInput, "eventName"> = {}) {
  try {
    return await recordServerGrowthEvent(eventName, input);
  } catch (error) {
    console.error("[growth] event recording failed", { eventName, message: error instanceof Error ? error.message : String(error) });
    return null;
  }
}
