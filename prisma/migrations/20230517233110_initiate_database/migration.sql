-- CreateEnum
CREATE TYPE "USER_TYPE" AS ENUM ('ADMIN', 'ATHLETE');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'ADMINFEDERATION', 'ADMINTEAM');

-- CreateEnum
CREATE TYPE "USER_STATUS" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "EVENT_STATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LOG_TYPE" AS ENUM ('TRANSFER', 'APPROVAL');

-- CreateEnum
CREATE TYPE "TECHNICIAN_TYPE" AS ENUM ('OFFICIAL', 'COMMITTEE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "USER_TYPE" NOT NULL,
    "status" "USER_STATUS" NOT NULL DEFAULT 'ACTIVE',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "ROLE" NOT NULL,
    "federationId" INTEGER,
    "teamId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "document" TEXT NOT NULL,
    "registerNumber" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "birthDate" TEXT NOT NULL,
    "phone" INTEGER,
    "nickname" TEXT,
    "gender" TEXT,
    "emergencyName" TEXT,
    "emergencyPhone" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "state" TEXT,
    "cep" TEXT,
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "athleteId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "rgNumber" TEXT,
    "rgEmissionDate" TEXT,
    "rgEmissionOrg" TEXT,
    "personalDocument" TEXT,
    "noc" TEXT,
    "medicalCertificate" TEXT,
    "commitmentTerm" TEXT,
    "athleteId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospital_data" (
    "id" SERIAL NOT NULL,
    "bloodType" TEXT,
    "allergies" TEXT,
    "chronicDiseases" TEXT,
    "medications" TEXT,
    "athleteId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hospital_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "federations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "email" TEXT NOT NULL,
    "presidentName" TEXT NOT NULL,
    "beginningOfTerm" TEXT NOT NULL,
    "endOfTerm" TEXT NOT NULL,
    "electionMinutes" TEXT NOT NULL,
    "presidentDocument" TEXT NOT NULL,
    "federationDocument" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "federations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "coachName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "presidentName" TEXT NOT NULL,
    "beginningOfTerm" TEXT NOT NULL,
    "endOfTerm" TEXT NOT NULL,
    "electionMinutes" TEXT NOT NULL,
    "presidentDocument" TEXT NOT NULL,
    "teamDocument" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "federationId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "initialDate" TEXT NOT NULL,
    "finalDate" TEXT NOT NULL,
    "practitioners" INTEGER NOT NULL,
    "malePractitioners" INTEGER NOT NULL,
    "femalePractitioners" INTEGER NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "federationId" INTEGER,
    "teamId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicians" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "charge" TEXT,
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

-- CreateTable
CREATE TABLE "user_approval" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "registerDate" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "status" "EVENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "teamApproved" "EVENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "federationApproved" "EVENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "cbhgApproved" "EVENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_approval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "observation" TEXT,
    "cbhgPaymentVoucher" TEXT NOT NULL,
    "federationPaymentVoucher" TEXT,
    "currentTeamId" INTEGER NOT NULL,
    "destinationTeamId" INTEGER NOT NULL,
    "currentTeamStatus" "EVENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "destinationTeamStatus" "EVENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "currentFederationStatus" "EVENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "destinationFederationStatus" "EVENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "cbhgStatus" "EVENT_STATUS" NOT NULL DEFAULT 'PENDING',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "status" "EVENT_STATUS" NOT NULL,
    "type" "LOG_TYPE" NOT NULL,
    "observation" TEXT,
    "createdBy" INTEGER NOT NULL,
    "transferId" INTEGER,
    "approvalId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_uid_key" ON "users"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_userId_key" ON "athletes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_document_key" ON "athletes"("document");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_athleteId_key" ON "addresses"("athleteId");

-- CreateIndex
CREATE UNIQUE INDEX "documents_athleteId_key" ON "documents"("athleteId");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_data_athleteId_key" ON "hospital_data"("athleteId");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_federationId_fkey" FOREIGN KEY ("federationId") REFERENCES "federations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospital_data" ADD CONSTRAINT "hospital_data_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_federationId_fkey" FOREIGN KEY ("federationId") REFERENCES "federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_projects" ADD CONSTRAINT "partner_projects_federationId_fkey" FOREIGN KEY ("federationId") REFERENCES "federations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_projects" ADD CONSTRAINT "partner_projects_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technicians" ADD CONSTRAINT "technicians_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_approval" ADD CONSTRAINT "user_approval_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer" ADD CONSTRAINT "transfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer" ADD CONSTRAINT "transfer_currentTeamId_fkey" FOREIGN KEY ("currentTeamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfer" ADD CONSTRAINT "transfer_destinationTeamId_fkey" FOREIGN KEY ("destinationTeamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "transfer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_approvalId_fkey" FOREIGN KEY ("approvalId") REFERENCES "user_approval"("id") ON DELETE SET NULL ON UPDATE CASCADE;
