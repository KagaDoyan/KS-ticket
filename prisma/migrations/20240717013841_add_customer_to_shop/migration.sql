-- AlterTable
ALTER TABLE `shops` ADD COLUMN `customers_id` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `shops` ADD CONSTRAINT `shops_customers_id_fkey` FOREIGN KEY (`customers_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
