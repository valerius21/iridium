-- CreateTable
CREATE TABLE "SurveyOne" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "education" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "relationship_status" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SurveyOne_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SurveyOne_userId_key" ON "SurveyOne"("userId");

-- AddForeignKey
ALTER TABLE "SurveyOne" ADD CONSTRAINT "SurveyOne_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
