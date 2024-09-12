-- CreateTable
CREATE TABLE `priority_group_province` (
    `priority_group_id` INTEGER NOT NULL,
    `province_id` INTEGER NOT NULL,

    PRIMARY KEY (`priority_group_id`, `province_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PriorityGroupProvince` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PriorityGroupProvince_AB_unique`(`A`, `B`),
    INDEX `_PriorityGroupProvince_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `priority_group_province` ADD CONSTRAINT `priority_group_province_priority_group_id_fkey` FOREIGN KEY (`priority_group_id`) REFERENCES `priority_groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `priority_group_province` ADD CONSTRAINT `priority_group_province_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PriorityGroupProvince` ADD CONSTRAINT `_PriorityGroupProvince_A_fkey` FOREIGN KEY (`A`) REFERENCES `priority_groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PriorityGroupProvince` ADD CONSTRAINT `_PriorityGroupProvince_B_fkey` FOREIGN KEY (`B`) REFERENCES `provinces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
