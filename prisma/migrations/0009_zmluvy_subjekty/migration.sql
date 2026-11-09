-- Modul zmlúv, fáza 1/3: subjekty (firma, flotily, profily vodičov) a audit log.
-- Spätne kompatibilné — len nové tabuľky, existujúce sa nemenia.

-- CreateTable: údaje prevádzkovateľa (E-TAXI) — vždy práve jeden riadok s id = 1
CREATE TABLE `CompanyProfile` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `obchodneMeno` VARCHAR(191) NOT NULL,
    `ico` VARCHAR(20) NULL,
    `dic` VARCHAR(20) NULL,
    `icDph` VARCHAR(20) NULL,
    `sidlo` VARCHAR(255) NULL,
    `zapisanyV` VARCHAR(255) NULL,
    `statutar` VARCHAR(191) NULL,
    `statutarFunkcia` VARCHAR(191) NULL,
    `iban` VARCHAR(34) NULL,
    `email` VARCHAR(191) NULL,
    `telefon` VARCHAR(50) NULL,
    `web` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Predvyplnený riadok E-TAXI (statutára doplní majiteľ v UI)
INSERT IGNORE INTO `CompanyProfile` (`id`, `obchodneMeno`, `ico`, `dic`, `sidlo`, `zapisanyV`, `iban`)
VALUES (
    1,
    'E-TAXI Košice s.r.o.',
    '55423698',
    '2121985162',
    'Jenisejská 45A, 040 12 Košice',
    'Obchodný register Mestského súdu Košice, oddiel: Sro, vložka č. 56710/V',
    'SK93 0200 0000 0047 9242 9355'
);

-- CreateTable: flotila (externý prevádzkovateľ vozidiel)
CREATE TABLE `Fleet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `obchodneMeno` VARCHAR(191) NOT NULL,
    `ico` VARCHAR(20) NULL,
    `dic` VARCHAR(20) NULL,
    `icDph` VARCHAR(20) NULL,
    `sidlo` VARCHAR(255) NULL,
    `zapisanyV` VARCHAR(255) NULL,
    `statutar` VARCHAR(191) NULL,
    `cisloKoncesie` VARCHAR(50) NULL,
    `iban` VARCHAR(34) NULL,
    `kontaktMeno` VARCHAR(191) NULL,
    `kontaktTelefon` VARCHAR(50) NULL,
    `kontaktEmail` VARCHAR(191) NULL,
    `poznamka` VARCHAR(500) NULL,
    `aktivna` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Fleet_ico_key`(`ico`),
    INDEX `Fleet_aktivna_idx`(`aktivna`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: dohoda s flotilou (zmluva medzi E-TAXI a flotilou)
CREATE TABLE `FleetAgreement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fleetId` INTEGER NOT NULL,
    `cislo` VARCHAR(60) NOT NULL,
    `datumUzavretia` DATE NOT NULL,
    `platnostOd` DATE NOT NULL,
    `platnostDo` DATE NULL,
    `poznamka` VARCHAR(500) NULL,

    INDEX `FleetAgreement_fleetId_idx`(`fleetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: profil vodiča (osobné a zmluvné údaje, 1:1 s User).
-- Rodné číslo a číslo OP sú šifrované aplikačne (AES-256-GCM), rodneCisloBidx
-- je HMAC blind index len na detekciu duplicity.
CREATE TABLE `DriverProfile` (
    `userId` INTEGER NOT NULL,
    `titulPred` VARCHAR(50) NULL,
    `titulZa` VARCHAR(50) NULL,
    `datumNarodenia` DATE NULL,
    `rodneCisloEnc` VARCHAR(255) NULL,
    `rodneCisloBidx` CHAR(64) NULL,
    `cisloOpEnc` VARCHAR(255) NULL,
    `trvalyPobyt` VARCHAR(255) NULL,
    `cisloVp` VARCHAR(50) NULL,
    `cisloPvt` VARCHAR(50) NULL,
    `pvtPlatnostDo` DATE NULL,
    `iban` VARCHAR(34) NULL,
    `stav` ENUM('AKTIVNY', 'POZASTAVENY', 'UKONCENY') NOT NULL DEFAULT 'AKTIVNY',
    `fleetId` INTEGER NULL,
    `rezim` ENUM('VO_FLOTILE', 'VLASTNA_KONCESIA') NULL,
    `stranaTyp` ENUM('FYZICKA_OSOBA', 'PRAVNICKA_OSOBA') NULL,
    `firmaObchodneMeno` VARCHAR(191) NULL,
    `firmaIco` VARCHAR(20) NULL,
    `firmaDic` VARCHAR(20) NULL,
    `firmaIcDph` VARCHAR(20) NULL,
    `firmaSidlo` VARCHAR(255) NULL,
    `firmaZapisanyV` VARCHAR(255) NULL,
    `cisloKoncesie` VARCHAR(50) NULL,
    `koncesiaPlatnostDo` DATE NULL,
    `firmaStatutar` VARCHAR(191) NULL,
    `anonymizedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DriverProfile_rodneCisloBidx_key`(`rodneCisloBidx`),
    INDEX `DriverProfile_fleetId_idx`(`fleetId`),
    INDEX `DriverProfile_stav_idx`(`stav`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: audit log (len INSERT; retencia 5 rokov rieši skript)
CREATE TABLE `AuditLog` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NULL,
    `action` VARCHAR(40) NOT NULL,
    `entity` VARCHAR(30) NOT NULL,
    `entityId` INTEGER NULL,
    `ip` VARCHAR(45) NULL,
    `meta` JSON NULL,

    INDEX `AuditLog_entity_entityId_idx`(`entity`, `entityId`),
    INDEX `AuditLog_userId_at_idx`(`userId`, `at`),
    INDEX `AuditLog_at_idx`(`at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FleetAgreement` ADD CONSTRAINT `FleetAgreement_fleetId_fkey` FOREIGN KEY (`fleetId`) REFERENCES `Fleet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `DriverProfile` ADD CONSTRAINT `DriverProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `DriverProfile` ADD CONSTRAINT `DriverProfile_fleetId_fkey` FOREIGN KEY (`fleetId`) REFERENCES `Fleet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
