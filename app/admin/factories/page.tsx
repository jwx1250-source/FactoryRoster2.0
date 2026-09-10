import Link from "next/link";

import AdminFactoryList from "@/components/admin-factory-list";
import { requireAdmin } from "@/lib/auth";

export default async function AdminFactoriesPage() {
  await requireAdmin();
  return <section><div className="admin-heading"><div><h1 className="admin-title">Suppliers</h1><p className="admin-subtitle">Search, review, verify and publish supplier profiles.</p></div><Link className="admin-primary" href="/admin/factories/new">Add supplier</Link></div><AdminFactoryList /></section>;
}
