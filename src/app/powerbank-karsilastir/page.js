"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PowerbankKarsilastirPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =============================
     SHARE / COPY LOGIC
  ============================= */
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Linki kopyala:", shareUrl);
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Tech Kıyas – Powerbank Karşılaştırma",
          url: shareUrl,
        });
      } catch {}
    } else {
      copyLink();
    }
  };

  /* =============================
     IDS
  ============================= */
  const ids = searchParams.get("ids")?.split(",") ?? [];

  /* =============================
     MOCK DATA (sonra gerçek data
     ile bağlanacak)
  ============================= */
  const products = [
    {
      id: "1",
      brand: "Anker",
      name: "Anker 20000 PD",
      score: 8.6,
      capacity: "20000 mAh",
      output: "20W",
      ports: "1x USB-C + 1x USB-A",
      pd: "Var",
      pps: "Yok",
      price: "1499 TL",
    },
    {
      id: "2",
      brand: "Spigen",
      name: "Spigen 10000 20W",
      score: 8.8,
      capacity: "10000 mAh",
      output: "20W",
      ports: "1x USB-C + 1x USB-A",
      pd: "Var",
      pps: "Var",
      price: "1199 TL",
    },
  ].filter((p) => ids.includes(p.id));

  /* =============================
     RENDER
  ============================= */
  return (
    <div className="tk-page">
      {/* ================= TOPBAR ================= */}
      <div className="tk-topbar">
        <div className="tk-topbar__inner">
          <div>
            <div className="tk-kicker">TECH KIYAS</div>
            <h1 className="tk-title">Powerbank Karşılaştırma</h1>
            <p className="tk-sub">
              Seçtiklerini masaüstü görünümünde yan yana karşılaştır.
            </p>
          </div>

          <div className="tk-actions">
            <button className="tk-btn ghost" onClick={() => router.back()}>
              ← Geri
            </button>

            <button className="tk-btn ghost" onClick={copyLink}>
              {copied ? "✓ Kopyalandı" : "🔗 Linki Kopyala"}
            </button>

            <button className="tk-btn ghost" onClick={shareLink}>
              📤 Paylaş
            </button>

            <button
              className="tk-btn ghost"
              onClick={() => router.push("/powerbank")}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="tk-shell">
        <div className="tk-main">
          {/* 🔥 DEĞİŞEN TEK YER BURASI */}
          <div className="tk-compareGrid">
            {products.map((p) => (
              <div key={p.id} className="tk-compareCard">
                <div className="tk-cardTop">
                  <div>
                    <div className="tk-brand">{p.brand}</div>
                    <div className="tk-name">{p.name}</div>
                  </div>
                  <div className="tk-score">{p.score}</div>
                </div>

                <div className="tk-specs">
                  <div className="tk-spec">
                    <span>Kapasite</span>
                    <b>{p.capacity}</b>
                  </div>
                  <div className="tk-spec">
                    <span>Çıkış</span>
                    <b>{p.output}</b>
                  </div>
                  <div className="tk-spec">
                    <span>Port</span>
                    <b>{p.ports}</b>
                  </div>
                  <div className="tk-spec">
                    <span>PD</span>
                    <b>{p.pd}</b>
                  </div>
                  <div className="tk-spec">
                    <span>PPS</span>
                    <b>{p.pps}</b>
                  </div>
                </div>

                <div className="tk-cardBottom">
                  <div className="tk-price">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
          {/* 🔥 DEĞİŞEN TEK YER BURASI */}
        </div>
      </div>
    </div>
  );
}
