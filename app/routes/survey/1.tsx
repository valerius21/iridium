import { z } from "zod";
import { inputFromForm, makeDomainFunction } from "remix-domains";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { radio } from "~/utils/validators";
import { ValidatedForm } from "remix-validated-form";
import RadioField from "~/components/form/survey/RadioField";
import { withZod } from "@remix-validated-form/with-zod";
import { formAction } from "remix-forms";
import { getUserId } from "~/utils/session.server";
import { useLoaderData } from "@remix-run/react";

const schema = z.object({
  uid: z.string(),
  occupation: radio,
  education: radio,
  relationship_status: radio,
});

export const mutation = makeDomainFunction(schema)(async (values) => {
  console.log("Saving...", values);
});

export const action: ActionFunction = async ({ request }) => {
  const result = await mutation(await inputFromForm(request));

  console.log("Result:", result);
  return formAction({ request, schema, mutation, successPath: "/survey/2" });
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserId(request);
  return { user };
};

const Demographics = () => {
  const { user } = useLoaderData<{ user: string }>();
  let questionNo = 1;

  return (
    <>
      <h2>Zielgruppendaten</h2>

      <ValidatedForm
        validator={withZod(schema)}
        method="post"
        action="/survey/1"
        // id="demographics-form"
      >
        <input type="hidden" name="uid" value={user} />
        <RadioField
          title={`${questionNo++}.) Welche der folgenden Aussagen beschreibt Ihre derzeitige Tätigkeit am besten?`}
          name="occupation"
          options={[
            "Regierung",
            "Bildungseinrichtung",
            "Unternehmen oder Industrie",
            "Gemeinnützige Organisation",
            "Andere",
          ]}
        />
        <RadioField
          title={`${questionNo++}.) Welches ist Ihr höchster Bildungsabschluss?`}
          name="education"
          options={[
            "Kein Bildungsabschluss",
            "Hauptschule",
            "Realschule",
            "Abitur",
            "Berufsausbildung",
            "Fachhochschule",
            "Universität",
            "Promotion",
            "Nicht antworten",
          ]}
        />
        <RadioField
          title={`${
            questionNo + 1
          }.) Welche der folgenden Auswahlmöglichkeiten beschreiben Sie am besten?`}
          name="relationship_status"
          options={[
            "Verheiratet",
            "Zusammenlebend mit meiner Partnerin oder meinem Partner",
            "Geschieden",
            "Getrennt lebend",
            "Ledig",
            "Nicht antworten",
          ]}
        />
        <button className="btn btn-primary my-5">Weiter</button>
      </ValidatedForm>
    </>
  );
};

export default Demographics;
