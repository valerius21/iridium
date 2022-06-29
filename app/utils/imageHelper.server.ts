import type { Submission, User } from "@prisma/client";
import _ from "lodash";
import invariant from "tiny-invariant";
import { prisma as db } from "~/db.server";
import {
  MIN_ANNOTATIONS,
  MAX_ANNOTATIONS,
  IMAGE_DISTRIBUTION,
  MAX_SUBMISSIONS
} from "~/utils/constants.server"

export type Image = {
  attributes: ImageAttribute;
  submission: Submission[];
  id: string;
};

export type ImageAttribute = {
  filename: string;
  isPrivate: boolean;
};

export class ImageHelper {
  studySize: number;
  weight: number;
  static privateImages: any[];
  static publicImages: any[];

  /**
   *
   * @param studySize the number of images to be studied for a user
   * @param weight the percentage of private images to be studied for a user
   */
  constructor(studySize: number, weight: number) {
    this.studySize = studySize;
    this.weight = weight;
  }

  /**
   * Get images with previous annotations.
   * @param isPrivate is the images are private
   * @param minAnnotations minimum number of annotations
   * @param maxAnnoations maximum number of annotations
   * @returns images with previous annotations
   */
  private async getPreviousImages(
    isPrivate: boolean,
    minAnnotations: number,
    maxAnnoations: number
  ) {
    type DatasetAttribute = { filename: string; isPrivate: boolean };

    let imgs = await db.dataset.findMany({
      take: 6 * 1000,
      skip: 0,
      select: {
        attributes: true,
        submission: true,
        id: true,
      },
      where: {
        attributes: {
          path: ["isPrivate"],
          equals: isPrivate,
        },
      },
      orderBy: {
        submission: {
          _count: "desc",
        },
      },
    });
    imgs = imgs
      .map((img: any) => ({
        ...img,
        attributes: img.attributes as DatasetAttribute,
      }))
      .filter(
        ({
          submission,
        }: {
          attributes: DatasetAttribute;
          submission: Submission[];
        }) => {
          return (
            submission.length <= maxAnnoations &&
            submission.length >= minAnnotations
          );
        }
      );
    return imgs;
  }

  private static async pickRandomImages(n: number, isPrivate: boolean) {

    const ids = await db.dataset.findMany({
      select: {
        id: true,
      },
      where: {
        attributes: {
          path: ["isPrivate"],
          equals: isPrivate,
        },
      },
    });

    const set = _.shuffle(ids).slice(0, n);

    const datasets = await Promise.all(
      set.map(async ({ id }) => {
        const ds = await db.dataset.findFirst({
          where: { id },
          select: {
            attributes: true,
            submission: true,
            id: true,
          },
        });
        invariant(ds, `Dataset ${id} not found!`);
        return ds;
      })
    );
    return datasets;
  }

  /**
   * Returns a random image from the dataset with the bias towards the images with the most annotations.
   * @param user the user id
   * @returns a preferred, random image
   */
  async getImage(user: User): Promise<Image> {
    if (!user) throw new Error("getImage needs a User");

    const { currentPrivateSubmissions, currentPublicSubmissions } = user;

    const nPrivate = this.studySize * this.weight - currentPrivateSubmissions;
    const nPublic = this.studySize * this.weight - currentPublicSubmissions;

    // get the images with the most annotations, but less then MAX_ANNOTATIONS
    let privateImgs = await this.getPreviousImages(true, MIN_ANNOTATIONS, MAX_ANNOTATIONS);
    let publicImgs = await this.getPreviousImages(false, MIN_ANNOTATIONS, MAX_ANNOTATIONS);

    // padding the images with random images
    let privateRandoms = await ImageHelper.pickRandomImages(
      this.studySize,
      true
    );
    let publicRandoms = await ImageHelper.pickRandomImages(
      this.studySize,
      false
    );

    privateImgs = [...privateImgs, ...privateRandoms];
    publicImgs = [...publicImgs, ...publicRandoms];

    // remove images which are already annotated
    const submissionQuery = await db.submission.findMany({
      where: {
        userId: user.id,
      },
      select: {
        datasetId: true,
      },
      distinct: ["datasetId"],
    });
    const prevIds = submissionQuery.map(({ datasetId }) => datasetId);

    privateImgs = privateImgs.filter(({ id }) => !prevIds.includes(id));
    publicImgs = publicImgs.filter(({ id }) => !prevIds.includes(id));

    // slice it back
    privateImgs = privateImgs.slice(0, nPrivate);
    publicImgs = publicImgs.slice(0, nPublic);

    // shuffle it
    let images = _.shuffle([...privateImgs, ...publicImgs]);

    images = images.sort((a, b) => a.submission.length - b.submission.length);

    const candidate = images.pop();

    invariant(candidate, "No image generated");

    return {
      ...candidate,
      attributes: candidate.attributes as ImageAttribute,
    };
  }
}

export const imageHelper = new ImageHelper(MAX_SUBMISSIONS, IMAGE_DISTRIBUTION);
