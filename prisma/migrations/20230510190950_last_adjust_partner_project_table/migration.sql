-- DropForeignKey
ALTER TABLE "partner_projects" DROP CONSTRAINT "partner_projects_federationId_fkey";

-- DropForeignKey
ALTER TABLE "partner_projects" DROP CONSTRAINT "partner_projects_teamId_fkey";

-- AlterTable
ALTER TABLE "partner_projects" ALTER COLUMN "federationId" DROP NOT NULL,
ALTER COLUMN "teamId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "partner_projects" ADD CONSTRAINT "partner_projects_federationId_fkey" FOREIGN KEY ("federationId") REFERENCES "federations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_projects" ADD CONSTRAINT "partner_projects_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
