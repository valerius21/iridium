import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import _ from "lodash";
import { inputFromForm, makeDomainFunction } from "remix-domains";
import { formAction } from "remix-forms";
import { ValidatedForm } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import InputField from "~/components/form/image/InputField";
import LikertScale from "~/components/form/survey/LikertField";
import { getImage } from "~/images.server";
import { getUserId } from "~/utils/session.server";
import { likert } from "~/utils/validators";

export const questionTwoProps = {
  Bekannte: false,
  Jeden: false,
  Kollegen: false,
  Familie: false,
  Freunde: false,
  Niemanden: false,
};
const confirmationLikert: { fieldText: string; value: string | number }[] = [
  { fieldText: "1 - sehr unsicher", value: 1 },
  { fieldText: "2", value: 2 },
  { fieldText: "3", value: 3 },
  { fieldText: "4", value: 4 },
  { fieldText: "5 - sehr sicher", value: 5 },
];

const schema = z.object({
  confidenceTwo: likert,
  questionTwo: zfd
    .repeatableOfType(
      z.enum([
        "Bekannte",
        "Jeden",
        "Kollegen",
        "Familie",
        "Freunde",
        "Niemanden",
      ])
    )
    .refine(
      (val) => val.length != 0,
      "Sie müssen mindestens eine Antwort auswählen"
    )
    .refine((val) => {
      const result = { ...questionTwoProps }; // copy question two template into `result`
      val.forEach((item) => (result[item] = true));
      return checkQuestionTwo(result);
    }, "Bitte überprüfen Sie Ihre Antworten auf logische Fehler"),
});

export const mutation = makeDomainFunction(schema)(async (values) => {
  console.log("Saving...", values);
});

export const action: ActionFunction = async ({ request }) => {
  const result = await mutation(await inputFromForm(request));
  console.log("Result:", result);
  const uid = await getUserId(request);
  invariant(uid, "uid is required");
  const image = await getImage(uid);

  return formAction({
    request,
    schema,
    mutation,
    successPath: `/images/${image.id}/qone`,
  });
};

const QuestionTwo = () => {
  return (
    <ValidatedForm
      method="post"
      validator={withZod(schema)}
      action={`/images/a9c038d4-6770-4b61-8cd3-5e657d465ccd/qtwo`}
    >
      {/* QUESTION TWO */}
      <fieldset name="questionTwo" className="mb-5">
        <p id="question-two-title" className="font-semibold">
          Weiterhin unter der Annahme, dass Sie haben dieses Bild aufgenommen
          haetten: Mit wem würden Sie es am ehesten teilen?
        </p>
        <InputField
          type="checkbox"
          title="Jeden"
          name={"questionTwo"}
          value={"Jeden"}
        />
        <hr className="my-2" />
        {Object.keys(questionTwoProps)
          .filter((x) => x !== "Niemanden" && x !== "Jeden")
          .map((keyName, index) => (
            <InputField
              type="checkbox"
              title={keyName}
              name={"questionTwo"}
              value={keyName}
              key={index}
            />
          ))}
        <hr className="my-2" />
        <InputField
          type="checkbox"
          title="Niemanden"
          name={"questionTwo"}
          value={"Niemanden"}
        />
      </fieldset>
      {/* CONFIRM TWO */}
      <LikertScale
        title="Wie sicher sind Sie sich mit Ihrer Entscheidung?"
        name="confidenceTwo"
        selectOptions={confirmationLikert}
      />
      <button type="submit" className="btn btn-primary mt-6 min-w-full">
        Weiter
      </button>
    </ValidatedForm>
  );
};

type QuestionTwoInputType = typeof questionTwoProps;

export const checkQuestionTwo = (demogrphcs: QuestionTwoInputType): boolean => {
  const demos = _.toArray(demogrphcs);
  const nobody = demogrphcs.Niemanden;
  const everybody = demogrphcs.Jeden;

  // check if all demographics are not undefined
  if (!_.every(demos, (d) => d !== undefined)) {
    return false;
  }

  // check if all demographics are true
  let bools = demos.reduce((acc, curr) => acc && curr);

  if (bools) {
    return false;
  }

  // check if all demographics are false
  bools = demos.reduce((acc, curr) => acc || curr);
  if (!bools) {
    return false;
  }

  if (nobody && everybody) {
    return false;
  }

  // check if nobody and somebody are selected
  if (nobody && _.take(demos, 5).reduce((acc, curr) => acc || curr)) {
    return false;
  }

  return true;
};

export default QuestionTwo;
