/*
  Warnings:

  - You are about to drop the column `node` on the `engineers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `engineers` DROP COLUMN `node`,
    ADD COLUMN `node_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `engineers` ADD CONSTRAINT `engineers_node_id_fkey` FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
