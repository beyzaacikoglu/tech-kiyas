"use client";

import { useRouter } from "next/navigation";

export default function AksesuarlarPage() {
  const router = useRouter();

  const cards = [
    {
      title: "Kablolar",
      desc: "USB-C, Lightning, örgü, hızlı şarj… Filtrele ve kıyasla.",
      icon: "🔌",
      href: "/kablolar",
    },
    {
      title: "Şarj Aletleri",
      desc: "GaN, PPS, çoklu port, laptop uyumlu… Net gör.",
      icon: "⚡",
      href: "/sarj-aletleri",
    },
    {
      title: "Powerbank",
      desc: "mAh, PD, PPS, çıkış gücü, ağırlık… En uygunu seç.",
      icon: "🔋",
      href: "/powerbank",
    },
  ];

  return (
    <div className="tk-page">
      <header className="tk-topbar">
        <div className="tk-topbar__inner">
          <div>
            <div className="tk-kicker">Tech Kıyas</div>
            <h1 className="tk-title">Aksesuarlar</h1>
            <p className="tk-sub">Kategori seç, filtrele, kıyasla.</p>
          </div>
        </div>
      </header>

      <main className="tk-shell" style={{ paddingTop: 24 }}>
        <div className="tk-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          {cards.map((c) => (
            <button
              key={c.title}
              type="button"
              className="tk-card"
              style={{ textAlign: "left", cursor: "pointer" }}
              onClick={() => router.push(c.href)}
            >
              <div className="tk-cardTop" style={{ alignItems: "center" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 28 }}>{c.icon}</div>
                  <div>
                    <div className="tk-name" style={{ fontSize: 18 }}>{c.title}</div>
                    <div className="tk-sub" style={{ marginTop: 6, opacity: 0.8 }}>{c.desc}</div>
                  </div>
                </div>
                <div className="tk-score" title="Git" style={{ fontSize: 16 }}>→</div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
