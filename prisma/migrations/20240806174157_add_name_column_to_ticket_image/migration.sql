/*
  Warnings:

  - Added the required column `name` to the `ticket_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticket_images` ADD COLUMN `name` VARCHAR(191) NOT NULL;
