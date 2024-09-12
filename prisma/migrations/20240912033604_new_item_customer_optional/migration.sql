-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `items_customer_id_fkey`;

-- AlterTable
ALTER TABLE `items` MODIFY `customer_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
