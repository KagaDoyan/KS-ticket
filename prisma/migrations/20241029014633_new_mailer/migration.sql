/*
  Warnings:

  - You are about to drop the column `customer_mailerId` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the `customer_on_customer_mailer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `customer_on_customer_mailer` DROP FOREIGN KEY `customer_on_customer_mailer_customer_id_fkey`;

-- DropForeignKey
ALTER TABLE `customer_on_customer_mailer` DROP FOREIGN KEY `customer_on_customer_mailer_customer_mailer_id_fkey`;

-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `customers_customer_mailerId_fkey`;

-- AlterTable
ALTER TABLE `customers` DROP COLUMN `customer_mailerId`;

-- DropTable
DROP TABLE `customer_on_customer_mailer`;

-- CreateTable
CREATE TABLE `_customer_on_customer_mailer` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_customer_on_customer_mailer_AB_unique`(`A`, `B`),
    INDEX `_customer_on_customer_mailer_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_customer_on_customer_mailer` ADD CONSTRAINT `_customer_on_customer_mailer_A_fkey` FOREIGN KEY (`A`) REFERENCES `customer_mailer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_customer_on_customer_mailer` ADD CONSTRAINT `_customer_on_customer_mailer_B_fkey` FOREIGN KEY (`B`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
