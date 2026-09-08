import { Building2 } from "lucide-react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-mark" aria-label="FactoryRoster">
      <span className="brand-symbol" aria-hidden="true">
        <Building2 size={17} strokeWidth={2.2} />
      </span>
      {!compact && <span>FactoryRoster</span>}
    </span>
  );
}
