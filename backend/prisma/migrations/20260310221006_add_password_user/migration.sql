-- DropIndex
DROP INDEX "User_stripeCustomerId_idx";

-- DropIndex
DROP INDEX "User_stripeSubscriptionId_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ALTER COLUMN "provider" DROP NOT NULL,
ALTER COLUMN "providerId" DROP NOT NULL;
