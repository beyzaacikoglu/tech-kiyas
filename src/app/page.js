
"use client";
export default function Home() {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 36, fontWeight: 800 }}>
        Tech Kıyas
      </h1>

      <p style={{ marginTop: 8, color: "#555", maxWidth: 600 }}>
        Şarj aletleri, kablolar ve powerbank’leri teknik özelliklerine göre
        karşılaştır. Hangisi sana uygun, net gör.
      </p>

      <section style={{ marginTop: 40, display: "grid", gap: 16, maxWidth: 400 }}>
        <a href="/sarj-aletleri" style={cardStyle}>
          🔌 Şarj Aletleri
        </a>
        <div style={cardStyle}>🔗 Kablolar (yakında)</div>
        <div style={cardStyle}>🔋 Powerbank (yakında)</div>
      </section>
    </main>
  );
}

const cardStyle = {
  padding: 16,
  border: "1px solid #e5e5e5",
  borderRadius: 12,
  fontWeight: 600,
  textDecoration: "none",
  color: "inherit",
};
