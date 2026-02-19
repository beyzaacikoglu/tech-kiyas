"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { chargers, brands, powerOptions } from "@/data/products";

export default function SarjAletleriPage() {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("Tümü");
  const [minW, setMinW] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [onlyGan, setOnlyGan] = useState(false);
  const [onlyPps, setOnlyPps] = useState(false);
  const [sort, setSort] = useState("score_desc");
  const [compare, setCompare] = useState([]); // id list (max 3)

  const filtered = useMemo(() => {
    let list = [...chargers];

    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s) ||
          p.ports.toLowerCase().includes(s)
      );
    }

    if (brand !== "Tümü") list = list.filter((p) => p.brand === brand);
    if (minW > 0) list = list.filter((p) => p.powerW >= minW);
    if (maxPrice < 99999) list = list.filter((p) => p.price <= maxPrice);
    if (onlyGan) list = list.filter((p) => p.gan);
    if (onlyPps) list = list.filter((p) => p.pps);

    switch (sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "power_desc":
        list.sort((a, b) => b.powerW - a.powerW);
        break;
      case "score_desc":
      default:
        list.sort((a, b) => b.score - a.score);
        break;
    }

    return list;
  }, [q, brand, minW, maxPrice, onlyGan, onlyPps, sort]);

  const compareItems = useMemo(
    () => chargers.filter((c) => compare.includes(c.id)),
    [compare]
  );

  const toggleCompare = (id) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
  };

  const resetFilters = () => {
    setQ("");
    setBrand("Tümü");
    setMinW(0);
    setMaxPrice(99999);
    setOnlyGan(false);
    setOnlyPps(false);
    setSort("score_desc");
  };

  const goComparePage = () => {
    const ids = compare.join(",");
    router.push(`/karsilastir?ids=${encodeURIComponent(ids)}`);
  };

  return (
    <div className="tk-page">
      <header className="tk-topbar">
        <div className="tk-topbar__inner">
          <div>
            <div className="tk-kicker">Tech Kıyas</div>
            <h1 className="tk-title">Şarj Aletleri</h1>
            <p className="tk-sub">Filtrele, sırala, karşılaştır. Özelliklere göre “net gör”.</p>
          </div>

          <div className="tk-actions">
            <div className="tk-search">
              <span className="tk-ico">🔎</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Model/marka/port ara… (örn: Spigen, 65W, USB-C)"
              />
            </div>

            <select
              className="tk-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sırala"
            >
              <option value="score_desc">En iyi puan</option>
              <option value="price_asc">Fiyat: düşük → yüksek</option>
              <option value="price_desc">Fiyat: yüksek → düşük</option>
              <option value="power_desc">Güç: yüksek → düşük</option>
            </select>
          </div>
        </div>
      </header>

      <div className="tk-shell">
        <aside className="tk-panel">
          <div className="tk-panel__head">
            <div className="tk-panel__title">Filtreler</div>
            <button className="tk-link" type="button" onClick={resetFilters}>Sıfırla</button>
          </div>

          <div className="tk-group">
            <div className="tk-label">Marka</div>
            <select
              className="tk-select full"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="Tümü">Tümü</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="tk-group">
            <div className="tk-label">Minimum Güç (W)</div>
            <div className="tk-chips">
              <button
                type="button"
                className={`tk-chip ${minW === 0 ? "on" : ""}`}
                onClick={() => setMinW(0)}
              >
                Farketmez
              </button>
              {powerOptions.map((w) => (
                <button
                  type="button"
                  key={w}
                  className={`tk-chip ${minW === w ? "on" : ""}`}
                  onClick={() => setMinW(w)}
                >
                  {w}W+
                </button>
              ))}
            </div>
          </div>

          <div className="tk-group">
            <div className="tk-label">Maksimum Fiyat</div>
            <div className="tk-rangeRow">
              <input
                type="range"
                min={200}
                max={3000}
                step={50}
                value={Math.min(maxPrice, 3000)}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
              <div className="tk-badge">{maxPrice >= 99999 ? "∞" : `${maxPrice} TL`}</div>
            </div>
          </div>

          <div className="tk-group">
            <label className="tk-check">
              <input
                type="checkbox"
                checked={onlyGan}
                onChange={(e) => setOnlyGan(e.target.checked)}
              />
              <span>GaN olsun</span>
            </label>

            <label className="tk-check">
              <input
                type="checkbox"
                checked={onlyPps}
                onChange={(e) => setOnlyPps(e.target.checked)}
              />
              <span>PPS olsun</span>
            </label>
          </div>

          <div className="tk-hint">
            İpucu: 65W+ ve PPS seçersen laptop + hızlı şarj uyumluluğu artar.
          </div>
        </aside>

        <main className="tk-main">
          <div className="tk-meta">
            <div><b>{filtered.length}</b> sonuç</div>
            <div className="tk-metaRight">
              <span className="tk-mini">Karşılaştır: <b>{compare.length}/3</b></span>
            </div>
          </div>

          <div className="tk-grid">
            {filtered.map((p) => {
              const selected = compare.includes(p.id);
              return (
                <article key={p.id} className="tk-card">
                  <div className="tk-cardTop">
                    <div>
                      <div className="tk-brand">{p.brand}</div>
                      <div className="tk-name">{p.name}</div>
                    </div>
                    <div className="tk-score">{p.score.toFixed(1)}</div>
                  </div>

                  <div className="tk-specs">
                    <div className="tk-spec"><span>Güç</span><b>{p.powerW}W</b></div>
                    <div className="tk-spec"><span>Port</span><b>{p.ports}</b></div>
                    <div className="tk-spec"><span>PD</span><b>{p.pd ? "Var" : "Yok"}</b></div>
                    <div className="tk-spec"><span>PPS</span><b>{p.pps ? "Var" : "Yok"}</b></div>
                    <div className="tk-spec"><span>GaN</span><b>{p.gan ? "Var" : "Yok"}</b></div>
                  </div>

                  <div className="tk-tags">
                    {p.tags.map((t) => (
                      <span key={t} className="tk-tag">{t}</span>
                    ))}
                  </div>

                  <div className="tk-cardBottom">
                    <div className="tk-price">{p.price} TL</div>
                    <button
                      type="button"
                      className={`tk-btn ${selected ? "on" : ""}`}
                      onClick={() => toggleCompare(p.id)}
                    >
                      {selected ? "✓ Karşılaştırmada" : "+ Karşılaştır"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>

      {compareItems.length > 0 && (
        <div className="tk-compareBar">
          <div className="tk-compareInner">
            <div className="tk-compareLeft">
              <b>Karşılaştır</b>
              <span className="tk-mini">{compareItems.length} ürün seçildi</span>
            </div>

            <div className="tk-comparePills">
              {compareItems.map((it) => (
                <button
                  type="button"
                  key={it.id}
                  className="tk-pill"
                  onClick={() => toggleCompare(it.id)}
                  title="Kaldır"
                >
                  {it.brand} {it.powerW}W ✕
                </button>
              ))}
            </div>

            <div className="tk-compareRight">
              <button className="tk-btn ghost" type="button" onClick={() => setCompare([])}>
                Temizle
              </button>
              <button
                className="tk-btn primary"
                type="button"
                onClick={goComparePage}
                disabled={compare.length < 2}
                title={compare.length < 2 ? "En az 2 ürün seç" : "Karşılaştır"}
              >
                Karşılaştırma Sayfası →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
