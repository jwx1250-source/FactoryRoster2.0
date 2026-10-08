import { ZodError } from "zod";

import { MissingConfigurationError } from "@/lib/env";
import { AccessError } from "@/lib/auth";

export function apiError(error: unknown) {
  if (error instanceof AccessError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof MissingConfigurationError) {
    return Response.json(
      {
        error: error.message,
        code: "SERVICE_NOT_CONFIGURED",
        ...(error.missingKeys?.length ? { invalid_environment_variables: error.missingKeys } : {}),
      },
      { status: 503 },
    );
  }
  if (error instanceof ZodError) {
    return Response.json(
      { error: "Invalid request", code: "VALIDATION_ERROR", issues: error.issues },
      { status: 400 },
    );
  }
  if (error && typeof error === "object" && "type" in error && "message" in error) {
    const stripeError = error as { type?: unknown; code?: unknown; message?: unknown };
    if (stripeError.type === "StripeError" || typeof stripeError.code === "string") {
      return Response.json(
        {
          error: "Stripe payment provider error",
          code: "PAYMENT_PROVIDER_ERROR",
          detail: typeof stripeError.message === "string" ? stripeError.message : "Stripe API request failed",
        },
        { status: 502 },
      );
    }
  }
  if (error instanceof Error) {
    const status = error.message === "Authentication required" ? 401 : 500;
    return Response.json({ error: status === 500 ? "Internal server error" : error.message }, { status });
  }
  return Response.json({ error: "Internal server error" }, { status: 500 });
}

export function noStoreJson(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "private, no-store");
  return Response.json(data, { ...init, headers });
}
