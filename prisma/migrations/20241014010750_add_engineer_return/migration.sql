-- AlterTable
ALTER TABLE `return_ticket` ADD COLUMN `engineer_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `return_ticket` ADD CONSTRAINT `return_ticket_engineer_id_fkey` FOREIGN KEY (`engineer_id`) REFERENCES `engineers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
