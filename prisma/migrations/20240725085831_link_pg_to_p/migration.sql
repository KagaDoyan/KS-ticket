/*
  Warnings:

  - Added the required column `priority_groups_id` to the `priorities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `priorities` ADD COLUMN `priority_groups_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `priorities` ADD CONSTRAINT `priorities_priority_groups_id_fkey` FOREIGN KEY (`priority_groups_id`) REFERENCES `priority_groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
