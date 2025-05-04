-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "merchant" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isFraud" BOOLEAN NOT NULL DEFAULT false,
    "reviewCase" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
