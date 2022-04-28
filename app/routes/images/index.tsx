import type { Submission } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { nanoid } from "nanoid";
import { useMediaQuery } from "react-responsive";
import invariant from "tiny-invariant";
import { z } from "zod";
import Form from "~/components/form/image/Form";
// import AttentionCheckForm from "~/components/form/AttentionCheckForm";
import { prisma as db } from "~/db.server";
import {
  getImage,
  getSubmissionCount,
  imageHost,
  updateUserSubmissionCounts,
} from "~/images.server";
import type { ImageAttribute } from "~/utils/imageHelper.server";
import { badRequest, getUserId } from "~/utils/session.server";
// import { getUserAttentionCheckCount } from "~/utils/user.server";
// import { imageSchema } from "~/utils/validations";
// import ImageForm from "../../components/form/ImageForm";

type LoaderType = {
  uid: string;
  count: number;
  isAttCheck: boolean;
  image: {
    url: string;
    attributes: ImageAttribute;
    submission: Submission[];
    id: string;
  };
};

export const ATTENTION_CHECKS = [25, 50];

async function isAttentionCheck(
  userId: string,
  count: number,
  attentionChecks: number[]
) {
  // TODO:
  const attCheckCount = 3; // await getUserAttentionCheckCount(userId);
  const indexOfMatch = attentionChecks.indexOf(count);

  const adjustedIndex = indexOfMatch + 1;

  return attCheckCount < adjustedIndex && indexOfMatch !== -1;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderType> => {
  const uid = await getUserId(request);
  invariant(uid, "user not found/logged in");
  const image = await getImage(uid);
  const count = await getSubmissionCount(uid);
  return {
    uid,
    count,
    isAttCheck: await isAttentionCheck(uid, count, ATTENTION_CHECKS),
    image: {
      ...image,
      url: `${imageHost}/${image.attributes.isPrivate ? "private" : "public"}/${
        image.attributes.filename
      }`,
    },
  };
};

const validator = withZod(z.object({}));

export const action: ActionFunction = async ({ request }) => {
  //   const { data, error } = validator.validate(await request.formData());
  //   if (error) {
  //     console.error(error);
  //     return error;
  //   }
  //   invariant(data, "data is required");
  //   const {
  //     questionOne,
  //     questionTwo,
  //     dataset,
  //     user: userId,
  //     confidenceOne,
  //     confidenceTwo,
  //   } = data;
  //   invariant(questionOne[0], "questionOne is required");
  //   invariant(questionTwo, "questionTwo is required");
  //   invariant(dataset, "dataset is required");
  //   invariant(userId, "user is required");
  //   invariant(confidenceOne, "confidenceOne is required");
  //   invariant(confidenceTwo, "confidenceTwo is required");
  //   const submission = await db.submission.create({
  //     data: {
  //       confidenceOne: confidenceOne,
  //       confidenceTwo: confidenceTwo,
  //       questionOne: data.questionOne[0],
  //       questionTwo: data.questionTwo,
  //       userId: userId,
  //       datasetId: dataset,
  //     },
  //   });
  // WHEN DONE
  //   const { privateCount, publicCount } = await updateUserSubmissionCounts(
  //     userId
  //   );
  //   if (privateCount + publicCount >= 60) {
  //     const result = await db.user.findFirst({
  //       where: { id: userId },
  //       select: { ticket: true },
  //     });
  //     if (!result || !result.ticket) {
  //       return badRequest("user not found");
  //     }
  //     // TODO: Testing
  //     // GET ATTENTION CHECKS
  //     const checks = await db.attentionCheck.findMany({
  //       where: { userId: userId },
  //       select: { passed: true },
  //     });
  //     // WHEN ATTENTION CHECKS FAILED
  //     if (checks.map(({ passed }) => passed).includes(false)) {
  //       return redirect(
  //         `https://mingle.respondi.com/s/1589997/ospe.php3?c_0002=0&return_tic=${result.ticket}`
  //       );
  //     }
  //     // WHEN DONE
  //     return redirect(
  //       `https://mingle.respondi.com/s/1589997/ospe.php3?c_0002=1&return_tic=${result.ticket}`
  //     );
  //   }
  //   return { submission };
  return redirect(`/images?index&eval=${nanoid(10)}`);
};

const ImageClassifier = () => {
  const {
    image: { url, id },
    uid,
    isAttCheck,
    count,
  } = useLoaderData<LoaderType>();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <div className={`${!isTabletOrMobile && "flex justify-center"}`}>
      <div className={`${!isTabletOrMobile && "mr-10"}`}>
        <img
          src={url}
          alt="the image"
          className="mx-auto w-[500px] rounded-xl object-contain shadow-xl"
        />
      </div>
      <div className={`${!isTabletOrMobile && "prose max-w-lg"}`}>
        {/* {isAttCheck ? ( */}
        {/* <AttentionCheckForm imageId={id} uid={uid} /> */}
        {/* ) : ( */}
        {/* <ImageForm imageId={id} uid={uid} /> */}
        <Form count={count} />
        {/* )} */}
      </div>
    </div>
  );
};

export default ImageClassifier;
