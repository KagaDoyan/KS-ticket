/*
  Warnings:

  - You are about to drop the column `province_id` on the `engineers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `engineers` DROP FOREIGN KEY `engineers_province_id_fkey`;

-- AlterTable
ALTER TABLE `engineers` DROP COLUMN `province_id`;

-- CreateTable
CREATE TABLE `_engineersToprovinces` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_engineersToprovinces_AB_unique`(`A`, `B`),
    INDEX `_engineersToprovinces_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_engineersToprovinces` ADD CONSTRAINT `_engineersToprovinces_A_fkey` FOREIGN KEY (`A`) REFERENCES `engineers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_engineersToprovinces` ADD CONSTRAINT `_engineersToprovinces_B_fkey` FOREIGN KEY (`B`) REFERENCES `provinces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
