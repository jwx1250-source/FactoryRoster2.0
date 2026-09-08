import Link from "next/link";
import AdminResourceTable from "@/components/admin-resource-table";

const links = [
  ["Factories", "/admin/factories"],
  ["Contacts", "/admin/contacts"],
  ["Verification Records", "/admin/verification-records"],
  ["Verification Requests", "/admin/verification-requests"],
  ["Orders", "/admin/orders"],
  ["Guides", "/admin/guides"],
  ["Contact Messages", "/admin/contact-messages"],
] as const;

export function AdminNav() {
  return (
    <nav style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
      {links.map(([label, href]) => (
        <Link key={href} href={href} style={{ padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: 8, color: "#374151", textDecoration: "none", fontSize: 13 }}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AdminResourcePage({ resource }: { resource: string }) {
  return (
    <section>
      <h1 style={{ fontSize: 28, marginBottom: 10, textTransform: "capitalize" }}>{resource.replaceAll("-", " ")}</h1>
      <p style={{ color: "#6B7280", lineHeight: 1.6 }}>
        This protected workspace is backed by <code>/api/admin/{resource}</code>. Records are available only to users whose server-verified profile role is <code>admin</code>.
      </p>
      <AdminResourceTable resource={resource} />
    </section>
  );
}
