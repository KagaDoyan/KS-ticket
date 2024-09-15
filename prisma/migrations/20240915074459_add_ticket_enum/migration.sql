-- AlterTable
ALTER TABLE `tickets` MODIFY `ticket_status` ENUM('open', 'onCall', 'pending', 'spare', 'close') NOT NULL;
