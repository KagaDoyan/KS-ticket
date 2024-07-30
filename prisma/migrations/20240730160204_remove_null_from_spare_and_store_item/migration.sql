/*
  Warnings:

  - Made the column `item_brand` on table `spare_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item_category` on table `spare_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item_model` on table `spare_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item_sn` on table `spare_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warranty_exp` on table `spare_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item_brand` on table `store_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item_category` on table `store_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item_model` on table `store_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `item_sn` on table `store_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warranty_exp` on table `store_items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `spare_items` MODIFY `item_brand` VARCHAR(191) NOT NULL,
    MODIFY `item_category` VARCHAR(191) NOT NULL,
    MODIFY `item_model` VARCHAR(191) NOT NULL,
    MODIFY `item_sn` VARCHAR(191) NOT NULL,
    MODIFY `warranty_exp` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `store_items` MODIFY `item_brand` VARCHAR(191) NOT NULL,
    MODIFY `item_category` VARCHAR(191) NOT NULL,
    MODIFY `item_model` VARCHAR(191) NOT NULL,
    MODIFY `item_sn` VARCHAR(191) NOT NULL,
    MODIFY `warranty_exp` DATETIME(3) NOT NULL;
