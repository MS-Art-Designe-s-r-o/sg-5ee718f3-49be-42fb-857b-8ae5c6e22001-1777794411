# Modul zmlúv – schválený návrh (E-TAXI portál)

Zdroj pravdy pre implementáciu. Odchýlky len so súhlasom zadávateľa.

## Schválené rozhodnutia
1. **Fáza 1 = len DOCX.** PDF cez rozhranie `PdfConverter` (`PDF_CONVERTER=none|gotenberg`, default `none`). Gotenberg je len voliteľná implementácia (HTTP POST na `GOTENBERG_URL`). LibreOffice na cPanel sa NEpoužíva.
2. **Typ strany:** `FYZICKA_OSOBA` / `PRAVNICKA_OSOBA`; navyše príznak v dátach `podnikatel` = vyplnené IČO (SZČO). Pri `rezim = VLASTNA_KONCESIA` sú povinné IČO, DIČ a číslo koncesie; IČ DPH je voliteľné.
3. Súbory na disku sa nešifrujú (práva 0600 / 0700, mimo webu). Snapshot v DB je šifrovaný.
4. Retencia: audit log 5 rokov; profil vodiča sa anonymizuje 5 rokov po skončení poslednej zmluvy (skript, dry-run default).
5. **Všetko len MAJITEĽ** (DISPEČER ani VODIČ nevidia profily, zmluvy, flotily, firmu, šablóny, audit).
6. Vodič môže mať nájomné zmluvy na viac vozidiel; jedno vozidlo môže byť prenajaté viacerým vodičom (užívanie podľa rozpisu smien). **Žiadna kontrola prekryvu.**

## Bez duplicít (rozhodnutia nad rámec návrhu)
- Nové stĺpce `Vehicle.najomneSuma/najomneJednotka` NEPRIDÁVAME. Predvolené nájomné do modálu = `Vehicle.poplatokZaSmenu` (12 h) a `Vehicle.poplatokZa24h`. `Vehicle.kaucia` a `Vehicle.spoluucast` sú predvolené hodnoty pre modál.
- `Vehicle.poistenie` (mesačný náklad) ostáva; nové poistné stĺpce majú prefix `pzp*` / `hav*`.
- Stav vozidla sa neukladá, dopočíta sa (`src/lib/vehicleStatus.ts`): `aktivne=0` → VYRADENE; platí `VehicleBlock` SERVIS dnes → SERVIS; existuje platná zmluva NAJOM (stav VYGENEROVANA/PODPISANA, dnes v platnosti) → PRENAJATE (+ počet); inak VOLNE.
- `User` sa NEMENÍ. Osobné údaje v `DriverProfile` (1:1).

## Migrácie (spätne kompatibilné: nové stĺpce NULL/DEFAULT, žiadne DROP/RENAME)
- **0009_zmluvy_subjekty**: `CompanyProfile`, `Fleet`, `FleetAgreement`, `DriverProfile`, `AuditLog`.
- **0010_vozidlo_zmluvne_udaje**: ALTER `Vehicle`.
- **0011_zmluvy**: `ContractTemplate`, `ContractSequence`, `Contract`.

### Tabuľky
**CompanyProfile** (1 riadok, `id`=1): obchodneMeno, ico, dic, icDph, sidlo, zapisanyV (obchodný register), statutar, statutarFunkcia, iban, email, telefon, web, updatedAt.
**Fleet**: id, obchodneMeno, ico (UNIQUE NULL), dic, icDph, sidlo, zapisanyV, statutar, cisloKoncesie, iban, kontaktMeno, kontaktTelefon, kontaktEmail, poznamka, aktivna, createdAt, updatedAt.
**FleetAgreement**: id, fleetId (FK CASCADE), cislo, datumUzavretia, platnostOd, platnostDo NULL, poznamka.
**DriverProfile** (PK `userId` FK User CASCADE): titulPred, titulZa, datumNarodenia DATE, rodneCisloEnc VARCHAR(255), rodneCisloBidx CHAR(64) UNIQUE NULL, cisloOpEnc VARCHAR(255), trvalyPobyt, cisloVp, cisloPvt, pvtPlatnostDo DATE, iban VARCHAR(34), stav ENUM(AKTIVNY,POZASTAVENY,UKONCENY) DEFAULT AKTIVNY, fleetId (FK Fleet SET NULL), rezim ENUM(VO_FLOTILE,VLASTNA_KONCESIA) NULL, stranaTyp ENUM(FYZICKA_OSOBA,PRAVNICKA_OSOBA) NULL, firmaObchodneMeno, firmaIco, firmaDic, firmaIcDph, firmaSidlo, firmaZapisanyV, cisloKoncesie, koncesiaPlatnostDo DATE, firmaStatutar, anonymizedAt DATETIME NULL, createdAt, updatedAt.
**AuditLog**: id BIGINT AI, at DATETIME(3) DEFAULT NOW(3), userId NULL (FK User SET NULL), action VARCHAR(40), entity VARCHAR(30), entityId INT NULL, ip VARCHAR(45), meta JSON NULL; indexy (entity,entityId), (userId,at), (at). Len INSERT.
**Vehicle** (ALTER, všetko NULL/DEFAULT): vin VARCHAR(17) UNIQUE NULL, rokVyroby SMALLINT, cisloTp, datumPrvejEvidencie DATE, vlastnikTyp ENUM(ETAXI,FLOTILA) DEFAULT ETAXI, vlastnikFleetId (FK Fleet SET NULL), poistovna, pzpCislo, pzpPlatnostDo DATE, havCislo, havPlatnostDo DATE, stkPlatnostDo DATE, ekPlatnostDo DATE, stavKm INT, kaucia DECIMAL(10,2), spoluucast DECIMAL(10,2).
**ContractTemplate**: id, typ ENUM(NAJOM,DISPECING), nazov, verzia INT, suborPath, sha256 CHAR(64), platnaOd DATE, aktivna BOOL, aktivnaTyp (generovaný `IF(aktivna,typ,NULL)` STORED, UNIQUE), tagy JSON, createdById, createdAt; UNIQUE(typ,verzia).
**ContractSequence**: prefix VARCHAR(4), rok SMALLINT, posledne INT; PK(prefix,rok).
**Contract**: id, cislo VARCHAR(20), verzia INT DEFAULT 1, nahradzaId (self FK SET NULL), typ ENUM(NAJOM,DISPECING), driverId (FK User RESTRICT), fleetId NULL, vehicleId NULL (FK SET NULL), templateId (FK RESTRICT), datumUzavretia, platnostOd, platnostDo NULL, najomneSuma, najomneJednotka ENUM(ZMENA,DEN,TYZDEN,MESIAC) DEFAULT ZMENA, najomne24h, kaucia, spoluucast, stavKmOdovzdanie, provizia DECIMAL(5,2), poplatokRegistracny, stav ENUM(NAVRH,VYGENEROVANA,PODPISANA,UKONCENA,NAHRADENA), podpisanaDna, ukoncenaDna, docxPath, pdfPath NULL, snapshotEnc MEDIUMTEXT, snapshotSha256 CHAR(64), onedriveItemId NULL, onedriveSyncedAt NULL, onedriveError NULL, createdById, createdAt, updatedAt; UNIQUE(cislo,verzia), INDEX(driverId), INDEX(vehicleId,stav), INDEX(typ,stav).

## Šifrovanie (`src/lib/crypto/fieldCrypto.ts`)
AES-256-GCM, IV 12 B, tag 16 B, AAD = `"<pole>:<userId>"`. Formát `v1:<keyId>:<iv b64url>:<tag b64url>:<ct b64url>`. Env: `FIELD_ENC_KEYS="k1:<base64 32B>,k2:..."`, `FIELD_ENC_ACTIVE=k1`, `FIELD_HMAC_KEY=<base64 32B>`. Fail-fast pri PRVOM použití (nie pri importe, aby portál bez kľúčov inak bežal). Blind index = HMAC-SHA256 normalizovaného RČ (len detekcia duplicity). API vracia masku + `hasValue`; plná hodnota len `POST /api/portal/drivers/[id]/reveal` (audit PII_REVEAL). `scripts/reencrypt.ts` = rotácia.
`withErrorHandler` NESMIE logovať `err.sql` ani celé objekty chýb – len `name`, `code`, `message` bez hodnôt.

## Generovanie
`docxtemplater` + `pizzip`, `paragraphLoop`, `linebreaks`, `nullGetter` → „“. Povinné údaje sa validujú PRED generovaním (`validate()` → `{pole,label,odkaz}[]`). Formáty: dd.mm.rrrr, `1 234,50 €`, suma slovom (vlastná funkcia + testy). Podmienené bloky: `flotila`, `koncesia`, `pravnicka_osoba`, `fyzicka_osoba`, `podnikatel`, `vozidlo`. Snapshot = šifrovaný JSON všetkých údajov; starý dokument sa nikdy neprerenderuje. Regenerácia = nový riadok `Contract` (verzia+1, `nahradzaId`), starý → NAHRADENA. Číslo `NZ-RRRR-NNN` / `DS-RRRR-NNN` cez `ContractSequence` + `LAST_INSERT_ID` v transakcii.

## Súbory
`STORAGE_DIR` (default `~/etaxi-storage`, mimo app adresára). `zmluvy/{Priezvisko Meno}/{YYYY-MM-DD}_Najomna-zmluva_{EČV}_{Priezvisko-Meno}[_vN].docx` resp. `_Dispecerska-zmluva_` (bez EČV); `sablony/{typ}/v{n}_{sha8}.docx`. V DB relatívna cesta; pri čítaní `path.resolve` + `startsWith(root)`. Upload šablóny: JSON base64, `sizeLimit 8mb`, max 5 MB, magické bajty `PK\x03\x04`, PizZip + compile docxtemplater. Download len cez `GET /api/portal/contracts/[id]/download` (MAJITEL, `Cache-Control: no-store`, audit).

## Fáza 2 (len konfigurácia, no-op)
`MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `ONEDRIVE_DRIVE_ID`, `ONEDRIVE_ROOT=/Documents/E-Taxi/Vodici`, `ONEDRIVE_ENABLED=false`; `src/lib/contracts/onedrive.ts` s rozhraním a no-op implementáciou.

## Testy
`node --test --import tsx tests/*.test.ts` (skript `test` v package.json). Fixture .docx v `tests/fixtures/`.
