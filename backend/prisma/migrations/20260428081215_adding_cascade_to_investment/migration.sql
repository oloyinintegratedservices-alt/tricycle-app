-- DropForeignKey
ALTER TABLE "Payout" DROP CONSTRAINT "Payout_investmentId_fkey";

-- DropForeignKey
ALTER TABLE "Payout" DROP CONSTRAINT "Payout_payoutScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "PayoutSchedule" DROP CONSTRAINT "PayoutSchedule_investmentId_fkey";

-- AddForeignKey
ALTER TABLE "PayoutSchedule" ADD CONSTRAINT "PayoutSchedule_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_payoutScheduleId_fkey" FOREIGN KEY ("payoutScheduleId") REFERENCES "PayoutSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
