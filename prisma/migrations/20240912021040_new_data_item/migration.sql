/*
  Warnings:

  - Added the required column `customer_id` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `items` ADD COLUMN `customer_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
