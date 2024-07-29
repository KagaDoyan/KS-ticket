-- DropForeignKey
ALTER TABLE `items` DROP FOREIGN KEY `items_engineers_id_fkey`;

-- AlterTable
ALTER TABLE `items` MODIFY `inc_number` VARCHAR(191) NULL,
    MODIFY `engineers_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_engineers_id_fkey` FOREIGN KEY (`engineers_id`) REFERENCES `engineers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
