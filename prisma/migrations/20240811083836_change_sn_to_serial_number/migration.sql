/*
  Warnings:

  - You are about to drop the column `sn` on the `return_items` table. All the data in the column will be lost.
  - You are about to drop the column `sn` on the `spare_items` table. All the data in the column will be lost.
  - You are about to drop the column `sn` on the `store_items` table. All the data in the column will be lost.
  - Added the required column `serial_number` to the `return_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serial_number` to the `spare_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serial_number` to the `store_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `return_items` DROP COLUMN `sn`,
    ADD COLUMN `serial_number` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `spare_items` DROP COLUMN `sn`,
    ADD COLUMN `serial_number` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `store_items` DROP COLUMN `sn`,
    ADD COLUMN `serial_number` VARCHAR(191) NOT NULL;
