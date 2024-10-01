-- AlterTable
ALTER TABLE `customers` ADD COLUMN `line_engineer_id` VARCHAR(191) NULL,
    ADD COLUMN `line_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `mail_recipient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
