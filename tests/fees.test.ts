// Testy výpočtu poplatkov oproti hodnotám z Google tabuľky E-TAXI Košice.
// Spustenie: npm run test:fees
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  poplatokZaApp,
  vypocitajPoplatky,
  isoWeekNumber,
  isoWeekYear,
  isoWeekMonday,
} from "../src/lib/fees";

test("poplatok za app — hranice pásiem", () => {
  assert.equal(poplatokZaApp(0), 0);
  assert.equal(poplatokZaApp(50), 0);
  assert.equal(poplatokZaApp(50.01), 5);
  assert.equal(poplatokZaApp(100), 5);
  assert.equal(poplatokZaApp(100.01), 10);
  assert.equal(poplatokZaApp(150), 10);
  assert.equal(poplatokZaApp(150.01), 15);
  assert.equal(poplatokZaApp(250), 15);
  assert.equal(poplatokZaApp(250.01), 20);
  assert.equal(poplatokZaApp(1000), 20);
});

test("celkový výpočet — poplatky zaokrúhlené na 1 desatinné", () => {
  // E77: 87,30 € → app 5, provízia 13,1, spolu 18,1
  const e77 = vypocitajPoplatky(87.3);
  assert.equal(e77.poplatokApp, 5);
  assert.equal(e77.provizia, 13.1);
  assert.equal(e77.celkovyPoplatok, 18.1);

  // E13: 135,60 € → app 10, provízia 20,3, spolu 30,3
  const e13 = vypocitajPoplatky(135.6);
  assert.equal(e13.poplatokApp, 10);
  assert.equal(e13.provizia, 20.3);
  assert.equal(e13.celkovyPoplatok, 30.3);

  // E21: 390,90 € → app 20, provízia 58,6, spolu 78,6
  const e21 = vypocitajPoplatky(390.9);
  assert.equal(e21.poplatokApp, 20);
  assert.equal(e21.provizia, 58.6);
  assert.equal(e21.celkovyPoplatok, 78.6);

  // E10: 701,10 € → app 20, provízia 105,2, spolu 125,2
  const e10 = vypocitajPoplatky(701.1);
  assert.equal(e10.poplatokApp, 20);
  assert.equal(e10.provizia, 105.2);
  assert.equal(e10.celkovyPoplatok, 125.2);

  // Nulová tržba
  const zero = vypocitajPoplatky(0);
  assert.equal(zero.celkovyPoplatok, 0);
});

test("ISO týždeň", () => {
  // 26.7.2026 je nedeľa → ISO týždeň 30, rok 2026
  const d = new Date(Date.UTC(2026, 6, 26));
  assert.equal(isoWeekNumber(d), 30);
  assert.equal(isoWeekYear(d), 2026);
  // Pondelok 30. ISO týždňa 2026 = 20.7.2026
  const mon = isoWeekMonday(2026, 30);
  assert.equal(mon.toISOString().slice(0, 10), "2026-07-20");
});
