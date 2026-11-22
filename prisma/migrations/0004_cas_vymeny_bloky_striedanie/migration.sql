-- AlterTable: čas výmeny na vozidle
ALTER TABLE `Vehicle` ADD COLUMN `casVymeny` VARCHAR(5) NULL;

-- AlterTable: miesto striedania vodiča (pre kontakty na kolegov)
ALTER TABLE `User` ADD COLUMN `miestoStriedania` VARCHAR(191) NULL;

-- CreateTable: časové blokovanie vozidla (nedostupné / servis)
CREATE TABLE `VehicleBlock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleId` INTEGER NOT NULL,
    `typ` ENUM('NEDOSTUPNE', 'SERVIS') NOT NULL,
    `datumOd` DATE NOT NULL,
    `datumDo` DATE NOT NULL,
    `poznamka` VARCHAR(191) NULL,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `VehicleBlock_vehicleId_datumOd_datumDo_idx`(`vehicleId`, `datumOd`, `datumDo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VehicleBlock` ADD CONSTRAINT `VehicleBlock_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
