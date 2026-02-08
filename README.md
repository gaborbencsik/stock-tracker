# Részvény Követő Alkalmazás

Egy modern, interaktív Vue.js 3 + TypeScript alkalmazás részvények nyomon követésére és elemzésére.

## 🚀 Funkciók

- ✅ **Táblázatos megjelenítés** - Áttekinthető lista részvényekről
- 🔍 **Fejlett szűrés** - Szűrés ticker, név, tőzsde, deviza, ár és potenciál alapján
- 📊 **Részletes nézet** - Modal ablak minden részvényhez részletes információkkal
- 📈 **Történelmi csúcsok** - 1, 2, 3, 6, 12 hónapos és mindenkori csúcsok
- 🎯 **Árcélok** - 6 és 12 hónapos árcélok megjelenítése
- 📝 **Jegyzetek és linkek** - Egyéni jegyzetek és külső források
- 🔄 **Rendezés** - Minden oszlop szerint rendezhető (növekvő/csökkenő)
- 📱 **Reszponzív design** - Mobil, tablet és desktop nézetekkel
- 🎨 **Modern, színes UI** - Dinamikus gradiens alapú dizájn

## 🛠️ Technológiai Stack

- **Vue.js 3** - Composition API
- **TypeScript** - Típusbiztonság
- **Vite** - Gyors build tool
- **Vitest** - Unit tesztek
- **@vue/test-utils** - Vue komponens tesztelés

## 📦 Telepítés

```bash
# Függőségek telepítése
npm install

# Development szerver indítása
npm run dev

# Production build
npm run build

# Build előnézet
npm run preview
```

## 🧪 Tesztelés

```bash
# Tesztek futtatása
npm run test

# Tesztek futtatása UI-val
npm run test:ui

# Coverage report generálása
npm run test:coverage
```

A coverage report a `coverage/` mappában található (HTML formátumban).

## 📁 Projekt Struktúra

```
src/
├── components/          # Vue komponensek
│   ├── StockTable.vue   # Fő táblázat komponens
│   ├── StockModal.vue   # Részletes nézet modal
│   └── StockFilters.vue # Szűrők komponens
├── composables/         # Vue composable-ok
│   └── useStocks.ts     # Részvények kezelése
├── types/               # TypeScript típusok
│   └── Stock.ts         # Stock interface
├── utils/               # Utility függvények
│   └── dateFormatter.ts # Dátum formázás
├── data/                # Statikus adatok
│   └── stocks.json      # Példa részvény adatok
├── tests/               # Unit tesztek
│   ├── StockTable.spec.ts
│   ├── StockModal.spec.ts
│   ├── useStocks.spec.ts
│   └── dateFormatter.spec.ts
├── App.vue              # Fő alkalmazás komponens
└── main.ts              # Entry point
```

## 📊 Adatstruktúra

Minden részvény a következő mezőket tartalmazza:

```typescript
interface Stock {
  id: number
  ticker: string                    // Részvény ticker (pl. AAPL)
  name: string                      // Cégnév
  stock_exchange: string            // Tőzsde (pl. NASDAQ)
  currency: string                  // Deviza (pl. USD)
  entry_price: number               // Belépési ár
  uplift_potential: number          // Növekedési potenciál (%)
  six_months_price_target: number   // 6 hónapos árcél
  twelve_months_price_target: number // 12 hónapos árcél
  one_month_highest_price: number   // 1 hónapos csúcs
  two_months_highest_price: number  // 2 hónapos csúcs
  three_months_highest_price: number // 3 hónapos csúcs
  six_months_highest_price: number  // 6 hónapos csúcs
  twelve_months_highest_price: number // 12 hónapos csúcs
  highest_price: number             // Mindenkori legmagasabb ár
  notes: string                     // Jegyzetek
  links: string                     // Linkek (vessző elválasztva)
  last_modified: string             // Utolsó módosítás dátuma
  created_at: string                // Létrehozás dátuma
}
```

## 🎨 Színsémák

Az alkalmazás modern, színes gradiens alapú dizájnt használ:

- **Elsődleges színek**: Lila-kék gradiens (#667eea - #764ba2)
- **Pozitív értékek**: Zöld árnyalatok
- **Negatív értékek**: Piros árnyalatok
- **Háttér**: Sötét gradiens (#1a1a2e - #16213e)

## 🔄 Jövőbeli Fejlesztések

- [ ] Backend API integráció
- [ ] Valós idejű árfolyam frissítés
- [ ] Grafikonok és chartok
- [ ] Export CSV/PDF funkcionalitás
- [ ] Portfólió összesítő dashboard
- [ ] Dark/Light mode váltó
- [ ] Többnyelvű támogatás

## 📝 Használat

1. **Szűrés**: Használd a felső szűrő panelt részvények szűréséhez
2. **Rendezés**: Kattints a táblázat fejlécére rendezéshez
3. **Részletek**: Kattints a "Részletek" gombra a modal megnyitásához
4. **Navigáció**: ESC billentyű vagy háttér kattintás a modal bezárásához

## 🤝 Közreműködés

1. Fork-old a projektet
2. Hozz létre egy feature branch-et (`git checkout -b feature/AmazingFeature`)
3. Commit-old a változtatásokat (`git commit -m 'Add some AmazingFeature'`)
4. Push-old a branch-re (`git push origin feature/AmazingFeature`)
5. Nyiss egy Pull Request-et

## 📄 Licensz

Ez a projekt MIT licensz alatt van.

## 👤 Szerző

Készítette: Claude & Te 🚀
