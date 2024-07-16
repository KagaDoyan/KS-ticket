/*
  Warnings:

  - Added the required column `brand_id` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `models` DROP FOREIGN KEY `models_category_id_fkey`;

-- AlterTable
ALTER TABLE `items` ADD COLUMN `brand_id` INTEGER NOT NULL,
    ADD COLUMN `category_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
