/*
  Warnings:

  - Added the required column `customersId` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shops` ADD COLUMN `customersId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `shops` ADD CONSTRAINT `shops_customersId_fkey` FOREIGN KEY (`customersId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
