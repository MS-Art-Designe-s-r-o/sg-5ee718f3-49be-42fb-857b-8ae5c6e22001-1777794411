# E-TAXI Košice

Profesionálna taxislužba v Košiciach s online objednávkovým systémom.

## 🚀 Technológie

- Next.js 15 (Page Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Framer Motion
- shadcn/ui

## 🌍 Jazykové verzie

Web je viacjazyčný (vstavaný i18n routing Next.js):

- **Slovenčina** (hlavný jazyk): `https://e-taxike.sk/`
- **Angličtina**: `https://e-taxike.sk/en`
- **Nemčina**: `https://e-taxike.sk/de`
- **Maďarčina**: `https://e-taxike.sk/hu`

Všetky texty sú v slovníkoch `src/locales/sk.ts` a `src/locales/en.ts`.
Slovenský slovník definuje typ `Dictionary` — TypeScript ustráži, že žiadny
jazyk nemá chýbajúce texty.

### Pridanie nového jazyka (napr. nemčina)

1. Skopírujte `src/locales/en.ts` do `src/locales/de.ts` a preložte texty.
2. Zaregistrujte jazyk v `src/locales/index.ts` (`dictionaries = { sk, en, de }`).
3. Pridajte `"de"` do `i18n.locales` v `next.config.mjs`.
4. Doplňte `/de` URL do `public/sitemap.xml`.

Prepínač jazykov v hlavičke aj hreflang/canonical meta tagy sa vygenerujú automaticky.

## 📧 Nastavenie emailov (SMTP)

Pre funkčnosť odosielania objednávok cez formulár je potrebné nakonfigurovať SMTP server:

### Postup nastavenia:

1. **Skopírujte `.env.example` do `.env.local`:**
   ```bash
   cp .env.example .env.local
   ```

2. **Vyplňte SMTP údaje v `.env.local`:**
   ```env
   SMTP_HOST=smtp.m1.websupport.sk
   SMTP_PORT=465
   SMTP_USER=dispecing@e-taxike.sk
   SMTP_PASS=your_actual_password_here
   ```

3. **Reštartujte development server:**
   ```bash
   npm run dev
   ```

### ⚠️ Bezpečnosť:

- **NIKDY** necommitujte `.env.local` do git repository
- `.env.local` je automaticky ignorovaný v `.gitignore`
- Pre production nastavte environment premenné v cPanel (pozri [DEPLOY.md](DEPLOY.md))

### 🔧 SMTP Nastavenia:

- **Server:** smtp.m1.websupport.sk
- **Port:** 465 (SSL/TLS)
- **Autentifikácia:** Vyžadovaná
- **Email odosielateľ:** dispecing@e-taxike.sk
- **Email prijímateľ:** dispecing@e-taxike.sk

### Bez nastaveného SMTP:
- Objednávky sa budú logovať do server konzoly
- Používatelia dostanú notifikáciu o potrebe zavolať priamo

## 🛠️ Inštalácia a spustenie

```bash
npm install
npm run dev
```

Otvorte [http://localhost:3000](http://localhost:3000) vo vašom prehliadači.

## 📦 Production build

```bash
npm run build
npm run start
```

## 🌐 Deployment

Web je nasadený na hostingu **Polar55** ako Node.js aplikácia (cPanel Setup Node.js App,
štartovací súbor `server.js`). Kompletný postup nasadenia je v [DEPLOY.md](DEPLOY.md).
## 🔐 Portál (backend pre vodičov, dispečerov, majiteľa)

Interný portál na správu firemných vozidiel, vodičov, rozpisu smien a týždenných
tržieb s automatickým výpočtom poplatkov. Prihlásenie je na `/prihlasenie`
(overenie človeka cez Cloudflare Turnstile), aplikácia na `/portal`.

- **Technológie:** MySQL/MariaDB + Prisma, JWT session (httpOnly cookie), Cloudflare Turnstile.
- **Roly:** Majiteľ (všetko), Dispečer (rozpis smien + vyťaženosť), Vodič (svoje smeny a poplatky).
  Jeden používateľ môže mať viac rolí.
- **Poplatky:** poplatok za app podľa pásiem tržby, provízia 15 %, registračný poplatok 30 €,
  poplatok za smenu/prenájom auta (evidencia úhrady po vodičoch).

### Lokálne spustenie portálu

```bash
cp .env.example .env.local     # vyplňte DATABASE_URL, AUTH_JWT_SECRET, (Turnstile), INITIAL_OWNER_*
npm install
npx prisma migrate deploy      # alebo `npx prisma migrate dev` počas vývoja
npm run seed                   # tarify, konfigurácia, prvý majiteľ
npm run dev
```

Testy výpočtu poplatkov: `npm run test:fees`. Nasadenie na hosting: pozri `DEPLOY.md`.
