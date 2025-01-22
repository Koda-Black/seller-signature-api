/*
  Warnings:

  - Added the required column `sellerEmail` to the `Agreement` table without a default value. This is not possible if the table is not empty.
  - Made the column `signatureRequestId` on table `DocumentInstance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Agreement" ADD COLUMN     "sellerEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DocumentInstance" ALTER COLUMN "signatureRequestId" SET NOT NULL;
