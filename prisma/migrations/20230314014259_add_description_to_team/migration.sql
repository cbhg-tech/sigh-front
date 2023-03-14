/*
  Warnings:

  - Added the required column `description` to the `teams` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "description" TEXT NOT NULL;
