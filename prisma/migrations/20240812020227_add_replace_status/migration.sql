-- AlterTable
ALTER TABLE `items` MODIFY `status` ENUM('in_stock', 'return', 'spare', 'repair', 'replace') NOT NULL;

-- AlterTable
ALTER TABLE `return_items` MODIFY `status` ENUM('in_stock', 'return', 'spare', 'repair', 'replace') NOT NULL;

-- AlterTable
ALTER TABLE `spare_items` MODIFY `status` ENUM('in_stock', 'return', 'spare', 'repair', 'replace') NOT NULL;

-- AlterTable
ALTER TABLE `store_items` MODIFY `status` ENUM('in_stock', 'return', 'spare', 'repair', 'replace') NOT NULL;
