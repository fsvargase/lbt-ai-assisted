/*
  Warnings:

  - Added the required column `contactEmail` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customerId_fkey";

-- AlterTable: add contact columns with a transitional default so existing rows
-- satisfy the NOT NULL constraint; the default is dropped immediately after.
ALTER TABLE "Booking" ADD COLUMN     "contactEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "contactPhone" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "customerId" DROP NOT NULL;

-- Drop transitional defaults; the application always supplies real values.
ALTER TABLE "Booking" ALTER COLUMN "contactEmail" DROP DEFAULT,
ALTER COLUMN "contactPhone" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
