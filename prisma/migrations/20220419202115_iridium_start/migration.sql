/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Password` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `age` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email",
ADD COLUMN     "age" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "currentPrivateSubmissions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "currentPublicSubmissions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "ticket" TEXT NOT NULL;

-- DropTable
DROP TABLE "Note";

-- DropTable
DROP TABLE "Password";

-- CreateTable
CREATE TABLE "AttentionCheck" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AttentionCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dataset" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attributes" JSONB NOT NULL,

    CONSTRAINT "Dataset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "questionOne" TEXT NOT NULL,
    "questionTwo" JSONB NOT NULL,
    "confidenceOne" INTEGER NOT NULL,
    "confidenceTwo" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "datasetId" TEXT NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "occupation" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "relationship_status" TEXT NOT NULL,
    "social_networks" TEXT[],
    "social_media_frequency" TEXT NOT NULL,
    "social_networks_most_used_to_share_photos" TEXT[],
    "usual_demographic_groups" TEXT[],
    "photo_sharing_frequency" TEXT NOT NULL,
    "photo_sharing_frequency_with_family_friends" TEXT NOT NULL,
    "photo_sharing_frequency_with_other_people" TEXT NOT NULL,
    "internet_usage_frequency_on_a_computer" TEXT NOT NULL,
    "internet_usage_frequency_on_mobile" TEXT NOT NULL,
    "sharing_personal_information_bothered" TEXT NOT NULL,
    "sharing_personal_information_freely" TEXT NOT NULL,
    "openess" TEXT NOT NULL,
    "worried_about_privacy" TEXT NOT NULL,
    "compare_privacy_with_others" TEXT NOT NULL,
    "privacy_priority" TEXT NOT NULL,
    "dont_care" TEXT NOT NULL,
    "public_self_information" TEXT NOT NULL,
    "information_access_concerns" TEXT NOT NULL,
    "out_of_context_information" TEXT NOT NULL,
    "overthinking_information" TEXT NOT NULL,
    "paranoid" TEXT NOT NULL,
    "consequences_of_sharing_personal_information" TEXT NOT NULL,
    "self_confident_info" TEXT NOT NULL,
    "self_confident_thoughts" TEXT NOT NULL,
    "sharing_feelings_with_others" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttentionCheck" ADD CONSTRAINT "AttentionCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
