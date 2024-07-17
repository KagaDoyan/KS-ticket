/*
  Warnings:

  - You are about to drop the column `customersId` on the `shops` table. All the data in the column will be lost.
  - Added the required column `customers_id` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `shops` DROP FOREIGN KEY `shops_customersId_fkey`;

-- AlterTable
ALTER TABLE `shops` DROP COLUMN `customersId`,
    ADD COLUMN `customers_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `shops` ADD CONSTRAINT `shops_customers_id_fkey` FOREIGN KEY (`customers_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
