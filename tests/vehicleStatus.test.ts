import { test } from "node:test";
import assert from "node:assert/strict";
import { computeVehicleStatus } from "../src/lib/vehicleStatus";

test("neaktívne vozidlo je VYRADENE bez ohľadu na servis a nájmy", () => {
  assert.deepEqual(
    computeVehicleStatus({ aktivne: false, blokServisDnes: true, pocetPlatnychNajmov: 2 }),
    { stav: "VYRADENE", pocetNajmov: 2 }
  );
});

test("servisný blok dnes má prednosť pred prenájmom", () => {
  assert.deepEqual(
    computeVehicleStatus({ aktivne: true, blokServisDnes: true, pocetPlatnychNajmov: 1 }),
    { stav: "SERVIS", pocetNajmov: 1 }
  );
});

test("platný nájom → PRENAJATE", () => {
  assert.deepEqual(
    computeVehicleStatus({ aktivne: true, blokServisDnes: false, pocetPlatnychNajmov: 1 }),
    { stav: "PRENAJATE", pocetNajmov: 1 }
  );
});

test("viac vodičov na jednom aute nie je kolízia, len počet", () => {
  assert.deepEqual(
    computeVehicleStatus({ aktivne: true, blokServisDnes: false, pocetPlatnychNajmov: 3 }),
    { stav: "PRENAJATE", pocetNajmov: 3 }
  );
});

test("bez nájmu a servisu je VOLNE", () => {
  assert.deepEqual(
    computeVehicleStatus({ aktivne: true, blokServisDnes: false, pocetPlatnychNajmov: 0 }),
    { stav: "VOLNE", pocetNajmov: 0 }
  );
});

test("neplatný počet nájmov sa ošetrí (záporný/NaN → 0)", () => {
  assert.equal(
    computeVehicleStatus({ aktivne: true, blokServisDnes: false, pocetPlatnychNajmov: -2 }).stav,
    "VOLNE"
  );
  assert.equal(
    computeVehicleStatus({ aktivne: true, blokServisDnes: false, pocetPlatnychNajmov: NaN }).pocetNajmov,
    0
  );
});
