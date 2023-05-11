/*
  Warnings:

  - Changed the type of `malePractitioners` on the `partner_projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `femalePractitioners` on the `partner_projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "partner_projects" DROP COLUMN "malePractitioners",
ADD COLUMN     "malePractitioners" INTEGER NOT NULL,
DROP COLUMN "femalePractitioners",
ADD COLUMN     "femalePractitioners" INTEGER NOT NULL;
