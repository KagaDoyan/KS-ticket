-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `items_storage_id_fkey`;

-- AlterTable
ALTER TABLE `items` MODIFY `storage_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_storage_id_fkey` FOREIGN KEY (`storage_id`) REFERENCES `storages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
