/*
  Warnings:

  - You are about to alter the column `action` on the `tickets` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(6))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `tickets` MODIFY `action` VARCHAR(191) NULL;
