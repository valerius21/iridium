-- CreateTable
CREATE TABLE "SurveyThree" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
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

    CONSTRAINT "SurveyThree_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveyThree" ADD CONSTRAINT "SurveyThree_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
