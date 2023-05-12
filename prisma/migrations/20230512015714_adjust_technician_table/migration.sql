/*
  Warnings:

  - You are about to drop the `technicial_committee` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TECHNICIAN_TYPE" AS ENUM ('OFFICIAL', 'COMMITTEE');

-- DropForeignKey
ALTER TABLE "technicial_committee" DROP CONSTRAINT "technicial_committee_teamId_fkey";

-- DropTable
DROP TABLE "technicial_committee";

-- CreateTable
CREATE TABLE "technicians" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "birthDate" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "documentFile" TEXT NOT NULL,
    "type" "TECHNICIAN_TYPE" NOT NULL,
    "teamId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technicians_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "technicians" ADD CONSTRAINT "technicians_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
