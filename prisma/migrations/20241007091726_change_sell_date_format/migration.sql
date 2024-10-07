/*
  Warnings:

  - You are about to alter the column `sell_date` on the `inventory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `inventory` MODIFY `sell_date` DATETIME(3) NULL;
