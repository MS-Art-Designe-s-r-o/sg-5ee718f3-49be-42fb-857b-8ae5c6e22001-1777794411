-- AlterTable
ALTER TABLE `Vehicle` ADD COLUMN `lizing` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    ADD COLUMN `poistenie` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE `ExpenseCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nazov` VARCHAR(191) NOT NULL,
    `poradie` INTEGER NOT NULL DEFAULT 0,
    `aktivna` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `ExpenseCategory_nazov_key`(`nazov`),
    INDEX `ExpenseCategory_poradie_idx`(`poradie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datum` DATE NOT NULL,
    `popis` VARCHAR(191) NOT NULL,
    `suma` DECIMAL(10, 2) NOT NULL,
    `uhradene` BOOLEAN NOT NULL DEFAULT false,
    `uhradeneDna` DATETIME(3) NULL,
    `pravidelny` BOOLEAN NOT NULL DEFAULT false,
    `interval` ENUM('TYZDENNE', 'MESACNE', 'STVRTROCNE', 'POLROCNE', 'ROCNE') NULL,
    `categoryId` INTEGER NOT NULL,
    `vehicleId` INTEGER NULL,
    `zdroj` VARCHAR(191) NOT NULL DEFAULT 'MANUAL',
    `createdById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Expense_datum_idx`(`datum`),
    INDEX `Expense_categoryId_idx`(`categoryId`),
    INDEX `Expense_vehicleId_idx`(`vehicleId`),
    INDEX `Expense_pravidelny_idx`(`pravidelny`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `ExpenseCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

