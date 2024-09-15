/*
  Warnings:

  - Added the required column `engineer_id` to the `return_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `return_items` ADD COLUMN `engineer_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `return_items` ADD CONSTRAINT `return_items_engineer_id_fkey` FOREIGN KEY (`engineer_id`) REFERENCES `engineers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
