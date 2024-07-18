-- AddForeignKey
ALTER TABLE `engineers` ADD CONSTRAINT `engineers_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
