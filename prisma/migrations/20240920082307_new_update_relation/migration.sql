/*
  Warnings:

  - A unique constraint covering the columns `[ticket_id]` on the table `return_ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `return_ticket_ticket_id_key` ON `return_ticket`(`ticket_id`);
