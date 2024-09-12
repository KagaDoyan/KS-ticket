/*
  Warnings:

  - Added the required column `storage_id` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `items` ADD COLUMN `storage_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_storage_id_fkey` FOREIGN KEY (`storage_id`) REFERENCES `storages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
