/*
  Warnings:

  - Added the required column `type` to the `brands` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `brands` ADD COLUMN `type` VARCHAR(191) NOT NULL;
