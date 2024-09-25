-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_priority_id_fkey` FOREIGN KEY (`priority_id`) REFERENCES `priorities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
