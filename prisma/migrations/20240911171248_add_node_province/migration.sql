-- CreateTable
CREATE TABLE `nodes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `node_on_province` (
    `province_id` INTEGER NOT NULL,
    `node_id` INTEGER NOT NULL,

    PRIMARY KEY (`province_id`, `node_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_nodesToprovinces` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_nodesToprovinces_AB_unique`(`A`, `B`),
    INDEX `_nodesToprovinces_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `node_on_province` ADD CONSTRAINT `node_on_province_province_id_fkey` FOREIGN KEY (`province_id`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `node_on_province` ADD CONSTRAINT `node_on_province_node_id_fkey` FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_nodesToprovinces` ADD CONSTRAINT `_nodesToprovinces_A_fkey` FOREIGN KEY (`A`) REFERENCES `nodes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_nodesToprovinces` ADD CONSTRAINT `_nodesToprovinces_B_fkey` FOREIGN KEY (`B`) REFERENCES `provinces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
