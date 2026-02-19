/*
  Warnings:

  - A unique constraint covering the columns `[objectiveId]` on the table `OkrEmbedding` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `objectiveId` to the `OkrEmbedding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OkrEmbedding" ADD COLUMN     "objectiveId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OkrEmbedding_objectiveId_key" ON "OkrEmbedding"("objectiveId");

-- AddForeignKey
ALTER TABLE "OkrEmbedding" ADD CONSTRAINT "OkrEmbedding_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE CASCADE ON UPDATE CASCADE;
