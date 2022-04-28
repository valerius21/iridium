import invariant from "tiny-invariant";
import { prisma as db } from "./db.server";
import { imageHelper } from "./utils/imageHelper.server";
import { getUser } from "./utils/session.server";

// TODO: #12 remove for release
export const imageHost =
  process.env.IMAGE_SERVER || "https://c102-251.cloud.gwdg.de";
try {
  invariant(imageHost, "IMAGE_SERVER env variable should be defined");
} catch (e) {
  console.error(e);
}

export async function getImage(userId: string) {
  const user = await getUser(userId);
  invariant(user, "user not found");
  return imageHelper.getImage(user);
}

/**
 * Returns all submissions of a given user.
 * @param userId user id
 * @returns count of all submissions of this user
 */
export async function getSubmissionCount(userId: string): Promise<number> {
  const user = await getUser(userId);
  invariant(user, "user not found");
  const resp = await db.submission.aggregate({
    _count: {
      userId: true,
    },
    where: {
      userId: user.id,
    },
  });
  invariant(resp, "submission count not found");

  return resp._count.userId;
}

/**
 * Updates the private/public counts of a user. Should be called after a submission is created.
 *
 * @param userId user id
 */
export async function updateUserSubmissionCounts(userId: string) {
  const user = await getUser(userId);
  invariant(user, "user not found");
  const res = await db.submission.aggregate({
    _count: {
      datasetId: true,
    },
    where: {
      AND: [
        {
          dataset: {
            attributes: {
              path: ["isPrivate"],
              equals: false,
            },
          },
        },
        {
          userId: user.id,
        },
      ],
    },
  });

  const publicCount = res._count.datasetId;
  const privateCount = (await getSubmissionCount(userId)) - publicCount;

  await db.user.update({
    data: {
      currentPrivateSubmissions: privateCount,
      currentPublicSubmissions: publicCount,
    },
    where: {
      id: user.id,
    },
  });

  return { publicCount, privateCount };
}
