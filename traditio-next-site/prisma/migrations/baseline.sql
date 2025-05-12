-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "acquisitionDate" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "acquisitionCurrency" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ProductDocument" ALTER COLUMN "uploadedAt" DROP NOT NULL,
ALTER COLUMN "uploadedAt" SET DATA TYPE TIMESTAMP(6);

