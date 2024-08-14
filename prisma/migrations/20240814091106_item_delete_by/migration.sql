-- AlterTable
ALTER TABLE `spare_items` ADD COLUMN `deleted_by` INTEGER NULL;

-- AlterTable
ALTER TABLE `store_items` ADD COLUMN `deleted_by` INTEGER NULL;
