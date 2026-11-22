-- Koniec pravidelného predpisu (výskyty po tomto dátume sa nezobrazujú).
ALTER TABLE `Expense` ADD COLUMN `datumDo` DATE NULL;

-- Stav jednotlivých výskytov pravidelného výdavku: úhrada per výskyt a
-- vynechanie (zmazanie) jedného výskytu.
CREATE TABLE `ExpenseOccurrence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expenseId` INTEGER NOT NULL,
    `datum` DATE NOT NULL,
    `uhradene` BOOLEAN NOT NULL DEFAULT false,
    `uhradeneDna` DATETIME(3) NULL,
    `vynechany` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ExpenseOccurrence_expenseId_datum_key`(`expenseId`, `datum`),
    INDEX `ExpenseOccurrence_expenseId_idx`(`expenseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `ExpenseOccurrence` ADD CONSTRAINT `ExpenseOccurrence_expenseId_fkey` FOREIGN KEY (`expenseId`) REFERENCES `Expense`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
