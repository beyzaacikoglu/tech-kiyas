"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { cables } from "@/data/products";

export default function CableComparePage() {
  const sp = useSearchParams();
  const idsParam = sp.get("ids") || "";
  const ids = idsParam.split(",").map((x) => x.trim()).filter(Boolean);

  const selected = useMemo(() => {
    return ids.map((id) => cables.find((c) => c.id === id)).filter(Boolean);
  }, [idsParam]);

  const [a, b] = selected;
  const winner = selected.length === 2 ? getWinner(a, b) : null;

  // Sayfa URL’si (share/copy için)
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}${window.location.search}`
      : "";

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.badge}>Kablolar</div>
        <h1 style={styles.h1}>Kablo Karşılaştırma</h1>
        <p style={styles.p}>
          Örnek: <code style={styles.code}>/cable-karsilastir?ids=c1,c2</code>
        </p>

        {/* ✅ Paylaş Bar */}
        <ShareBar url={shareUrl} />
      </header>

      {selected.length !== 2 ? (
        <div style={styles.empty}>
          <div style={styles.emptyTitle}>2 kablo seçmen gerekiyor</div>
          <div style={styles.emptyText}>
            Kablo sayfasına dön:{" "}
            <a href="/cable" style={styles.link}>
              /cable
            </a>
          </div>
          <div style={{ marginTop: 12, opacity: 0.85 }}>
            Gelen ids: <code style={styles.code}>{idsParam || "(boş)"}</code>
          </div>
        </div>
      ) : (
        <>
          <section style={styles.topCards}>
            <ProductCard item={a} isWinner={winner?.id === a.id} reason={winner?.reason} />
            <ProductCard item={b} isWinner={winner?.id === b.id} reason={winner?.reason} />
          </section>

          <section style={styles.tableWrap}>
            <div style={styles.tableTitle}>Detay Karşılaştırma</div>

            <div style={styles.table}>
              <Row label="Marka" a={a.brand} b={b.brand} />
              <Row label="Model" a={a.name} b={b.name} />
              <Row label="Tip" a={a.type} b={b.type} />
              <Row label="Maks Güç" a={`${a.maxPowerW}W`} b={`${b.maxPowerW}W`} highlight />
              <Row label="PD" a={yesNo(a.pd)} b={yesNo(b.pd)} />
              <Row label="E-Marker" a={yesNo(a.eMarker)} b={yesNo(b.eMarker)} />
              <Row label="Uzunluk" a={`${a.lengthM} m`} b={`${b.lengthM} m`} />
              <Row label="Örgülü" a={yesNo(a.braided)} b={yesNo(b.braided)} />
              <Row label="Fiyat" a={`${a.price} TL`} b={`${b.price} TL`} highlight />
              <Row label="Skor" a={a.score} b={b.score} highlight />
              <Row label="Etiketler" a={(a.tags || []).join(", ")} b={(b.tags || []).join(", ")} />
            </div>

            <div style={styles.summary}>
              <Summary a={a} b={b} winner={winner} />
            </div>

            <div style={styles.actions}>
              <a href="/cable" style={styles.backBtn}>← Kablo listesine dön</a>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function ShareBar({ url }) {
  const [copied, setCopied] = useState(false);

  const message = `Kablo karşılaştırma: ${url}`;
  const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const xLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // Clipboard izin vermezse fallback:
      window.prompt("Linki kopyala:", url);
    }
  }

  async function nativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Kablo Karşılaştırma",
          text: "Kablo karşılaştırma linki",
          url,
        });
      } else {
        copyLink();
      }
    } catch (e) {
      // kullanıcı iptal ederse sorun değil
    }
  }

  return (
    <div style={styles.shareBar}>
      <button onClick={copyLink} style={styles.shareBtn}>
        {copied ? "Kopyalandı ✓" : "Linki Kopyala"}
      </button>

      <a href={waLink} target="_blank" rel="noreferrer" style={{ ...styles.shareBtn, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        WhatsApp’ta Paylaş
      </a>

      <a href={xLink} target="_blank" rel="noreferrer" style={{ ...styles.shareBtn, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        X’te Paylaş
      </a>

      <button onClick={nativeShare} style={styles.shareBtnSoft}>
        Paylaş…
      </button>
    </div>
  );
}

function ProductCard({ item, isWinner, reason }) {
  return (
    <div
      style={{
        ...styles.card,
        outline: isWinner ? "2px solid rgba(107, 255, 180, 0.65)" : "1px solid rgba(255,255,255,0.14)",
        background: isWinner ? "rgba(107, 255, 180, 0.08)" : styles.card.background,
      }}
    >
      <div style={styles.cardHeader}>
        <div>
          <div style={styles.cardName}>{item.name}</div>
          <div style={styles.cardSub}>
            {item.brand} • {item.type}
          </div>
        </div>

        {isWinner ? <div style={styles.winPill}>Öneri ✓</div> : <div style={styles.grayPill}>Aday</div>}
      </div>

      <div style={styles.chips}>
        <Chip>{item.maxPowerW}W</Chip>
        <Chip>{item.lengthM}m</Chip>
        <Chip>{item.pd ? "PD" : "PD Yok"}</Chip>
        <Chip>{item.eMarker ? "E-Marker" : "E-Marker Yok"}</Chip>
        <Chip>{item.braided ? "Örgülü" : "Klasik"}</Chip>
      </div>

      <div style={styles.cardBottom}>
        <div style={styles.cardPrice}>{item.price} TL</div>
        <div style={styles.cardScore}>
          Skor: <b>{item.score}</b>
        </div>
      </div>

      {isWinner && reason && (
        <div style={styles.reason}>
          <b>Neden bu?</b> {reason}
        </div>
      )}
    </div>
  );
}

function Row({ label, a, b, highlight = false }) {
  return (
    <div style={styles.row}>
      <div style={styles.cellLabel}>{label}</div>
      <div style={{ ...styles.cell, ...(highlight ? styles.cellHi : null) }}>{a}</div>
      <div style={{ ...styles.cell, ...(highlight ? styles.cellHi : null) }}>{b}</div>
    </div>
  );
}

function Summary({ a, b, winner }) {
  const betterScore = a.score === b.score ? "Berabere" : a.score > b.score ? a.name : b.name;
  const cheaper = a.price === b.price ? "Fiyat aynı" : a.price < b.price ? a.name : b.name;
  const higherW = a.maxPowerW === b.maxPowerW ? "Güç aynı" : a.maxPowerW > b.maxPowerW ? a.name : b.name;

  return (
    <div>
      <div style={styles.summaryTitle}>Hızlı Özet</div>
      <ul style={styles.ul}>
        <li><b>Skor:</b> {betterScore}</li>
        <li><b>Fiyat avantajı:</b> {cheaper}</li>
        <li><b>Güç (W):</b> {higherW}</li>
        <li><b>Öneri:</b> {winner?.id ? `${winner.name} (${winner.reasonShort})` : "-"}</li>
      </ul>
    </div>
  );
}

function Chip({ children }) {
  return <span style={styles.chip}>{children}</span>;
}

function yesNo(v) {
  return v ? "Evet" : "Hayır";
}

function getWinner(a, b) {
  const scoreA =
    (a.score ?? 0) * 10 +
    (a.maxPowerW ?? 0) * 0.08 +
    (a.eMarker ? 2 : 0) +
    (a.pd ? 1 : 0) -
    (a.price ?? 0) * 0.003;

  const scoreB =
    (b.score ?? 0) * 10 +
    (b.maxPowerW ?? 0) * 0.08 +
    (b.eMarker ? 2 : 0) +
    (b.pd ? 1 : 0) -
    (b.price ?? 0) * 0.003;

  if (scoreA === scoreB) {
    return {
      id: a.id,
      name: a.name,
      reasonShort: "Dengeli",
      reason: "İki ürün çok yakın. Filtrelere göre karar ver (W, fiyat, E-Marker).",
    };
  }

  const win = scoreA > scoreB ? a : b;

  let reason = "Genel olarak daha dengeli fiyat/performans.";
  if (win.maxPowerW >= 100) reason = "Yüksek güç (100W) ve laptop uyumu daha güçlü.";
  else if (win.price < (win === a ? b.price : a.price)) reason = "Daha uygun fiyatla benzer özellikler sunuyor.";
  else if (win.eMarker) reason = "E-Marker desteği yüksek watt için daha güvenli ve stabil.";

  return {
    id: win.id,
    name: win.name,
    reasonShort: "F/P",
    reason,
  };
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
  code: {
    padding: "3px 8px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
  },

  // ✅ share bar
  shareBar: {
    marginTop: 14,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  shareBtn: {
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.10)",
    color: "#eaf0ff",
    fontWeight: 900,
    padding: "10px 14px",
    borderRadius: 14,
  },
  shareBtnSoft: {
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#eaf0ff",
    fontWeight: 900,
    padding: "10px 14px",
    borderRadius: 14,
  },

  empty: {
    maxWidth: 1100,
    margin: "22px auto 0 auto",
    padding: 18,
    borderRadius: 18,
    border: "1px dashed rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.04)",
  },
  emptyTitle: { fontSize: 16, fontWeight: 900 },
  emptyText: { marginTop: 8, opacity: 0.9 },
  link: { color: "#eaf0ff", fontWeight: 900 },

  topCards: {
    maxWidth: 1100,
    margin: "18px auto 0 auto",
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
  cardHeader: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" },
  cardName: { fontSize: 15, fontWeight: 900, lineHeight: 1.3 },
  cardSub: { fontSize: 12, opacity: 0.85, marginTop: 6 },
  winPill: {
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(107, 255, 180, 0.35)",
    background: "rgba(107, 255, 180, 0.12)",
  },
  grayPill: {
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    opacity: 0.9,
  },

  chips: { marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 },
  chip: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
  },
  cardBottom: { marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" },
  cardPrice: { fontSize: 14, fontWeight: 900 },
  cardScore: { fontSize: 13, opacity: 0.95 },

  reason: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(107, 255, 180, 0.22)",
    background: "rgba(107, 255, 180, 0.08)",
    fontSize: 13,
    lineHeight: 1.55,
    opacity: 0.95,
  },

  tableWrap: {
    maxWidth: 1100,
    margin: "14px auto 0 auto",
    padding: 16,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
  },
  tableTitle: { fontSize: 14, fontWeight: 900, marginBottom: 10 },
  table: { display: "grid", gap: 8 },
  row: {
    display: "grid",
    gridTemplateColumns: "160px 1fr 1fr",
    gap: 10,
    alignItems: "stretch",
  },
  cellLabel: { fontSize: 12, opacity: 0.85, padding: "10px 10px" },
  cell: {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.12)",
    fontSize: 13,
  },
  cellHi: { background: "rgba(255,255,255,0.08)" },

  summary: { marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.14)" },
  summaryTitle: { fontWeight: 900, marginBottom: 6 },
  ul: { margin: 0, paddingLeft: 18, opacity: 0.95, lineHeight: 1.7 },

  actions: { marginTop: 14, display: "flex", justifyContent: "flex-end" },
  backBtn: {
    textDecoration: "none",
    color: "#eaf0ff",
    fontWeight: 900,
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.10)",
  },
};
