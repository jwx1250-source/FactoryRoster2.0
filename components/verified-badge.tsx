import { Check } from "lucide-react";

export function VerifiedBadge({ label }: { label: string }) {
  return <span className="verified-badge"><Check size={13} strokeWidth={2.4} />{label}</span>;
}
