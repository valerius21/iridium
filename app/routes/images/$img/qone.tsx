import { useParams } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { nanoid } from "nanoid";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import LikertScale from "~/components/form/survey/LikertField";
import { likert } from "~/utils/validators";
const sensibleLikert: { fieldText: string; value: string | number }[] = [
  { fieldText: "nicht entscheidbar", value: "nicht entscheidbar" },
  { fieldText: "stimme absolut nicht zu", value: "stimme absolut nicht zu" },
  { fieldText: "stimme nicht zu", value: "stimme nicht zu" },
  { fieldText: "stimme zu", value: "stimme zu" },
  { fieldText: "stimme voll zu", value: "stimme voll zu" },
];

const confirmationLikert: { fieldText: string; value: string | number }[] = [
  { fieldText: "1 - sehr unsicher", value: 1 },
  { fieldText: "2", value: 2 },
  { fieldText: "3", value: 3 },
  { fieldText: "4", value: 4 },
  { fieldText: "5 - sehr sicher", value: 5 },
];

export const action: ActionFunction = async ({ request, params }) => {
  const { img } = params;
  // TODO:
  const submissionId = nanoid(10);
  return redirect(`/images/${img}/qtwo?submissionId=${submissionId}`);
};

const QuestionOne = () => {
  const params = useParams();
  return (
    <ValidatedForm
      method="post"
      validator={withZod(
        z.object({
          questionOne: likert,
          confidenceOne: likert,
        })
      )}
      action={`/images/${params.img}/qone`}
    >
      {/* QUESTION ONE */}
      <fieldset name="questionOne">
        <p id="question-one-title" className="font-semibold">
          Angenommen, Sie hätten diese Bild mit Ihrer eigenen Kamera
          aufgenommen, inwieweit würden Sie der folgenden Aussage zustimmen:{" "}
          <br></br>
          <span className="text-center italic">
            Ich finde dieses Bild sensibel in Bezug auf meine Privatsphäre
          </span>
        </p>
        <LikertScale
          title=""
          name="questionOne"
          selectOptions={sensibleLikert}
        />
      </fieldset>

      {/* CONFIRM ONE */}
      <LikertScale
        title="Wie sicher sind Sie sich mit Ihrer Entscheidung?"
        name="confidenceOne"
        selectOptions={confirmationLikert}
      />

      <button type="submit" className="btn btn-primary mt-6 min-w-full">
        Weiter
      </button>
    </ValidatedForm>
  );
};

export default QuestionOne;
