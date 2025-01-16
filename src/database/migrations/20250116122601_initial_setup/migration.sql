-- CreateTable
CREATE TABLE "Agreement" (
    "id" SERIAL NOT NULL,
    "agreementDate" TIMESTAMP(3) NOT NULL,
    "agreementAmount" DOUBLE PRECISION NOT NULL,
    "duration" TEXT NOT NULL,
    "extensionPeriod" TEXT,
    "extensionAmount" DOUBLE PRECISION,
    "propertyLocation" TEXT NOT NULL,
    "sellerSign" TEXT NOT NULL,
    "signedBy" TEXT NOT NULL,
    "sellerName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentInstance" (
    "id" SERIAL NOT NULL,
    "agreementId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentInstance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DocumentInstance" ADD CONSTRAINT "DocumentInstance_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
