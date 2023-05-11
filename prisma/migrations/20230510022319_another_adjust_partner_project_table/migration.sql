/*
  Warnings:

  - You are about to drop the column `logo` on the `partner_projects` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `partner_projects` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `partner_projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "partner_projects" DROP COLUMN "logo",
DROP COLUMN "street",
DROP COLUMN "url";
