import { redirect } from "next/navigation";

import { AccessError, requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AccessError && error.status === 401) {
      redirect("/sign-in?next=/admin");
    }
    if (error instanceof AccessError && error.status === 403) {
      return (
        <main className="admin-denied">
          <div><p className="admin-kicker">403</p><h1>Access denied</h1><p>You do not have permission to access this page.</p></div>
        </main>
      );
    }
    throw error;
  }

  return (
    <main className="admin-root">
      <div className="admin-shell">
        <p className="admin-kicker">FACTORYROSTER ADMIN</p>
        <AdminNav />
        {children}
      </div>
    </main>
  );
}
