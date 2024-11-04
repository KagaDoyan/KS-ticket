-- AlterTable
ALTER TABLE `items` MODIFY `item_type` ENUM('spare', 'replacement', 'brand') NULL;

-- AlterTable
ALTER TABLE `tickets` MODIFY `title` LONGTEXT NOT NULL;
