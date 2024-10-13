-- CreateTable
CREATE TABLE `mail_signature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customers_id` INTEGER NOT NULL,
    `signature_body` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `mail_signature_customers_id_key`(`customers_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mail_signature` ADD CONSTRAINT `mail_signature_customers_id_fkey` FOREIGN KEY (`customers_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
