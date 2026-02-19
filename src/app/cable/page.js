"use client";

import { useMemo, useState } from "react";
import { cables } from "@/data/products";

export default function CablePage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("Hepsi");
  const [pd, setPd] = useState("Hepsi");
  const [eMarker, setEMarker] = useState("Hepsi");
  const [braided, setBraided] = useState("Hepsi");
  const [minW, setMinW] = useState("Hepsi");
  const [maxPrice, setMaxPrice] = useState("Hepsi");
  const [length, setLength] = useState("Hepsi");
  const [selected, setSelected] = useState([]); // max 2 id

  const compareHref =
    selected.length === 2
      ? `/cable-karsilastir?ids=${selected[0]},${selected[1]}`
      : "#";

  const typeOptions = useMemo(() => {
    const uniq = Array.from(new Set(cables.map((c) => c.type))).sort();
    return ["Hepsi", ...uniq];
  }, []);

  const minWOptions = useMemo(() => {
    const uniq = Array.from(new Set(cables.map((c) => c.maxPowerW))).sort((a, b) => a - b);
    return ["Hepsi", ...uniq.map(String)];
  }, []);

  const lengthOptions = useMemo(() => {
    const uniq = Array.from(new Set(cables.map((c) => c.lengthM))).sort((a, b) => a - b);
    return ["Hepsi", ...uniq.map(String)];
  }, []);

  const priceOptions = ["Hepsi", "200", "300", "400", "500", "750", "1000", "1500"];

  const filtered = useMemo(() => {
    return cables
      .filter((c) => {
        const text = `${c.brand} ${c.name} ${c.type} ${(c.tags || []).join(" ")}`.toLowerCase();
        const okQ = q.trim() ? text.includes(q.trim().toLowerCase()) : true;

        const okType = type === "Hepsi" ? true : c.type === type;
        const okPd = pd === "Hepsi" ? true : pd === "Evet" ? c.pd === true : c.pd === false;
        const okEM =
          eMarker === "Hepsi" ? true : eMarker === "Evet" ? c.eMarker === true : c.eMarker === false;
        const okBr =
          braided === "Hepsi" ? true : braided === "Evet" ? c.braided === true : c.braided === false;

        const okMinW = minW === "Hepsi" ? true : c.maxPowerW >= Number(minW);
        const okPrice = maxPrice === "Hepsi" ? true : c.price <= Number(maxPrice);
        const okLen = length === "Hepsi" ? true : c.lengthM === Number(length);

        return okQ && okType && okPd && okEM && okBr && okMinW && okPrice && okLen;
      })
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }, [q, type, pd, eMarker, braided, minW, maxPrice, length]);

  function toggleSelect(id) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  }

  function clearFilters() {
    setQ("");
    setType("Hepsi");
    setPd("Hepsi");
    setEMarker("Hepsi");
    setBraided("Hepsi");
    setMinW("Hepsi");
    setMaxPrice("Hepsi");
    setLength("Hepsi");
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.badge}>Kablolar</div>
        <h1 style={styles.h1}>Kablo Karşılaştırma</h1>
        <p style={styles.p}>Filtrele, 2 kablo seç, karşılaştır.</p>
      </header>

      <section style={styles.filters}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ara: marka, model, type..."
          style={styles.search}
        />

        <Select label="Type" value={type} onChange={setType} options={typeOptions} />
        <Select label="PD" value={pd} onChange={setPd} options={["Hepsi", "Evet", "Hayır"]} />
        <Select label="E-Marker" value={eMarker} onChange={setEMarker} options={["Hepsi", "Evet", "Hayır"]} />
        <Select label="Örgülü" value={braided} onChange={setBraided} options={["Hepsi", "Evet", "Hayır"]} />
        <Select label="Min Watt" value={minW} onChange={setMinW} options={minWOptions} />
        <Select label="Max Fiyat" value={maxPrice} onChange={setMaxPrice} options={priceOptions} />
        <Select label="Uzunluk (m)" value={length} onChange={setLength} options={lengthOptions} />
      </section>

      <section style={styles.toolbar}>
        <div style={styles.selectedInfo}>
          Seçilen: <b>{selected.length}/2</b>{" "}
          <span style={{ opacity: 0.8 }}>{selected.length === 2 ? "Hazır ✅" : "2 ürün seç"}</span>
        </div>

        <div style={styles.toolbarRight}>
          <button onClick={clearFilters} style={styles.ghostBtn}>
            Filtreleri Sıfırla
          </button>

          <a
            href={compareHref}
            style={{
              ...styles.compareBtn,
              opacity: selected.length === 2 ? 1 : 0.45,
              pointerEvents: selected.length === 2 ? "auto" : "none",
            }}
          >
            Karşılaştır →
          </a>
        </div>
      </section>

      <section style={styles.grid}>
        {filtered.map((c) => {
          const isSel = selected.includes(c.id);

          return (
            <div
              key={c.id}
              style={{
                ...styles.card,
                outline: isSel ? "2px solid rgba(234,240,255,0.55)" : "none",
                background: isSel ? "rgba(255,255,255,0.10)" : styles.card.background,
              }}
            >
              <div style={styles.cardTop}>
                <div>
                  <div style={styles.name}>{c.name}</div>
                  <div style={styles.sub}>
                    {c.brand} • {c.type}
                  </div>
                </div>

                <div style={styles.rightTop}>
                  <div style={styles.price}>{c.price} TL</div>
                  <div style={styles.scorePill}>Skor {c.score}</div>
                </div>
              </div>

              <div style={styles.meta}>
                <Tag>{c.maxPowerW}W</Tag>
                <Tag>{c.lengthM}m</Tag>
                <Tag>{c.pd ? "PD" : "PD Yok"}</Tag>
                <Tag>{c.eMarker ? "E-Marker" : "E-Marker Yok"}</Tag>
                <Tag>{c.braided ? "Örgülü" : "Klasik"}</Tag>
              </div>

              <div style={styles.bottomRow}>
                <div style={{ opacity: 0.85, fontSize: 12 }}>
                  {(c.tags || []).slice(0, 3).join(" • ")}
                </div>

                <button
                  onClick={() => toggleSelect(c.id)}
                  style={{
                    ...styles.selectBtn,
                    background: isSel ? "rgba(234,240,255,0.18)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  {isSel ? "Seçildi ✓" : "Seç"}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label style={styles.selectWrap}>
      <span style={styles.selectLabel}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.select}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Tag({ children }) {
  return <span style={styles.tag}>{children}</span>;
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "48px 20px",
    background:
      "radial-gradient(1200px 700px at 20% 10%, rgba(255,255,255,0.10), rgba(0,0,0,0) 60%), linear-gradient(180deg, #0b1220 0%, #070b14 100%)",
    color: "#eaf0ff",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  header: { maxWidth: 1100, margin: "0 auto 18px auto" },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    fontSize: 12,
  },
  h1: { margin: "14px 0 8px 0", fontSize: 40, lineHeight: 1.05 },
  p: { margin: 0, opacity: 0.9, maxWidth: 820 },

  filters: {
    maxWidth: 1100,
    margin: "18px auto 0 auto",
    display: "grid",
    gridTemplateColumns: "1.6fr repeat(7, minmax(120px, 1fr))",
    gap: 10,
  },
  search: {
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#eaf0ff",
    outline: "none",
  },
  selectWrap: { display: "grid", gap: 6 },
  selectLabel: { fontSize: 12, opacity: 0.85, paddingLeft: 6 },
  select: {
    padding: "11px 10px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#eaf0ff",
    outline: "none",
  },

  toolbar: {
    maxWidth: 1100,
    margin: "14px auto 0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  selectedInfo: { opacity: 0.95 },
  toolbarRight: { display: "flex", gap: 10, alignItems: "center" },
  ghostBtn: {
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 14,
    padding: "10px 12px",
    background: "rgba(255,255,255,0.06)",
    color: "#eaf0ff",
    cursor: "pointer",
    fontWeight: 700,
  },
  compareBtn: {
    textDecoration: "none",
    color: "#eaf0ff",
    fontWeight: 900,
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.10)",
  },

  grid: {
    maxWidth: 1100,
    margin: "14px auto 0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 12,
  },

  card: {
    padding: 16,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  cardTop: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" },
  name: { fontSize: 15, fontWeight: 900, lineHeight: 1.3 },
  sub: { fontSize: 12, opacity: 0.85, marginTop: 6 },
  rightTop: { display: "grid", justifyItems: "end", gap: 8 },
  price: { fontSize: 14, fontWeight: 900, opacity: 0.98 },
  scorePill: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    opacity: 0.95,
  },

  meta: { marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 },
  tag: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
  },

  bottomRow: { marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 },
  selectBtn: {
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 14,
    padding: "9px 12px",
    color: "#eaf0ff",
    cursor: "pointer",
    fontWeight: 900,
  },
};
