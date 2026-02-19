/* =========================
   ŞARJ ALETLERİ
========================= */

export const chargers = [
  {
    id: "spigen-gan-65",
    name: "Spigen GaN 65W",
    brand: "Spigen",
    powerW: 65,
    ports: "2x USB-C + 1x USB-A",
    pd: true,
    pps: true,
    gan: true,
    price: 1499,
    score: 9.2,
    tags: ["GaN", "PPS", "Laptop Uyumlu"],
  },
  {
    id: "spigen-gan-40",
    name: "Spigen GaN 40W",
    brand: "Spigen",
    powerW: 40,
    ports: "2x USB-C",
    pd: true,
    pps: true,
    gan: true,
    price: 1099,
    score: 8.8,
    tags: ["GaN", "PPS"],
  },
  {
    id: "anker-30w",
    name: "Anker 30W",
    brand: "Anker",
    powerW: 30,
    ports: "1x USB-C",
    pd: true,
    pps: false,
    gan: false,
    price: 899,
    score: 8.1,
    tags: ["PD"],
  },
];

export const brands = ["Spigen", "Anker", "Ugreen", "Baseus"];
export const powerOptions = [20, 30, 40, 45, 65, 100];

/* =========================
   POWERBANKLER
========================= */

export const powerbanks = [
  {
    id: "pb-anker-20k-pd",
    name: "Anker 20000 PD",
    brand: "Anker",
    capacityMah: 20000,
    maxOutputW: 20,
    ports: "1x USB-C + 1x USB-A",
    pd: true,
    pps: false,
    price: 1499,
    score: 8.6,
    tags: ["PD", "Yüksek Kapasite"],
  },
  {
    id: "pb-spigen-10k-pps",
    name: "Spigen 10000 20W",
    brand: "Spigen",
    capacityMah: 10000,
    maxOutputW: 20,
    ports: "1x USB-C + 1x USB-A",
    pd: true,
    pps: true,
    price: 1199,
    score: 8.8,
    tags: ["PPS", "Kaliteli"],
  },
];

export const powerbankBrands = ["Anker", "Ugreen", "Xiaomi", "Spigen"];
export const capacityOptions = [5000, 10000, 20000];
export const outputOptions = [10, 15, 20, 30, 45];

/* =========================
   KABLOLAR (TEK VE NET)
========================= */

export const cables = [
  {
    id: "c1",
    brand: "Anker",
    name: "Anker USB-C to USB-C 100W",
    type: "USB-C → USB-C",
    maxPowerW: 100,
    pd: true,
    eMarker: true,
    lengthM: 1.8,
    braided: true,
    price: 499,
    score: 8.7,
    tags: ["100W", "PD", "E-Marker", "Laptop Uyumlu"],
  },
  {
    id: "c2",
    brand: "Spigen",
    name: "Spigen USB-C to USB-C 60W",
    type: "USB-C → USB-C",
    maxPowerW: 60,
    pd: true,
    eMarker: false,
    lengthM: 1.2,
    braided: true,
    price: 349,
    score: 8.3,
    tags: ["60W", "PD", "Telefon"],
  },
  {
    id: "c3",
    brand: "Baseus",
    name: "Baseus USB-A to USB-C 18W",
    type: "USB-A → USB-C",
    maxPowerW: 18,
    pd: false,
    eMarker: false,
    lengthM: 1,
    braided: true,
    price: 199,
    score: 7.6,
    tags: ["Günlük", "Uygun Fiyat"],
  },
];
