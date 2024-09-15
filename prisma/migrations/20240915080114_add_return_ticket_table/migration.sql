-- CreateTable
CREATE TABLE `return_ticket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `investigation` VARCHAR(191) NULL,
    `solution` VARCHAR(191) NULL,
    `item_brand` VARCHAR(191) NULL,
    `item_category` VARCHAR(191) NULL,
    `item_model` VARCHAR(191) NULL,
    `item_sn` VARCHAR(191) NULL,
    `warranty_exp` DATETIME(3) NULL,
    `resolve_status` BOOLEAN NULL,
    `resolve_remark` VARCHAR(191) NULL,
    `action` VARCHAR(191) NULL,
    `time_in` VARCHAR(191) NULL,
    `time_out` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `return_ticket` ADD CONSTRAINT `return_ticket_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
