import Link from "next/link";
import AdminResourceTable from "@/components/admin-resource-table";

const links = [
  ["Dashboard", "/admin"],
  ["Factories", "/admin/factories"],
  ["Contacts", "/admin/contacts"],
  ["Verification Records", "/admin/verification-records"],
  ["Verification Requests", "/admin/verification-requests"],
  ["Guides", "/admin/guides"],
  ["Contact Messages", "/admin/contact-messages"],
  ["Users & Credits", "/admin/users"],
  ["Settings", "/admin/settings"],
] as const;

export function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {links.map(([label, href]) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminResourcePage({ resource }: { resource: string }) {
  return (
    <section>
      <h1 className="admin-title">{resource.replaceAll("-", " ")}</h1>
      <p className="admin-subtitle">Review and maintain protected operational records.</p>
      <AdminResourceTable resource={resource} />
    </section>
  );
}
