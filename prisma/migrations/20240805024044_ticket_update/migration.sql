/*
  Warnings:

  - You are about to alter the column `warranty_exp` on the `tickets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `tickets` MODIFY `warranty_exp` DATETIME(3) NULL,
    MODIFY `time_in` VARCHAR(191) NULL,
    MODIFY `time_out` VARCHAR(191) NULL;
