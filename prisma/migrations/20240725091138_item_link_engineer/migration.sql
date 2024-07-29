/*
  Warnings:

  - Added the required column `engineers_id` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `items` ADD COLUMN `engineers_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_engineers_id_fkey` FOREIGN KEY (`engineers_id`) REFERENCES `engineers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
