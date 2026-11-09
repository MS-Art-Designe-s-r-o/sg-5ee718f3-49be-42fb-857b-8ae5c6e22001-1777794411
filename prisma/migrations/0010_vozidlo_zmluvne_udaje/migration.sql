-- Modul zmlúv, fáza 2/3: zmluvné údaje vozidla.
-- Spätne kompatibilné — všetky nové stĺpce sú NULL alebo majú DEFAULT.
-- Pozn.: existujúci stĺpec `poistenie` (mesačný náklad) ostáva; nové poistné
-- stĺpce majú prefix pzp* / hav*.

-- AlterTable
ALTER TABLE `Vehicle`
    ADD COLUMN `vin` VARCHAR(17) NULL,
    ADD COLUMN `rokVyroby` SMALLINT NULL,
    ADD COLUMN `cisloTp` VARCHAR(30) NULL,
    ADD COLUMN `datumPrvejEvidencie` DATE NULL,
    ADD COLUMN `vlastnikTyp` ENUM('ETAXI', 'FLOTILA') NOT NULL DEFAULT 'ETAXI',
    ADD COLUMN `vlastnikFleetId` INTEGER NULL,
    ADD COLUMN `poistovna` VARCHAR(191) NULL,
    ADD COLUMN `pzpCislo` VARCHAR(50) NULL,
    ADD COLUMN `pzpPlatnostDo` DATE NULL,
    ADD COLUMN `havCislo` VARCHAR(50) NULL,
    ADD COLUMN `havPlatnostDo` DATE NULL,
    ADD COLUMN `stkPlatnostDo` DATE NULL,
    ADD COLUMN `ekPlatnostDo` DATE NULL,
    ADD COLUMN `stavKm` INTEGER NULL,
    ADD COLUMN `kaucia` DECIMAL(10, 2) NULL,
    ADD COLUMN `spoluucast` DECIMAL(10, 2) NULL;

-- CreateIndex: VIN je unikátny, ale povoľuje viac NULL (vozidlá bez VIN)
CREATE UNIQUE INDEX `Vehicle_vin_key` ON `Vehicle`(`vin`);

-- CreateIndex
CREATE INDEX `Vehicle_vlastnikFleetId_idx` ON `Vehicle`(`vlastnikFleetId`);

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_vlastnikFleetId_fkey` FOREIGN KEY (`vlastnikFleetId`) REFERENCES `Fleet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
