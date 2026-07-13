/*
  Warnings:

  - Added the required column `status` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ASSIGNED', 'PEDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "status" "Status" NOT NULL;
