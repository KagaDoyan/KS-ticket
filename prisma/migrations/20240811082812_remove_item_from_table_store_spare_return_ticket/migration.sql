/*
  Warnings:

  - You are about to drop the column `item_brand` on the `return_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_category` on the `return_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_model` on the `return_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_sn` on the `return_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_brand` on the `spare_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_category` on the `spare_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_model` on the `spare_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_sn` on the `spare_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_brand` on the `store_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_category` on the `store_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_model` on the `store_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_sn` on the `store_items` table. All the data in the column will be lost.
  - Added the required column `brand` to the `return_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `return_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `return_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sn` to the `return_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `spare_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `spare_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `spare_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sn` to the `spare_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `store_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `store_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `store_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sn` to the `store_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `return_items` DROP COLUMN `item_brand`,
    DROP COLUMN `item_category`,
    DROP COLUMN `item_model`,
    DROP COLUMN `item_sn`,
    ADD COLUMN `brand` VARCHAR(191) NOT NULL,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `model` VARCHAR(191) NOT NULL,
    ADD COLUMN `sn` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `spare_items` DROP COLUMN `item_brand`,
    DROP COLUMN `item_category`,
    DROP COLUMN `item_model`,
    DROP COLUMN `item_sn`,
    ADD COLUMN `brand` VARCHAR(191) NOT NULL,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `model` VARCHAR(191) NOT NULL,
    ADD COLUMN `sn` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `store_items` DROP COLUMN `item_brand`,
    DROP COLUMN `item_category`,
    DROP COLUMN `item_model`,
    DROP COLUMN `item_sn`,
    ADD COLUMN `brand` VARCHAR(191) NOT NULL,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `model` VARCHAR(191) NOT NULL,
    ADD COLUMN `sn` VARCHAR(191) NOT NULL;
