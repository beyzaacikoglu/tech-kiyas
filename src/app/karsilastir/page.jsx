"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { chargers } from "@/data/products";

export default function KarsilastirPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [copied, setCopied] = useState(false);

  const ids = useMemo(() => {
    const raw = sp.get("ids") || "";
    return raw.split(",").map((x) => x.trim()).filter(Boolean);
  }, [sp]);

  const items = useMemo(() => {
    const map = new Map(chargers.map((c) => [String(c.id), c]));
    return ids.map((id) => map.get(String(id))).filter(Boolean);
  }, [ids]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, [sp]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      window.prompt("Linki kopyala:", shareUrl);
    }
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Tech Kıyas - Karşılaştırma",
          text: "Şu karşılaştırmaya bak:",
          url: shareUrl,
        });
      } else {
        await copyLink();
      }
    } catch {}
  };

  const removeId = (id) => {
    const next = ids.filter((x) => String(x) !== String(id));
    if (next.length === 0) return router.push("/sarj-aletleri");
    router.push(`/karsilastir?ids=${encodeURIComponent(next.join(","))}`);
  };

  const clearAll = () => router.push("/sarj-aletleri");

  // En iyi değerleri vurgulamak için (kartlarda rozet)
  const best = useMemo(() => {
    if (!items.length) return {};
    const maxScore = Math.max(...items.map((x) => x.score ?? -Infinity));
    const maxPower = Math.max(...items.map((x) => x.powerW ?? -Infinity));
    const minPrice = Math.min(...items.map((x) => x.price ?? Infinity));
    return { maxScore, maxPower, minPrice };
  }, [items]);

  return (
    <div className="tk-page">
      <header className="tk-topbar">
        <div className="tk-topbar__inner">
          <div>
            <div className="tk-kicker">Tech Kıyas</div>
            <h1 className="tk-title">Karşılaştırma</h1>
            <p className="tk-sub">
              Seçtiğin ürünleri yan yana gör. En iyi değerler etiketlenir.
            </p>
          </div>

          <div className="tk-actions">
            <button className="tk-btn ghost" type="button" onClick={() => router.push("/sarj-aletleri")}>
              ← Liste
            </button>

            <button className="tk-btn ghost" type="button" onClick={copyLink}>
              {copied ? "✓ Kopyalandı" : "🔗 Linki Kopyala"}
            </button>

            <button className="tk-btn ghost" type="button" onClick={shareLink}>
              📤 Paylaş
            </button>

            <button className="tk-btn ghost" type="button" onClick={clearAll}>
              Temizle
            </button>
          </div>
        </div>
      </header>

      <main className="tk-shell">
        {items.length < 2 ? (
          <div className="tk-panel" style={{ maxWidth: 820, margin: "0 auto" }}>
            <div className="tk-panel__head">
              <div className="tk-panel__title">Karşılaştırma</div>
            </div>
            <div className="tk-hint">
              Karşılaştırmak için en az 2 ürün seçmelisin. <br />
              Şarj Aletleri sayfasından “+ Karşılaştır” ile ürün ekle.
            </div>

            <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
              <button className="tk-btn primary" onClick={() => router.push("/sarj-aletleri")}>
                Şarj Aletlerine Git →
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="tk-meta">
              <div>
                <b>{items.length}</b> ürün karşılaştırılıyor
              </div>
              <div className="tk-metaRight">
                <span className="tk-mini">
                  İpucu: En düşük fiyat / en yüksek güç / en yüksek puan rozetlenir.
                </span>
              </div>
            </div>

            {/* Kart grid: Şarj Aletleri sayfan gibi */}
            <div
              className="tk-grid"
              style={{
                gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, minmax(0, 1fr))`,
              }}
            >
              {items.map((p) => (
                <article key={p.id} className="tk-card">
                  <div className="tk-cardTop">
                    <div>
                      <div className="tk-brand">{p.brand}</div>
                      <div className="tk-name">{p.name}</div>
                    </div>

                    <div className="tk-score" title="Genel puan (demo)">
                      {Number(p.score).toFixed(1)}
                    </div>
                  </div>

                  {/* Öne çıkan rozetler */}
                  <div className="tk-tags" style={{ marginTop: 10 }}>
                    {p.price === best.minPrice && <span className="tk-tag">💰 En düşük fiyat</span>}
                    {p.powerW === best.maxPower && <span className="tk-tag">⚡ En yüksek güç</span>}
                    {p.score === best.maxScore && <span className="tk-tag">🏆 En iyi puan</span>}
                  </div>

                  <div className="tk-specs">
                    <div className="tk-spec">
                      <span>Güç</span>
                      <b>{p.powerW}W</b>
                    </div>
                    <div className="tk-spec">
                      <span>Port</span>
                      <b>{p.ports}</b>
                    </div>
                    <div className="tk-spec">
                      <span>PD</span>
                      <b>{p.pd ? "Var" : "Yok"}</b>
                    </div>
                    <div className="tk-spec">
                      <span>PPS</span>
                      <b>{p.pps ? "Var" : "Yok"}</b>
                    </div>
                    <div className="tk-spec">
                      <span>GaN</span>
                      <b>{p.gan ? "Var" : "Yok"}</b>
                    </div>
                  </div>

                  <div className="tk-tags">
                    {(p.tags || []).map((t) => (
                      <span key={t} className="tk-tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="tk-cardBottom">
                    <div className="tk-price">{p.price} TL</div>

                    <button className="tk-btn ghost" type="button" onClick={() => removeId(p.id)}>
                      ✕ Kaldır
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Alt aksiyon bar */}
            <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 10 }}>
              <button className="tk-btn ghost" type="button" onClick={clearAll}>
                Tümünü Temizle
              </button>
              <button className="tk-btn primary" type="button" onClick={() => router.push("/sarj-aletleri")}>
                Yeni Ürün Ekle →
              </button>
            </div>
          </>
        )}
      </main>

      {/* mobil: 2 kart yan yana yerine 1-2 ayarla */}
      <style jsx>{`
        @media (max-width: 920px) {
          .tk-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 560px) {
          .tk-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
