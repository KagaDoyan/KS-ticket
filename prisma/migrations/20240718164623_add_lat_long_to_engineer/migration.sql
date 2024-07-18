/*
  Warnings:

  - You are about to drop the column `location` on the `engineers` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `engineers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `engineers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `engineers` DROP COLUMN `location`,
    ADD COLUMN `latitude` VARCHAR(191) NOT NULL,
    ADD COLUMN `longitude` VARCHAR(191) NOT NULL;
