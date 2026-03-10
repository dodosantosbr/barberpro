-- DropIndex
DROP INDEX "Barbershop_email_idx";

-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT;
