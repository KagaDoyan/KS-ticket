/*
  Warnings:

  - You are about to drop the column `category_id` on the `models` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `models_category_id_fkey` ON `models`;

-- AlterTable
ALTER TABLE `models` DROP COLUMN `category_id`;
