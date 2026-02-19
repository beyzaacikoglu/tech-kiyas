"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { chargers } from "@/data/products";

const yesNo = (v) => (v ? "Var" : "Yok");

export default function ComparePage() {
  const router = useRouter();
  const sp = useSearchParams();

  const ids = useMemo(() => {
    const raw = sp.get("ids") || "";
    return raw
      .split(",")
      .map((x) => Number(x.trim()))
      .filter((n) => Number.isFinite(n));
  }, [sp]);

  const items = useMemo(() => {
    const map = new Map(chargers.map((c) => [c.id, c]));
    return ids.map((id) => map.get(id)).filter(Boolean);
  }, [ids]);

  if (items.length === 0) {
    return (
      <div className="tk-page" style={{ padding: 24 }}>
        <h1 className="tk-title">Karşılaştır</h1>
        <p className="tk-sub">Karşılaştırmak için önce ürün seçmelisin.</p>
        <button className="tk-btn primary" onClick={() => router.push("/sarj-aletleri")}>
          Şarj Aletlerine Dön
        </button>
      </div>
    );
  }

  const rows = [
    { label: "Marka", key: "brand" },
    { label: "Model", key: "name" },
    { label: "Fiyat", render: (p) => `${Number(p.price).toLocaleString("tr-TR")} TL` },
    { label: "Skor", render: (p) => p.score ?? "—" },
    { label: "Güç", render: (p) => `${p.watt ?? "—"}W` },
    { label: "Port", render: (p) => p.ports ?? "—" },
    { label: "PD", render: (p) => yesNo(p.pd) },
    { label: "PPS", render: (p) => yesNo(p.pps) },
    { label: "GaN", render: (p) => yesNo(p.gan) },
  ];

  return (
    <div className="tk-page">
      <header className="tk-topbar">
        <div className="tk-topbar__inner">
          <div>
            <div className="tk-kicker">Tech Kıyas</div>
            <h1 className="tk-title">Karşılaştırma</h1>
            <p className="tk-sub">{items.length} ürün yan yana</p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="tk-btn ghost" onClick={() => router.push("/sarj-aletleri")}>
              Geri Dön
            </button>
            <button className="tk-btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>
              Linki Kopyala
            </button>
          </div>
        </div>
      </header>

      <div className="tk-shell" style={{ gridTemplateColumns: "1fr" }}>
        <main className="tk-main">
          <div className="tk-compareTableWrap">
            <table className="tk-compareTable">
              <thead>
                <tr>
                  <th>Özellik</th>
                  {items.map((p) => (
                    <th key={p.id}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ fontSize: 12, opacity: 0.75 }}>{p.brand}</div>
                        <div style={{ fontWeight: 850 }}>{p.name}</div>
                        <div className="tk-score" style={{ width: "fit-content" }}>
                          {p.score ?? "—"}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((r, idx) => (
                  <tr key={idx}>
                    <td className="tk-compareKey">{r.label}</td>
                    {items.map((p) => (
                      <td key={p.id} className="tk-compareVal">
                        {r.render ? r.render(p) : p[r.key] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}

                <tr>
                  <td className="tk-compareKey">Etiketler</td>
                  {items.map((p) => (
                    <td key={p.id} className="tk-compareVal">
                      <div className="tk-tags">
                        {(p.tags ?? []).slice(0, 8).map((t, i) => (
                          <span className="tk-tag" key={i}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
