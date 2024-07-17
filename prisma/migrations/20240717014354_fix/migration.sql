/*
  Warnings:

  - You are about to drop the column `customers_id` on the `shops` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `shops` DROP FOREIGN KEY `shops_customers_id_fkey`;

-- AlterTable
ALTER TABLE `shops` DROP COLUMN `customers_id`;
