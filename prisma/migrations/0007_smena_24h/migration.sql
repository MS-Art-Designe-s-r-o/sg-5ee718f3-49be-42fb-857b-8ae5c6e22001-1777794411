-- 24-hodinová smena: obsadí dennú aj nočnú smenu vozidla naraz.
ALTER TABLE `Shift` MODIFY COLUMN `typ` ENUM('DENNA', 'NOCNA', 'VOLNO', 'H24') NOT NULL;
