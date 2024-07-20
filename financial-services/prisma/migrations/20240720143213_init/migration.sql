-- CreateTable
CREATE TABLE "UserFinance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "financeDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFinance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFinance_userId_key" ON "UserFinance"("userId");
