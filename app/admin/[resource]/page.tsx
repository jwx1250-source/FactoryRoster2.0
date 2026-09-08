import { notFound } from "next/navigation";

import { AdminResourcePage } from "@/components/admin-shell";
import { getAdminResource } from "@/lib/admin-resources";

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!getAdminResource(resource)) notFound();
  return <AdminResourcePage resource={resource} />;
}
