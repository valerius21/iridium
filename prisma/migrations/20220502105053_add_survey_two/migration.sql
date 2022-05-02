-- CreateTable
CREATE TABLE "SurveyTwo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "social_networks" TEXT[],
    "social_media_frequency" TEXT NOT NULL,
    "social_networks_most_used_to_share_photos" TEXT[],
    "usual_demographic_groups" TEXT[],
    "photo_sharing_frequency" TEXT NOT NULL,
    "photo_sharing_frequency_with_family_friends" TEXT NOT NULL,
    "photo_sharing_frequency_with_other_people" TEXT NOT NULL,
    "internet_usage_frequency_on_a_computer" TEXT NOT NULL,
    "internet_usage_frequency_on_mobile" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SurveyTwo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveyTwo" ADD CONSTRAINT "SurveyTwo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
