-- CreateTable
CREATE TABLE `engineer_on_province` (
    `province_id` INTEGER NOT NULL,
    `engineer_id` INTEGER NOT NULL,

    PRIMARY KEY (`province_id`, `engineer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `engineer_on_province` ADD CONSTRAINT `engineer_on_province_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engineer_on_province` ADD CONSTRAINT `engineer_on_province_engineer_id_fkey` FOREIGN KEY (`engineer_id`) REFERENCES `engineers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
