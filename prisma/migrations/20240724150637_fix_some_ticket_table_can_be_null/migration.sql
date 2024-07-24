/*
  Warnings:

  - You are about to alter the column `created_by` on the `tickets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `updated_by` on the `tickets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `tickets` MODIFY `open_date` VARCHAR(191) NOT NULL,
    MODIFY `open_time` VARCHAR(191) NOT NULL,
    MODIFY `close_date` VARCHAR(191) NOT NULL,
    MODIFY `close_time` VARCHAR(191) NOT NULL,
    MODIFY `created_by` INTEGER NOT NULL,
    MODIFY `updated_by` INTEGER NOT NULL,
    MODIFY `appointment_date` VARCHAR(191) NOT NULL,
    MODIFY `appointment_time` VARCHAR(191) NOT NULL,
    MODIFY `solution` VARCHAR(191) NULL,
    MODIFY `investigation` VARCHAR(191) NULL,
    MODIFY `item_brand` VARCHAR(191) NULL,
    MODIFY `item_category` VARCHAR(191) NULL,
    MODIFY `item_model` VARCHAR(191) NULL,
    MODIFY `item_sn` VARCHAR(191) NULL,
    MODIFY `warranty_exp` DATETIME(3) NULL,
    MODIFY `resolve_status` VARCHAR(191) NULL,
    MODIFY `resolve_remark` VARCHAR(191) NULL,
    MODIFY `action` ENUM('repair', 'clean', 'spare', 'replace') NULL,
    MODIFY `time_in` DATETIME(3) NULL,
    MODIFY `time_out` DATETIME(3) NULL;
