/*
  Warnings:

  - You are about to alter the column `resolve_status` on the `tickets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `tickets` MODIFY `resolve_status` BOOLEAN NULL;
