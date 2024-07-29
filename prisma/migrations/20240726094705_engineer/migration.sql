/*
  Warnings:

  - You are about to drop the column `store_id` on the `tickets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tickets` DROP COLUMN `store_id`,
    ADD COLUMN `shop_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_shop_id_fkey` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
