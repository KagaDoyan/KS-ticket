/*
  Warnings:

  - Added the required column `created_by` to the `nodes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `nodes` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by` INTEGER NOT NULL,
    ADD COLUMN `deleted_at` DATETIME(3) NULL;
