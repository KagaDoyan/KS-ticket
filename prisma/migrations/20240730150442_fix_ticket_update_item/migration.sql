/*
  Warnings:

  - Added the required column `type` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `items` ADD COLUMN `type` ENUM('inside', 'outside') NOT NULL;

-- CreateTable
CREATE TABLE `store_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `item_brand` VARCHAR(191) NULL,
    `item_category` VARCHAR(191) NULL,
    `item_model` VARCHAR(191) NULL,
    `item_sn` VARCHAR(191) NULL,
    `warranty_exp` DATETIME(3) NULL,
    `type` ENUM('in_stock', 'return', 'spare', 'repair') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `spare_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `item_brand` VARCHAR(191) NULL,
    `item_category` VARCHAR(191) NULL,
    `item_model` VARCHAR(191) NULL,
    `item_sn` VARCHAR(191) NULL,
    `warranty_exp` DATETIME(3) NULL,
    `type` ENUM('in_stock', 'return', 'spare', 'repair') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `store_items` ADD CONSTRAINT `store_items_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `spare_items` ADD CONSTRAINT `spare_items_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
