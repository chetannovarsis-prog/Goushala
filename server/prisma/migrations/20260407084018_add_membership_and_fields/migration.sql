/*
  Warnings:

  - Added the required column `transaction_type` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "address" TEXT,
ADD COLUMN     "pan" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "referral" TEXT,
ADD COLUMN     "require80G" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "GurukulApplication" ADD COLUMN     "profession" TEXT,
ADD COLUMN     "referral" TEXT,
ADD COLUMN     "whatsapp" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "attachment_url" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "payment_mode" TEXT,
ADD COLUMN     "recurring" TEXT DEFAULT 'none',
ADD COLUMN     "reference_id" TEXT,
ADD COLUMN     "transaction_type" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER;

-- CreateTable
CREATE TABLE "MembershipPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "benefits" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "type" TEXT NOT NULL,
    "planAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "require80G" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT,
    "pan" TEXT,
    "referral" TEXT,
    "profession" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Membership_memberId_key" ON "Membership"("memberId");
