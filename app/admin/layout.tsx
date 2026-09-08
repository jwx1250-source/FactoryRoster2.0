import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/sign-in?next=/admin");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#F7F8FA", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", background: "white", border: "1px solid #E5E7EB", borderRadius: 12, padding: 28 }}>
        <p style={{ fontFamily: "monospace", fontSize: 11, color: "#1E40AF", marginBottom: 8 }}>FACTORYROSTER ADMIN</p>
        <AdminNav />
        {children}
      </div>
    </main>
  );
}
