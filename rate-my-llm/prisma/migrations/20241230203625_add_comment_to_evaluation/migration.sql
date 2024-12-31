/*
  Warnings:

  - Made the column `rating` on table `Evaluation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "comment" TEXT,
ALTER COLUMN "rating" SET NOT NULL;
