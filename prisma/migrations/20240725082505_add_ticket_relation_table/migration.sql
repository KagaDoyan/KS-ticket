-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `customers_created_by_fkey`;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_engineer_id_fkey` FOREIGN KEY (`engineer_id`) REFERENCES `engineers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
