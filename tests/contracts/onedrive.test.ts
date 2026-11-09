import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildOneDrivePath,
  DEFAULT_ONEDRIVE_ROOT,
  getOneDriveConfig,
  getOneDriveUploader,
  NoopOneDriveUploader,
  normalizeOneDriveRoot,
  oneDriveFolderName,
} from "../../src/lib/contracts/onedrive";
import { PublicError } from "../../src/lib/safeLog";

test("config: default je vypnuté a s predvoleným koreňom", () => {
  const c = getOneDriveConfig({});
  assert.equal(c.enabled, false);
  assert.equal(c.root, DEFAULT_ONEDRIVE_ROOT);
  assert.equal(c.tenantId, "");
  assert.equal(c.driveId, "");
});

test("config: ONEDRIVE_ENABLED akceptuje true/1/yes/on, inak false", () => {
  for (const v of ["true", "TRUE", "1", "yes", " on "]) {
    assert.equal(getOneDriveConfig({ ONEDRIVE_ENABLED: v }).enabled, true, v);
  }
  for (const v of ["false", "0", "", "nie", "enabled"]) {
    assert.equal(getOneDriveConfig({ ONEDRIVE_ENABLED: v }).enabled, false, v);
  }
});

test("config: načíta hodnoty a orezáva medzery", () => {
  const c = getOneDriveConfig({
    ONEDRIVE_ENABLED: "true",
    MS_TENANT_ID: " t ",
    MS_CLIENT_ID: "c",
    MS_CLIENT_SECRET: "s",
    ONEDRIVE_DRIVE_ID: "d",
    ONEDRIVE_ROOT: "/Docs/Vodici/",
  });
  assert.deepEqual(c, {
    enabled: true,
    tenantId: "t",
    clientId: "c",
    clientSecret: "s",
    driveId: "d",
    root: "/Docs/Vodici",
  });
});

test("koreň: normalizácia lomítok a nebezpečných znakov", () => {
  assert.equal(normalizeOneDriveRoot("Documents//E-Taxi/"), "/Documents/E-Taxi");
  assert.equal(normalizeOneDriveRoot("\\a\\b"), "/a/b");
  assert.equal(normalizeOneDriveRoot("/a/../b"), "/a/b");
  assert.equal(normalizeOneDriveRoot(""), DEFAULT_ONEDRIVE_ROOT);
  assert.equal(normalizeOneDriveRoot("///"), DEFAULT_ONEDRIVE_ROOT);
});

test("cesta: {root}/{Priezvisko Meno}/{súbor}", () => {
  assert.equal(oneDriveFolderName("Kováč", "Ján"), "Kováč Ján");
  assert.equal(
    buildOneDrivePath(DEFAULT_ONEDRIVE_ROOT, "Kováč Ján", "2026-01-05_Najomna-zmluva_KE123AB_Kováč-Ján.docx"),
    "/Documents/E-Taxi/Vodici/Kováč Ján/2026-01-05_Najomna-zmluva_KE123AB_Kováč-Ján.docx"
  );
});

test("cesta: nebezpečné znaky v priečinku a názve sa odstránia", () => {
  const p = buildOneDrivePath("/R", "../Zlý/Meno", "a/../b:c.docx");
  assert.ok(p.startsWith("/R/"));
  assert.equal(p.split("/").length, 4, "presne root + priečinok + súbor");
  assert.ok(!p.includes(".."));
  assert.ok(!p.includes(":"));
  assert.equal(oneDriveFolderName("", ""), "bez-mena");
});

test("Noop: enabled=false a upload hádže PublicError", async () => {
  const u = new NoopOneDriveUploader();
  assert.equal(u.enabled, false);
  await assert.rejects(
    () => u.upload(),
    (e: unknown) => e instanceof PublicError && e.message === "OneDrive nie je zapnutý"
  );
});

test("getOneDriveUploader: zatiaľ vždy Noop", () => {
  const u = getOneDriveUploader();
  assert.equal(u.enabled, false);
  assert.ok(u instanceof NoopOneDriveUploader);
});
