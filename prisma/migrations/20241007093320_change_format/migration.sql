/*
  Warnings:

  - Made the column `sell_date` on table `inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `inventory` MODIFY `sell_date` VARCHAR(191) NOT NULL;
