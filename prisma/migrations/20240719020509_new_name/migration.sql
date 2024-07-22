/*
  Warnings:

  - You are about to drop the column `inc_num` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `insure_exp_date` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `sn` on the `items` table. All the data in the column will be lost.
  - Added the required column `inc_number` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serial_number` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `items` DROP COLUMN `inc_num`,
    DROP COLUMN `insure_exp_date`,
    DROP COLUMN `sn`,
    ADD COLUMN `inc_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `serial_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `warranty_expiry_date` DATETIME(3) NULL,
    MODIFY `status` ENUM('in_stock', 'return', 'spare', 'repair') NOT NULL;
