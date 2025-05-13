-- Create Customer table
CREATE TABLE "Customer" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Customer_email_unique" UNIQUE ("email")
);

-- Create Message table
CREATE TABLE "Message" (
    "id" SERIAL PRIMARY KEY,
    "customerId" INTEGER NOT NULL REFERENCES "Customer"("id") ON DELETE CASCADE,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productSlug" TEXT,
    "pageUrl" TEXT
);

-- Add triggers for updatedAt
CREATE OR REPLACE FUNCTION update_updatedat_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER customer_updatedat BEFORE UPDATE ON "Customer"
FOR EACH ROW EXECUTE PROCEDURE update_updatedat_column();

CREATE TRIGGER message_updatedat BEFORE UPDATE ON "Message"
FOR EACH ROW EXECUTE PROCEDURE update_updatedat_column();

-- Indexes
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Customer_createdAt_idx" ON "Customer"("createdAt");
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");
