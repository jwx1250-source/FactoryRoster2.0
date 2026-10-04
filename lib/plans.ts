export const PLAN_CATALOG = {
  starter: { name: "Starter", credits: 3, amountUsd: 9.9, mode: "payment" },
  buyer: { name: "Buyer", credits: 15, amountUsd: 29.9, mode: "payment" },
  pro: { name: "Pro", credits: 60, amountUsd: 99, mode: "payment" },
} as const;

export type PlanSlug = keyof typeof PLAN_CATALOG;

export function isPlanSlug(value: string): value is PlanSlug {
  return Object.hasOwn(PLAN_CATALOG, value);
}
