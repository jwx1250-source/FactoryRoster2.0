"use client";

import { useState } from "react";

export function ChecklistTools({ items }: { items: string[] }) {
  const [copied, setCopied] = useState(false);
  async function copyChecklist() {
    await navigator.clipboard.writeText(items.map((item) => `☐ ${item}`).join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return <div className="checklist-tools"><button type="button" onClick={copyChecklist}>{copied ? "Copied" : "Copy checklist"}</button><button type="button" onClick={() => window.print()}>Print checklist</button></div>;
}
