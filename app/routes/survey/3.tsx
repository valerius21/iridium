import { useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { makeDomainFunction, inputFromForm } from "remix-domains";
import { formAction } from "remix-forms";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import LikertField from "~/components/form/survey/LikertField";
import { prisma } from "~/db.server";
import { getImage } from "~/images.server";
import { logger } from "~/utils/logger.server";
import { getUserId } from "~/utils/session.server";
import { likert } from "~/utils/validators";

const schema = z.object({
  uid: z.string(),
  sharing_personal_information_bothered: likert,
  sharing_personal_information_freely: likert,
  openess: likert,
  worried_about_privacy: likert,
  compare_privacy_with_others: likert,
  privacy_priority: likert,
  dont_care: likert,
  public_self_information: likert,
  information_access_concerns: likert,
  out_of_context_information: likert,
  overthinking_information: likert,
  paranoid: likert,
  consequences_of_sharing_personal_information: likert,
  self_confident_info: likert,
  self_confident_thoughts: likert,
  sharing_feelings_with_others: likert,
});

const TAG = "[survey/3]";

export const mutation = makeDomainFunction(schema)(async (values) => {
  logger.info(values, TAG + "mutation");
  const {
    uid: userId,
    sharing_personal_information_bothered,
    sharing_personal_information_freely,
    openess,
    worried_about_privacy,
    compare_privacy_with_others,
    privacy_priority,
    dont_care,
    public_self_information,
    information_access_concerns,
    out_of_context_information,
    overthinking_information,
    paranoid,
    consequences_of_sharing_personal_information,
    self_confident_info,
    self_confident_thoughts,
    sharing_feelings_with_others,
  } = values;

  const exists = await prisma.surveyThree.count({
    where: {
      userId,
    },
  });

  if (exists) {
    logger.info(TAG + "mutation: already exists");
    return;
  }

  return prisma.surveyThree.create({
    data: {
      compare_privacy_with_others: compare_privacy_with_others[0],
      dont_care: dont_care[0],
      sharing_personal_information_bothered:
        sharing_personal_information_bothered[0],
      sharing_personal_information_freely:
        sharing_personal_information_freely[0],
      consequences_of_sharing_personal_information:
        consequences_of_sharing_personal_information[0],
      self_confident_info: self_confident_info[0],
      self_confident_thoughts: self_confident_thoughts[0],
      sharing_feelings_with_others: sharing_feelings_with_others[0],
      information_access_concerns: information_access_concerns[0],
      out_of_context_information: out_of_context_information[0],
      openess: openess[0],
      paranoid: paranoid[0],
      privacy_priority: privacy_priority[0],
      public_self_information: public_self_information[0],
      overthinking_information: overthinking_information[0],
      worried_about_privacy: worried_about_privacy[0],
      userId,
    },
  });
});

export const action: ActionFunction = async ({ request }) => {
  const result = await mutation(await inputFromForm(request));

  logger.info(result, TAG + "action");
  const uid = await getUserId(request);
  invariant(uid, "No user id");
  const image = await getImage(uid);

  return formAction({
    request,
    schema,
    mutation,
    successPath: `/images/${image.id}/qone`,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserId(request);
  return { user };
};

const InterpersonalPrivacyConcerns = () => {
  const { user } = useLoaderData<{ user: string }>();
  let questionNo = 1;
  return (
    <>
      <h2>Zwischenmenschliche Datenschutzbedenken </h2>
      <ValidatedForm
        validator={withZod(schema)}
        method="post"
        action="/survey/3"
      >
        <input type="hidden" name="uid" value={user} />
        <LikertField
          title={`${questionNo++}.) Normalerweise stört es mich, wenn Leute mich etwas persönliches fragen.`}
          name="sharing_personal_information_bothered"
        />

        <LikertField
          title={`${questionNo++}.) Ich erzähle den Leuten alles, was sie über mich wissen wollen.`}
          name="sharing_personal_information_freely"
        />

        <LikertField
          title={`${questionNo++}.) Ich habe nichts vor anderen Leuten zu verbergen.`}
          name="openess"
        />

        <LikertField
          title={`${questionNo++}.) Ich bin besorgt, dass andere Leute zu viele persönliche Dinge über mich wissen.`}
          name="worried_about_privacy"
        />

        <LikertField
          title={`${questionNo++}.) Im Vergleich zu anderen bin ich sensibler, wenn es darum geht, persönliche Informationen mit anderen Menschen zu teilen`}
          name="compare_privacy_with_others"
        />

        <LikertField
          title={`${questionNo++}.) Für mich ist es das Wichtigste, Dinge vor anderen privat zu halten.`}
          name="privacy_priority"
        />

        <LikertField
          title={`${questionNo++}.) Es stört mich nicht, dass andere Menschen persönliche Dinge über mich wissen.`}
          name="dont_care"
        />

        <LikertField
          title={`${questionNo++}.) Die meisten persönlichen Dinge, die ich mit anderen teile, sind ohnehin öffentlich zugänglich`}
          name="public_self_information"
        />

        <LikertField
          title={`${questionNo++}.) Ich habe Sorge, dass meine persönlichen Informationen von anderen Personen eingesehen werden als denjenigen, die sie sehen sollen.`}
          name="information_access_concerns"
        />

        <LikertField
          title={`${questionNo++}.) Ich mache mir Sorgen, dass andere Leute Dinge, die ich über mich preisgebe, aus dem Zusammenhang reißen könnten`}
          name="out_of_context_information"
        />

        <LikertField
          title={`${questionNo++}.) Wenn mich jemand nach etwas Persönlichem fragt, überlege ich manchmal zweimal, bevor ich es preisgebe.`}
          name="overthinking_information"
        />

        <LikertField
          title={`${questionNo++}.) Ich halte es für riskant, anderen persönliche Dinge über mich zu erzählen.`}
          name="paranoid"
        />

        <LikertField
          title={`${questionNo++}.) Die Weitergabe persönlicher Informationen an andere kann viele unerwartete Probleme mit sich bringen.`}
          name="consequences_of_sharing_personal_information"
        />

        <LikertField
          title={`${questionNo++}.) Ich fühle mich sicher dabei, anderen persönliche Dinge über mich zu erzählen.`}
          name="self_confident_info"
        />

        <LikertField
          title={`${questionNo++}.) Ich fühle mich wohl damit, meine privaten Gedanken und Gefühle mit anderen zu teilen.`}
          name="self_confident_thoughts"
        />

        <LikertField
          title={`${questionNo}.) Ich bespreche meine Probleme und Sorgen normalerweise mit anderen`}
          name="sharing_feelings_with_others"
        />

        <button className="btn btn-primary my-5" type="submit">
          Weiter
        </button>
      </ValidatedForm>
    </>
  );
};

export default InterpersonalPrivacyConcerns;
