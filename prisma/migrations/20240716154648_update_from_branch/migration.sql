/*
  Warnings:

  - Added the required column `created_by` to the `provinces` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority_group_id` to the `provinces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `provinces` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by` INTEGER NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL,
    ADD COLUMN `priority_group_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `brands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `models` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sn` VARCHAR(191) NOT NULL,
    `model_id` INTEGER NOT NULL,
    `insure_exp_date` DATETIME(3) NULL,
    `inc_num` VARCHAR(191) NOT NULL,
    `status` ENUM('return', 'spare', 'repair') NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `priority_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `group_name` VARCHAR(191) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `priorities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `time_sec` VARCHAR(191) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `engineers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `line_name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `province_id` INTEGER NOT NULL,
    `node` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inc_number` VARCHAR(191) NOT NULL,
    `ticket_number` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `store_id` INTEGER NOT NULL,
    `open_date` DATE NOT NULL,
    `open_time` TIME NOT NULL,
    `close_date` DATE NOT NULL,
    `close_time` TIME NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `due_by` VARCHAR(191) NOT NULL,
    `sla_priority_level` VARCHAR(191) NOT NULL,
    `contact_name` VARCHAR(191) NOT NULL,
    `contact_tel` VARCHAR(191) NOT NULL,
    `assigned_to` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `updated_by` VARCHAR(191) NOT NULL,
    `ticket_status` ENUM('open', 'pending', 'spare', 'close') NOT NULL,
    `appointment_date` DATE NOT NULL,
    `appointment_time` TIME NOT NULL,
    `engineer_id` INTEGER NOT NULL,
    `solution` VARCHAR(191) NOT NULL,
    `investigation` VARCHAR(191) NOT NULL,
    `item_brand` VARCHAR(191) NOT NULL,
    `item_category` VARCHAR(191) NOT NULL,
    `item_model` VARCHAR(191) NOT NULL,
    `item_sn` VARCHAR(191) NOT NULL,
    `warranty_exp` DATETIME(3) NOT NULL,
    `resolve_status` VARCHAR(191) NOT NULL,
    `resolve_remark` VARCHAR(191) NOT NULL,
    `action` ENUM('repair', 'clean', 'spare', 'replace') NOT NULL,
    `time_in` DATETIME(3) NOT NULL,
    `time_out` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `provinces` ADD CONSTRAINT `provinces_priority_group_id_fkey` FOREIGN KEY (`priority_group_id`) REFERENCES `priority_groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `models` ADD CONSTRAINT `models_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `models`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engineers` ADD CONSTRAINT `engineers_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
