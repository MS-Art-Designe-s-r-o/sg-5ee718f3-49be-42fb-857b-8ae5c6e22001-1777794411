# Nasadenie na hosting Polar55 (cPanel + Node.js)

Web beží ako Node.js aplikácia cez cPanel funkciu **Setup Node.js App** (Phusion Passenger).
Štartovací súbor aplikácie je `server.js` v koreňovom adresári projektu.

## 1. Vytvorenie Node.js aplikácie v cPanel

1. Prihláste sa do cPanel na Polar55.
2. Otvorte **Setup Node.js App** → **Create Application**.
3. Nastavte:
   - **Node.js version:** 20 alebo novšia (Next.js 15 vyžaduje minimálne Node 18.18)
   - **Application mode:** Production
   - **Application root:** adresár s kódom webu (napr. `etaxi-web`)
   - **Application URL:** doména `e-taxike.sk`
   - **Application startup file:** `server.js`

## 2. Nahranie kódu

Odporúčaný spôsob je Git (cPanel **Git Version Control** alebo cez SSH):

```bash
cd ~/etaxi-web
git clone <URL-repozitára> .
```

Alternatívne nahrajte súbory cez FTP/File Manager (bez `node_modules` a `.next`).

## 3. Inštalácia a build (cez SSH terminál)

V rozhraní Setup Node.js App skopírujte príkaz na aktiváciu virtuálneho
prostredia (zobrazuje sa hore, napr. `source /home/USER/nodevenv/etaxi-web/20/bin/activate`),
potom:

```bash
cd ~/etaxi-web
npm install
npm run build
```

> **Tip:** Ak build zlyhá na nedostatok pamäte, spravte `npm run build` lokálne
> na svojom počítači (s rovnakou verziou Node) a nahrajte adresár `.next/` na server.

## 4. Environment premenné

V **Setup Node.js App** → sekcia **Environment variables** pridajte:

| Premenná | Hodnota |
|---|---|
| `SMTP_HOST` | `smtp.m1.websupport.sk` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `dispecing@e-taxike.sk` |
| `SMTP_PASS` | heslo k e-mailovej schránke |
| `NEXT_PUBLIC_SITE_URL` | `https://e-taxike.sk` |
| `BLOG_API_TOKEN` | tajný token na publikovanie blogu (Šefko) — `openssl rand -hex 24` |
| `GOOGLE_PLACES_API_KEY` | API kľúč z Google Cloud (Places API) pre živé recenzie |
| `GOOGLE_PLACE_ID` | (voliteľné) Place ID firmy; bez neho sa dohľadá podľa názvu |

> **Pozor:** premenné `NEXT_PUBLIC_*` sa zapekajú do kódu počas `npm run build`.
> Ak ich zmeníte, treba spustiť build znova.

## 4b. Blog — publikovanie príspevkov cez API (AI agent Šefko)

Príspevky sa pridávajú cez zabezpečené API, **bez zmeny kódu**. Najnovší je vždy prvý;
doterajšie príspevky (Soro blog) ostávajú zobrazené pod novými.

- **Pridanie príspevku** (Šefko):
  ```bash
  curl -X POST https://e-taxike.sk/api/blog \
    -H "Authorization: Bearer $BLOG_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Nadpis príspevku",
      "content": "Text. Odstavce oddeľte prázdnym riadkom.",
      "excerpt": "Krátky úvod (voliteľné)",
      "category": "Novinky",
      "author": "E-TAXI Košice",
      "image": "https://.../obrazok.jpg"
    }'
  ```
  Povinné je len `title` a `content`; ostatné sú voliteľné. `date` (ISO) je voliteľné —
  default je čas pridania.
- **Zoznam** (verejný): `GET https://e-taxike.sk/api/blog`
- **Zmazanie**: `DELETE https://e-taxike.sk/api/blog/<id>` s rovnakým Bearer tokenom.

Príspevky sú uložené v `~/etaxi-web/data/blog-posts.json` (mimo gitu aj buildu — prežijú
`git pull` aj `npm run build`). Žiadny reštart netreba — nový príspevok sa zobrazí hneď.

## 4c. Google recenzie (živý rating, počet a ~5 recenzií)

1. V [Google Cloud Console](https://console.cloud.google.com/) vytvorte projekt, povoľte
   **Places API** a vytvorte **API kľúč** (odporúčané obmedziť na Places API).
2. Kľúč vložte do premennej `GOOGLE_PLACES_API_KEY` v Setup Node.js App a dajte **Restart**.
3. Web potom na stránke recenzií zobrazí živý rating, počet a cca 5 reálnych recenzií.
   Bez kľúča sa použijú statické recenzie (web funguje ďalej).

> Pozn.: Google cez API poskytne len cca 5 recenzií (limit Googlu), ale rating a počet
> sú presné a živé. Výsledok sa cachuje 6 h, takže prevádzka ostáva v bezplatnom pásme.

## 5. Spustenie a test

1. V Setup Node.js App kliknite **Restart** (po každej zmene kódu alebo premenných).
2. Otvorte web v prehliadači a skontrolujte všetky stránky.
3. **Otestujte objednávkový formulár** — musí prísť e-mail na `dispecing@e-taxike.sk`
   aj potvrdenie zákazníkovi.

## Dôležité upozornenia pri migrácii

- **E-maily zostávajú na WebSupporte.** Schránka `dispecing@e-taxike.sk` (doména
  e-taxike.sk) beží na WebSupporte a web sa na ňu pripája cez SMTP. Pri zmene DNS
  **nemeňte MX záznamy** domény e-taxike.sk, inak prestanú chodiť e-maily.
- **Odchádzajúce SMTP:** overte si u podpory Polar55, že server neblokuje
  odchádzajúce spojenia na port 465 (potrebné pre odosielanie objednávok cez
  smtp.m1.websupport.sk). Po nasadení formulár reálne otestujte.
- **DNS domény e-taxike.sk:** nasmerujte A záznam na server Polar55
  (prípadne presuňte DNS správu k Polar55). SSL certifikát vydá cPanel
  automaticky (AutoSSL/Let's Encrypt).
- Bez nastavených SMTP premenných web funguje, ale objednávky sa iba logujú do
  konzoly servera — e-maily sa neposielajú.

## Aktualizácia webu (ďalšie nasadenia)

```bash
cd ~/etaxi-web
git pull
npm install
npm run build
```

a v cPanel **Setup Node.js App** kliknite **Restart**.

---

# Portál pre vodičov / dispečerov / majiteľa (backend)

Portál je súčasťou tej istej Next.js aplikácie (cesty `/prihlasenie` a `/portal/*`
+ API `/api/portal/*`). Za behu pristupuje k databáze **MySQL/MariaDB** priamo cez
driver **`mysql2`** (žiadny Prisma engine — stabilné aj pri nízkom procesnom limite
hostingu). Prisma sa používa **iba na migrácie schémy** (vývoj/nasadenie štruktúry DB).

## A. Databáza (cPanel → MySQL Databases)

1. Vytvorte databázu (napr. `etaxi_portal`) a používateľa, priraďte mu **všetky práva**.
2. Zostavte `DATABASE_URL`:
   `mysql://POUZIVATEL:HESLO@localhost:3306/etaxi_portal`
   (host býva `localhost`; ak nie, použite hodnotu od podpory Polar55).

## B. Environment premenné (Setup Node.js App → Environment variables)

| Premenná | Popis |
|---|---|
| `DATABASE_URL` | pripojenie na MySQL/MariaDB (viď vyššie) |
| `AUTH_JWT_SECRET` | náhodný tajný kľúč (min. 32 znakov, napr. `openssl rand -hex 32`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile — site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile — secret key |
| `INITIAL_OWNER_EMAIL` / `INITIAL_OWNER_PASSWORD` | prvý majiteľ (pri seed) |
| `INITIAL_OWNER_MENO` / `INITIAL_OWNER_PRIEZVISKO` | meno prvého majiteľa |

> Cloudflare Turnstile kľúče získate zdarma na https://dash.cloudflare.com → Turnstile.
> Bez nich portál funguje, ale overenie „že ste človek“ je vypnuté (vhodné len na test).

## C. Prvé nasadenie (cez SSH)

> **Vždy najprv aktivujte Node z cPanel** (Setup Node.js App → „Enter to the virtual
> environment", napr. `source ~/nodevenv/etaxi-web/22/bin/activate`) — inak SSH použije
> systémový Node.
>
> `prisma` a `tsx` sú v **devDependencies** (potrebné len na migráciu/seed, nie za behu).
> Runtime aplikácie závisí len od `mysql2` a spol. — **žiadny Prisma engine**.

**1. Migrácia schémy a seed** (jednorazovo; potrebuje dev balíky):
```bash
cd ~/etaxi-web
npm install --include=dev       # nainštaluje aj prisma/tsx/typescript
npm run prisma:migrate          # vytvorí tabuľky (prisma migrate deploy)
npm run seed                    # tarify + konfigurácia + prvý majiteľ (cez mysql2)
```

**2. Build a spustenie:**
```bash
npm run build                   # ak padne na EAGAIN (limit procesov), buildite lokálne
```
Potom **Setup Node.js App → Restart**.

> **Build lokálne (odporúčané pri nízkom NPROC):** zbuildite na svojom počítači
> (`npm install && npm run build`) a nahrajte priečinok `.next/` na server. Po zmene
> závislostí spustite na serveri aj `npm install` (produkčne, bez dev balíkov — je čistý,
> Prisma sa neinštaluje, takže žiadny pád `SIGSEGV`).
>
> **Seed** používa priamy `mysql2`, nie Prisma engine — funguje aj pod prísnym NPROC
> limitom (kde Prisma engine padal na `PANIC: timer has gone away`).

## D. Výpočet poplatkov

- Poplatok za aplikáciu podľa týždennej tržby (pásma: 0–50→0 €, 51–100→5 €,
  101–150→10 €, 151–250→15 €, 251+→20 €), provízia 15 %, celkový poplatok = súčet.
- Registračný poplatok 30 € jednorazovo za vodiča (evidencia úhrady).
- Poplatok za smenu (prenájom auta) je nastaviteľný na vozidle, prenáša sa do smien
  a eviduje sa jeho úhrada po vodičoch.
- Pásma, sadzbu provízie aj registračný poplatok možno meniť v tabuľkách `FeeTier`
  a `AppSetting` (seednuté predvolenými hodnotami).

## E. Ďalšie nasadenia

**Zmeny iba v kóde** (najčastejšie) — netreba migráciu ani seed:
```bash
# lokálne
git pull && npm install && npm run build
# nahrať .next/ na server, potom Restart v cPanel
```
Na serveri po zmene závislostí ešte `npm install` (produkčne, čistý beh).

**Ak pribudli nové migrácie schémy** (zmena `prisma/schema.prisma`):
```bash
cd ~/etaxi-web            # s aktívnym virtualenv
npm install --include=dev
npm run prisma:migrate
```
