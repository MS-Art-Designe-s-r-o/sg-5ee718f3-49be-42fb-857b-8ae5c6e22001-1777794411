-- Modul zmlúv, fáza 3/3: šablóny, číselník čísel zmlúv a samotné zmluvy.
-- Spätne kompatibilné — len nové tabuľky.

-- CreateTable: šablóna zmluvy (DOCX uložený na disku, v DB len relatívna cesta)
CREATE TABLE `ContractTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `typ` ENUM('NAJOM', 'DISPECING') NOT NULL,
    `nazov` VARCHAR(191) NOT NULL,
    `verzia` INTEGER NOT NULL,
    `suborPath` VARCHAR(500) NOT NULL,
    `sha256` CHAR(64) NOT NULL,
    `platnaOd` DATE NOT NULL,
    `aktivna` BOOLEAN NOT NULL DEFAULT false,
    -- Generovaný stĺpec: nesie `typ` len pre aktívnu šablónu, inak NULL. UNIQUE
    -- nad ním zaručí najviac jednu aktívnu šablónu na typ (NULL sa môže opakovať).
    -- STORED + UNIQUE funguje v MySQL 5.7+ aj MariaDB 10.2.1+.
    `aktivnaTyp` VARCHAR(10) GENERATED ALWAYS AS (IF(`aktivna`, `typ`, NULL)) STORED,
    `tagy` JSON NULL,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ContractTemplate_aktivnaTyp_key`(`aktivnaTyp`),
    UNIQUE INDEX `ContractTemplate_typ_verzia_key`(`typ`, `verzia`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: číselník poradových čísel (NZ-RRRR-NNN / DS-RRRR-NNN)
CREATE TABLE `ContractSequence` (
    `prefix` VARCHAR(4) NOT NULL,
    `rok` SMALLINT NOT NULL,
    `posledne` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`prefix`, `rok`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: zmluva (nájomná alebo dispečerská). Vygenerovaný dokument sa
-- nikdy neprerenderuje — platí šifrovaný snapshot údajov v čase generovania.
CREATE TABLE `Contract` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cislo` VARCHAR(20) NOT NULL,
    `verzia` INTEGER NOT NULL DEFAULT 1,
    `nahradzaId` INTEGER NULL,
    `typ` ENUM('NAJOM', 'DISPECING') NOT NULL,
    `driverId` INTEGER NOT NULL,
    `fleetId` INTEGER NULL,
    `vehicleId` INTEGER NULL,
    `templateId` INTEGER NOT NULL,
    `datumUzavretia` DATE NOT NULL,
    `platnostOd` DATE NOT NULL,
    `platnostDo` DATE NULL,
    `najomneSuma` DECIMAL(10, 2) NULL,
    `najomneJednotka` ENUM('ZMENA', 'DEN', 'TYZDEN', 'MESIAC') NOT NULL DEFAULT 'ZMENA',
    `najomne24h` DECIMAL(10, 2) NULL,
    `kaucia` DECIMAL(10, 2) NULL,
    `spoluucast` DECIMAL(10, 2) NULL,
    `stavKmOdovzdanie` INTEGER NULL,
    `provizia` DECIMAL(5, 2) NULL,
    `poplatokRegistracny` DECIMAL(10, 2) NULL,
    `stav` ENUM('NAVRH', 'VYGENEROVANA', 'PODPISANA', 'UKONCENA', 'NAHRADENA') NOT NULL DEFAULT 'NAVRH',
    `podpisanaDna` DATE NULL,
    `ukoncenaDna` DATE NULL,
    `docxPath` VARCHAR(500) NOT NULL,
    `pdfPath` VARCHAR(500) NULL,
    `snapshotEnc` MEDIUMTEXT NOT NULL,
    `snapshotSha256` CHAR(64) NOT NULL,
    `onedriveItemId` VARCHAR(191) NULL,
    `onedriveSyncedAt` DATETIME(3) NULL,
    `onedriveError` VARCHAR(500) NULL,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Contract_cislo_verzia_key`(`cislo`, `verzia`),
    INDEX `Contract_driverId_idx`(`driverId`),
    INDEX `Contract_vehicleId_stav_idx`(`vehicleId`, `stav`),
    INDEX `Contract_typ_stav_idx`(`typ`, `stav`),
    INDEX `Contract_nahradzaId_idx`(`nahradzaId`),
    INDEX `Contract_fleetId_idx`(`fleetId`),
    INDEX `Contract_templateId_idx`(`templateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contract` ADD CONSTRAINT `Contract_nahradzaId_fkey` FOREIGN KEY (`nahradzaId`) REFERENCES `Contract`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Contract` ADD CONSTRAINT `Contract_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `Contract` ADD CONSTRAINT `Contract_fleetId_fkey` FOREIGN KEY (`fleetId`) REFERENCES `Fleet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Contract` ADD CONSTRAINT `Contract_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Contract` ADD CONSTRAINT `Contract_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `ContractTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
