-- AlterTable
ALTER TABLE `tickets` ADD COLUMN `close_description` LONGTEXT NULL,
    MODIFY `solution` LONGTEXT NULL,
    MODIFY `investigation` LONGTEXT NULL;
