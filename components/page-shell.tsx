import type { ReactNode } from "react";

export function PageShell({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description: string; children?: ReactNode }) {
  return (
    <main>
      <section className="page-hero">
        <div className="shell narrow">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          <p className="page-lede">{description}</p>
        </div>
      </section>
      {children}
    </main>
  );
}
