-- Cena za 24h prenájom vozidla (popri cene za 12h smenu).
ALTER TABLE `Vehicle` ADD COLUMN `poplatokZa24h` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- Uložené vlastné rotačné vzory smien.
CREATE TABLE `ShiftPattern` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nazov` VARCHAR(191) NOT NULL,
    `dni` VARCHAR(400) NOT NULL,
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
