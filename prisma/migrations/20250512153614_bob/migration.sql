/*
  Warnings:

  - You are about to drop the column `reservedById` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `reservedUntil` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_reservedById_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "reservedById",
DROP COLUMN "reservedUntil";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Message";
