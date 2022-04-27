import { useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { makeDomainFunction, inputFromForm } from "remix-domains";
import { formAction } from "remix-forms";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import LikertField from "~/components/form/survey/LikertField";
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
});

export const mutation = makeDomainFunction(schema)(async (values) => {
  console.log("Saving...", values);
});

export const action: ActionFunction = async ({ request }) => {
  const result = await mutation(await inputFromForm(request));

  console.log("Result:", result);
  return formAction({ request, schema, mutation, successPath: "/images" });
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
          title={`${
            questionNo + 1
          }.) Es stört mich nicht, dass andere Menschen persönliche Dinge über mich wissen.`}
          name="dont_care"
        />

        <button className="btn btn-primary my-5" type="submit">
          Weiter
        </button>
      </ValidatedForm>
    </>
  );
};

export default InterpersonalPrivacyConcerns;
