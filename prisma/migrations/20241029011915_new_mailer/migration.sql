-- AlterTable
ALTER TABLE `customers` ADD COLUMN `customer_mailerId` INTEGER NULL;

-- CreateTable
CREATE TABLE `customer_mailer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sender_email` VARCHAR(191) NOT NULL,
    `sender_password` VARCHAR(191) NOT NULL,
    `sender_host` VARCHAR(191) NOT NULL,
    `sender_port` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_on_customer_mailer` (
    `customer_id` INTEGER NOT NULL,
    `customer_mailer_id` INTEGER NOT NULL,

    UNIQUE INDEX `customer_on_customer_mailer_customer_id_key`(`customer_id`),
    PRIMARY KEY (`customer_id`, `customer_mailer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_customer_mailerId_fkey` FOREIGN KEY (`customer_mailerId`) REFERENCES `customer_mailer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_on_customer_mailer` ADD CONSTRAINT `customer_on_customer_mailer_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_on_customer_mailer` ADD CONSTRAINT `customer_on_customer_mailer_customer_mailer_id_fkey` FOREIGN KEY (`customer_mailer_id`) REFERENCES `customer_mailer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
