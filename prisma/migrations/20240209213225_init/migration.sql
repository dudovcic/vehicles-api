-- CreateTable
CREATE TABLE "stateLogs" (
    "vehicleId" INTEGER NOT NULL,
    "state" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);
