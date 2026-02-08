/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `KeyResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KeyResult" DROP COLUMN "updatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
