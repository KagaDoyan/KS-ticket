/*
  Warnings:

  - You are about to drop the column `priority_group_id` on the `provinces` table. All the data in the column will be lost.
  - Added the required column `customers_id` to the `priority_groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `provinces` DROP FOREIGN KEY `provinces_priority_group_id_fkey`;

-- AlterTable
ALTER TABLE `priority_groups` ADD COLUMN `customers_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `provinces` DROP COLUMN `priority_group_id`;

-- AddForeignKey
ALTER TABLE `priority_groups` ADD CONSTRAINT `priority_groups_customers_id_fkey` FOREIGN KEY (`customers_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
