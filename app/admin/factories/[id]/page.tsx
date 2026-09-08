export default async function FactoryAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <section>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>Factory record</h1>
      <p style={{ color: "#6B7280" }}>Editing record <code>{id}</code> through <code>PATCH /api/admin/factories/{id}</code>.</p>
    </section>
  );
}
