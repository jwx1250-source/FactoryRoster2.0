export default function NewFactoryPage() {
  return (
    <section>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>Create factory</h1>
      <p style={{ color: "#6B7280" }}>Create through the protected <code>POST /api/admin/factories</code> endpoint. Publication is rejected until all three verification records are verified.</p>
    </section>
  );
}
