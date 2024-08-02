/*
  Warnings:

  - You are about to drop the column `type` on the `spare_items` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `store_items` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `spare_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `spare_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `store_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `store_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `spare_items` DROP COLUMN `type`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by` INTEGER NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('in_stock', 'return', 'spare', 'repair') NOT NULL;

-- AlterTable
ALTER TABLE `store_items` DROP COLUMN `type`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by` INTEGER NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `status` ENUM('in_stock', 'return', 'spare', 'repair') NOT NULL;

-- CreateTable
CREATE TABLE `return_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `item_brand` VARCHAR(191) NOT NULL,
    `item_category` VARCHAR(191) NOT NULL,
    `item_model` VARCHAR(191) NOT NULL,
    `item_sn` VARCHAR(191) NOT NULL,
    `warranty_exp` DATETIME(3) NULL,
    `status` ENUM('in_stock', 'return', 'spare', 'repair') NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticket_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `return_items` ADD CONSTRAINT `return_items_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ticket_images` ADD CONSTRAINT `ticket_images_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
