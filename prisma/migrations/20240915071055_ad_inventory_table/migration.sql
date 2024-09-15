-- CreateTable
CREATE TABLE `inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `model` VARCHAR(191) NULL,
    `serial` VARCHAR(191) NULL,
    `warranty` VARCHAR(191) NULL,
    `sell_date` VARCHAR(191) NULL,
    `buyer_name` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
