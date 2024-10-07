-- AlterTable
ALTER TABLE `mail_recipient` ADD COLUMN `customer_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `mail_recipient` ADD CONSTRAINT `mail_recipient_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
