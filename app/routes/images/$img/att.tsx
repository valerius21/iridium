import type { ActionFunction } from "@remix-run/server-runtime";
import { inputFromForm, makeDomainFunction } from "remix-domains";
import { formAction } from "remix-forms";
import invariant from "tiny-invariant";
import { z } from "zod";
import { prisma } from "~/db.server";
import { getImage } from "~/images.server";
import { logger } from "~/utils/logger.server";
import { getUserId } from "~/utils/session.server";
import QuestionOne, { qOneSchema } from "./qone";
import { differenceInSeconds } from "date-fns";

const schema = z.object({ ...qOneSchema, userId: z.string().min(20) });
const TAG = "[images/id/att]: ";

export const mutation = makeDomainFunction(schema)(async (values) => {
  logger.info(values, TAG + "mutation");
  const passed = values.questionOne == "nicht entscheidbar";
  const { userId } = values;

  // avoid duplicates
  const timestamp = await prisma.attentionCheck.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      userId,
    },
    select: {
      createdAt: true,
    },
  });

  const lastAttCheckInSecs = differenceInSeconds(
    new Date(),
    timestamp!.createdAt
  );

  if (lastAttCheckInSecs < 5) {
    return;
  }

  await prisma.attentionCheck.create({
    data: {
      passed,
      userId,
    },
  });
  return values;
});

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);
  invariant(userId, "userId is not defined");

  const image = await getImage(userId);
  const result = await mutation(await inputFromForm(request));
  logger.info(result, TAG + "action");

  return formAction({
    request,
    schema,
    mutation,
    successPath: `/images/${image.id}/qone`,
  });
};

const AttentionCheck = () => {
  return (
    <>
      <QuestionOne actionEndpoint="/att" isAttentionCheck />
    </>
  );
};

export default AttentionCheck;
