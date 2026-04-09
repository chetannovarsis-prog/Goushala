-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "qr_id" TEXT;

-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "payment_status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "qr_id" TEXT;
