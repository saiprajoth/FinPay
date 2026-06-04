/*
  Warnings:

  - You are about to drop the column `isAcceptingPayment` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAcceptingPayment",
ADD COLUMN     "isAcceptingPayments" BOOLEAN NOT NULL DEFAULT true;
