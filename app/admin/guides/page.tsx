import AdminGuideManager from "@/components/admin-guide-manager";
import { requireAdmin } from "@/lib/auth";

export default async function AdminGuidesPage() {
  await requireAdmin();
  return <section><h1 className="admin-title">Guides</h1><p className="admin-subtitle">Draft and publish sourcing guides. Only published guides are public.</p><AdminGuideManager /></section>;
}
