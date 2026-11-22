-- AlterTable: rozsah bloku (celý deň / denná / nočná) — pri viacdňovom
-- intervale platí pre posledný deň, ostatné dni sú blokované celý deň.
ALTER TABLE `VehicleBlock` ADD COLUMN `rozsah` ENUM('CELY_DEN', 'DENNA', 'NOCNA') NOT NULL DEFAULT 'CELY_DEN';
