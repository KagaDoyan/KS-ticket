/*
  Warnings:

  - The values [onCall] on the enum `tickets_ticket_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `tickets` MODIFY `ticket_status` ENUM('open', 'oncall', 'pending', 'spare', 'close') NOT NULL;

-- CreateTable
CREATE TABLE `teams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `team_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
