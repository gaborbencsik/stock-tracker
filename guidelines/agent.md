# TypeScript Coding Guidelines for AI Code Agent

## Cél
Ez a dokumentum meghatározza azokat a szabályokat és elveket, amelyeket az AI kódgeneráló agentnek **kötelező** követnie egy TypeScript projektben.

A generált kód legyen:
- teljesen típusos
- tesztelt (TDD)
- SOLID és Clean Code elveket követő
- karbantartható és bővíthető
- production-ready

---

## Alapkövetelmények

- Programozási nyelv: **TypeScript (strict mode)**
- Teszt framework: **Vitest**
- Fejlesztési módszertan: **Test Driven Development (TDD)**
- Minden üzleti logikához **kötelező tesztet írni**
- SOLID és Clean Code elvek betartása **nem opcionális**
- `any` használata **tilos**
- Teszt nélküli kód **nem elfogadható**

---

## TypeScript-specifikus szabályok

### Típuskezelés

- Használj:
  - `interface`-t szerződésekhez (ports, service-ek)
  - `type`-ot összetett vagy union típusokhoz
- Kerüld:
  - `any`
  - indokolatlan type assertion-öket (`as`)
- Preferáld:
  - `unknown` az `any` helyett
  - union type-okat és discriminated union-öket
- Használj `readonly`-t, ahol lehetséges
- Függvények mindig rendelkezzenek:
  - explicit bemeneti típusokkal
  - explicit visszatérési típussal

---

## Clean Code alapelvek

- A kód legyen **önmagyarázó**
- Komment csak akkor megengedett, ha a *miért* nem derül ki a kódból
- Elnevezések:
  - üzleti jelentést hordozzanak
  - kerüljék a technikai zajt
- Egy függvény:
  - egy dolgot csináljon
  - legyen rövid és fókuszált
- Kerüld:
  - mély egymásba ágyazott feltételeket
  - mágikus számokat
  - duplikált logikát

---

## SOLID elvek (kötelező)

### Single Responsibility Principle
- Egy modulnak/osztálynak **egyetlen oka legyen a változásra**
- Ne keverd:
  - domain logikát
  - infrastruktúrát
  - framework kódot

### Open / Closed Principle
- A kód legyen:
  - bővíthető
  - módosítás nélkül használható
- Preferáld a kompozíciót az örökléssel szemben

### Liskov Substitution Principle
- Implementációk legyenek csereszabatosak
- Ne változtasd meg az interface által ígért viselkedést

### Interface Segregation Principle
- Sok kicsi, célzott interface jobb, mint egy nagy
- Ne kényszeríts implementációkat felesleges metódusokra

### Dependency Inversion Principle
- A magas szintű modulok:
  - ne függjenek alacsony szintű implementációktól
- Mindig absztrakcióra (interface) támaszkodj

---

## Tesztelés – TDD + Vitest (kötelező)

### Teszt framework szabályok

- Kötelezően használandó:
  - **Vitest**
  - `describe`, `it`, `expect`, `vi`
- Tesztfájl elnevezés:
  - `*.test.ts` vagy `*.spec.ts`
- Tesztek elhelyezése:
  - implementáció mellett **vagy**
  - `__tests__` mappában  
  (egy projektben egy megközelítés legyen)

---

### Tesztfuttatás (kötelező lépés)

- Minden kódváltoztatás után **kötelező lefuttatni az összes tesztet**
- Nem elegendő csak:
  - az adott fájlhoz tartozó teszteket
  - vagy az újonnan írt teszteket futtatni
- A teljes teszt suite-nek zöldnek kell lennie

---

### TDD munkafolyamat (szigorúan követendő)

1. **Red**
   - Írj egy tesztet, ami leírja az elvárt viselkedést
   - A tesztnek el kell buknia

2. **Green**
   - Írj minimális kódot, hogy a teszt átmenjen
   - Ne optimalizálj

3. **Refactor**
   - Tisztítsd a kódot
   - Tartsd zölden az összes tesztet
   - Javíts SOLID és Clean Code problémákat

> Ha nem lehet egyszerű tesztet írni egy kódhoz,  
> az architektúra hibás.

---

### Tesztek minőségi követelményei

- Tesztek legyenek:
  - gyorsak
  - determinisztikusak
  - izoláltak
- Egy teszt:
  - egy viselkedést ellenőrizzen
- Tesztnevek:
  - írják le az üzleti szabályt
  - ne az implementációt

---

### Mockolási szabályok (Vitest)

- Használj:
  - `vi.fn()`
  - `vi.mock()`
- Mockolni **csak**:
  - infrastruktúrát
  - IO-t
  - külső service-eket
- **Tilos mockolni:**
  - domain logikát
  - value objecteket
  - üzleti szabályokat

---

### Mit nem kell tesztelni

- Framework belső működését
- Triviális getter/setter kódot
- TypeScript típusellenőrzést
- Konfigurációs fájlokat

---

## Architektúra

- Preferált megközelítés:
  - **Hexagonális Architektúra (Ports & Adapters)**
- Domain réteg:
  - framework-agnosztikus
  - nem tartalmaz IO-t
- Külső világ:
  - adaptereken keresztül kommunikál
- Használj dependency injection-t
- Kerüld a globális állapotot

---

## Hibakezelés

- Hibák legyenek:
  - explicit
  - típusosak
- Preferáld:
  - custom error osztályokat
- Ne:
  - nyeld el a hibákat
  - dobj kontextus nélküli `Error`-t

---

## Aszinkron kód

- Használj `async/await`-et
- Promise visszatérési típus legyen explicit
- Kerüld a callback-alapú megoldásokat

---

## Kódgenerálási szabályok AI számára

- A generált kód:
  - legyen teljes
  - legyen futtatható
  - tartalmazzon teszteket
- Ne módosíts nem kért kódrészeket
- Ha feltételezést teszel:
  - dokumentáld szövegesen
- Preferáld az olvashatóságot a „trükkös” megoldásokkal szemben
- A kód csak akkor tekinthető késznek, ha az összes teszt sikeresen lefut


---

## Refaktorálás

- Refaktoráláskor:
  - a tesztek változtatás nélkül zöldek maradjanak
- Javíts:
  - duplikációt
  - hosszú függvényeket
  - SOLID és Clean Code sértéseket
  - az összes tesztet le kell futtatni
  - minden tesztnek változtatás nélkül zöldnek kell maradnia
- Ha egy refaktor tesztet tör meg, az hibás refaktor


---

## Tiltott dolgok

- `any` használata
- Teszt nélküli üzleti logika
- Hardcoded konfigurációk
- SOLID elvek megsértése
- Félkész vagy nem futtatható kód

---

## Alapelv összefoglalás

> Először teszt.  
> Utána egyszerű, típusos megoldás.  
> Refaktor csak zöld tesztekkel.  
> Úgy írj kódot, mintha éveken át productionben futna.
