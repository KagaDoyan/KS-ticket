/*
  Warnings:

  - You are about to drop the column `line_engineer_id` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `line_id` on the `customers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customers` DROP COLUMN `line_engineer_id`,
    DROP COLUMN `line_id`,
    ADD COLUMN `line_appointment` VARCHAR(191) NULL,
    ADD COLUMN `line_close` VARCHAR(191) NULL,
    ADD COLUMN `line_open` VARCHAR(191) NULL;
