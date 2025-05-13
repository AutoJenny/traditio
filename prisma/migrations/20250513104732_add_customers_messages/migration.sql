-- Create Customer table
CREATE TABLE "Customer" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Customer_email_unique" UNIQUE ("email")
);

-- Create Message table
CREATE TABLE "Message" (
    "id" SERIAL PRIMARY KEY,
    "customerId" INTEGER NOT NULL REFERENCES "Customer"("id") ON DELETE CASCADE,
    "content" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productSlug" TEXT,
    "pageUrl" TEXT
);

-- Add triggers for updated
CREATE OR REPLACE FUNCTION update_updated_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updated" = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER customer_updated BEFORE UPDATE ON "Customer"
FOR EACH ROW EXECUTE PROCEDURE update_updated_column();

CREATE TRIGGER message_updated BEFORE UPDATE ON "Message"
FOR EACH ROW EXECUTE PROCEDURE update_updated_column();

-- Indexes
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Customer_created_idx" ON "Customer"("created");
CREATE INDEX "Message_created_idx" ON "Message"("created");
