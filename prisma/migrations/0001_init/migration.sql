-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NULL,
    `meno` VARCHAR(191) NOT NULL,
    `priezvisko` VARCHAR(191) NOT NULL,
    `telefon` VARCHAR(191) NULL,
    `volaciZnak` VARCHAR(191) NULL,
    `aktivny` BOOLEAN NOT NULL DEFAULT true,
    `mustSetPassword` BOOLEAN NOT NULL DEFAULT true,
    `registracnyPoplatokUhradeny` BOOLEAN NOT NULL DEFAULT false,
    `registracnyPoplatokDna` DATETIME(3) NULL,
    `passwordResetToken` VARCHAR(191) NULL,
    `passwordResetExpires` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_volaciZnak_key`(`volaciZnak`),
    UNIQUE INDEX `User_passwordResetToken_key`(`passwordResetToken`),
    INDEX `User_aktivny_idx`(`aktivny`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `role` ENUM('MAJITEL', 'DISPECER', 'VODIC') NOT NULL,

    INDEX `UserRole_role_idx`(`role`),
    UNIQUE INDEX `UserRole_userId_role_key`(`userId`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nazov` VARCHAR(191) NOT NULL,
    `znacka` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `farba` VARCHAR(191) NOT NULL,
    `spz` VARCHAR(191) NOT NULL,
    `druhPohonu` ENUM('ELEKTRO', 'HYBRID', 'BENZIN', 'DIESEL', 'LPG', 'CNG') NOT NULL,
    `poplatokZaSmenu` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `aktivne` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vehicle_spz_key`(`spz`),
    INDEX `Vehicle_aktivne_idx`(`aktivne`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datum` DATE NOT NULL,
    `typ` ENUM('DENNA', 'NOCNA', 'VOLNO') NOT NULL,
    `poznamka` VARCHAR(191) NULL,
    `poplatokZaSmenu` DECIMAL(10, 2) NULL,
    `poplatokUhradeny` BOOLEAN NOT NULL DEFAULT false,
    `poplatokUhradenyDna` DATETIME(3) NULL,
    `driverId` INTEGER NOT NULL,
    `vehicleId` INTEGER NULL,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Shift_datum_idx`(`datum`),
    INDEX `Shift_vehicleId_datum_idx`(`vehicleId`, `datum`),
    INDEX `Shift_poplatokUhradeny_idx`(`poplatokUhradeny`),
    UNIQUE INDEX `Shift_driverId_datum_key`(`driverId`, `datum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Revenue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `driverId` INTEGER NOT NULL,
    `isoRok` INTEGER NOT NULL,
    `isoTyzden` INTEGER NOT NULL,
    `trzba` DECIMAL(10, 2) NOT NULL,
    `poplatokApp` DECIMAL(10, 2) NOT NULL,
    `provizia` DECIMAL(10, 2) NOT NULL,
    `celkovyPoplatok` DECIMAL(10, 2) NOT NULL,
    `uhradene` BOOLEAN NOT NULL DEFAULT false,
    `uhradeneDna` DATETIME(3) NULL,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Revenue_isoRok_isoTyzden_idx`(`isoRok`, `isoTyzden`),
    INDEX `Revenue_uhradene_idx`(`uhradene`),
    UNIQUE INDEX `Revenue_driverId_isoRok_isoTyzden_key`(`driverId`, `isoRok`, `isoTyzden`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeeTier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trzbaOd` DECIMAL(10, 2) NOT NULL,
    `trzbaDo` DECIMAL(10, 2) NULL,
    `poplatok` DECIMAL(10, 2) NOT NULL,
    `poradie` INTEGER NOT NULL DEFAULT 0,

    INDEX `FeeTier_poradie_idx`(`poradie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AppSetting` (
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRole` ADD CONSTRAINT `UserRole_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Revenue` ADD CONSTRAINT `Revenue_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Revenue` ADD CONSTRAINT `Revenue_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

