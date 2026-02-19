"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  powerbanks,
  powerbankBrands,
  capacityOptions,
  outputOptions,
} from "@/data/products";

export default function PowerbankPage() {
  const router = useRouter();

  // 🔹 KARŞILAŞTIRMA SEÇİM STATE'İ (EKSİK OLAN BUYDU)
  const [selectedIds, setSelectedIds] = useState([]);

  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("Tümü");
  const [minMah, setMinMah] = useState(0);
  const [minW, setMinW] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [onlyPd, setOnlyPd] = useState(false);
  const [onlyPps, setOnlyPps] = useState(false);
  const [sort, setSort] = useState("score_desc");

  const filtered = useMemo(() => {
    let list = [...powerbanks];

    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s) ||
          String(p.capacityMah).includes(s) ||
          String(p.maxOutputW).includes(s) ||
          p.ports.toLowerCase().includes(s)
      );
    }

    if (brand !== "Tümü") list = list.filter((p) => p.brand === brand);
    if (minMah > 0) list = list.filter((p) => p.capacityMah >= minMah);
    if (minW > 0) list = list.filter((p) => p.maxOutputW >= minW);
    if (maxPrice < 99999) list = list.filter((p) => p.price <= maxPrice);
    if (onlyPd) list = list.filter((p) => p.pd);
    if (onlyPps) list = list.filter((p) => p.pps);

    switch (sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "capacity_desc":
        list.sort((a, b) => b.capacityMah - a.capacityMah);
        break;
      case "output_desc":
        list.sort((a, b) => b.maxOutputW - a.maxOutputW);
        break;
      default:
        list.sort((a, b) => b.score - a.score);
    }

    return list;
  }, [q, brand, minMah, minW, maxPrice, onlyPd, onlyPps, sort]);

  const resetFilters = () => {
    setQ("");
    setBrand("Tümü");
    setMinMah(0);
    setMinW(0);
    setMaxPrice(99999);
    setOnlyPd(false);
    setOnlyPps(false);
    setSort("score_desc");
  };

  // 🔹 KARŞILAŞTIR BUTONU LOGIĞI
  const toggleCompare = (id) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];

    setSelectedIds(next);

    // EN AZ 2 ÜRÜN SEÇİLİNCE DİREKT WEB SAYFASINA GİDER
    if (next.length >= 2) {
      router.push(`/powerbank-karsilastir?ids=${next.join(",")}`);
    }
  };

  return (
    <div className="tk-page">
      <header className="tk-topbar">
        <div className="tk-topbar__inner">
          <div>
            <div className="tk-kicker">Tech Kıyas</div>
            <h1 className="tk-title">Powerbank</h1>
            <p className="tk-sub">
              Kapasite, çıkış gücü ve hızlı şarj desteğine göre filtrele.
            </p>
          </div>

          <div className="tk-actions">
            <input
              className="tk-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara… (10000, 20W, Spigen, USB-C)"
            />

            <select
              className="tk-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="score_desc">En iyi puan</option>
              <option value="price_asc">Fiyat ↑</option>
              <option value="price_desc">Fiyat ↓</option>
              <option value="capacity_desc">Kapasite ↓</option>
              <option value="output_desc">Çıkış ↓</option>
            </select>

            <button className="tk-btn ghost" onClick={() => router.push("/")}>
              Ana Sayfa
            </button>
          </div>
        </div>
      </header>

      <div className="tk-shell">
        <aside className="tk-panel">
          <div className="tk-panel__head">
            <div className="tk-panel__title">Filtreler</div>
            <button className="tk-link" onClick={resetFilters}>
              Sıfırla
            </button>
          </div>

          <select
            className="tk-select full"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="Tümü">Tümü</option>
            {powerbankBrands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </aside>

        <main className="tk-main">
          <div className="tk-grid">
            {filtered.map((p) => (
              <article key={p.id} className="tk-card">
                <div className="tk-cardTop">
                  <div>
                    <div className="tk-brand">{p.brand}</div>
                    <div className="tk-name">{p.name}</div>
                  </div>
                  <div className="tk-score">{p.score.toFixed(1)}</div>
                </div>

                <div className="tk-specs">
                  <div className="tk-spec"><span>Kapasite</span><b>{p.capacityMah} mAh</b></div>
                  <div className="tk-spec"><span>Çıkış</span><b>{p.maxOutputW}W</b></div>
                  <div className="tk-spec"><span>PD</span><b>{p.pd ? "Var" : "Yok"}</b></div>
                  <div className="tk-spec"><span>PPS</span><b>{p.pps ? "Var" : "Yok"}</b></div>
                </div>

                <div className="tk-cardBottom">
                  <div className="tk-price">{p.price} TL</div>

                  <button
                    className={`tk-btn ghost ${
                      selectedIds.includes(p.id) ? "on" : ""
                    }`}
                    onClick={() => toggleCompare(p.id)}
                  >
                    {selectedIds.includes(p.id)
                      ? "✓ Karşılaştırmada"
                      : "+ Karşılaştır"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
