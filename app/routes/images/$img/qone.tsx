import { useParams } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useRecoilValue } from "recoil";
import { inputFromForm, makeDomainFunction } from "remix-domains";
import { formAction } from "remix-forms";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import LikertScale from "~/components/form/survey/LikertField";
import { UserAtom } from "~/routes/images";
import { logger } from "~/utils/logger.server";
import { getUserId } from "~/utils/session.server";
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

export const qOneSchema = {
  questionOne: z.enum([
    "nicht entscheidbar",
    "stimme absolut nicht zu",
    "stimme nicht zu",
    "stimme zu",
    "stimme voll zu",
  ]),
  confidenceOne: z.enum(["1", "2", "3", "4", "5"]),
};

const schema = z.object(qOneSchema);

const TAG = "[images/id/qone]: ";

export const mutation = makeDomainFunction(schema)(async (values) => {
  logger.info(values, TAG + "mutation");
  return values;
});

export const action: ActionFunction = async ({ request, params }) => {
  const { img } = params;
  const result = await mutation(await inputFromForm(request));
  const { questionOne, confidenceOne } = (result as any).data;

  const qone = encodeURIComponent(questionOne);
  const cone = encodeURIComponent(confidenceOne);
  return formAction({
    request,
    schema,
    mutation,
    successPath: `/images/${img}/qtwo?confidence=${cone}&question=${qone}`,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserId(request);
  return { user };
};

const QuestionOne = ({
  isAttentionCheck = false,
  actionEndpoint = "",
}: {
  isAttentionCheck?: boolean;
  actionEndpoint?: string;
}) => {
  const params = useParams();
  // const { userId } = useLoaderData<{ userId: string }>();
  const userId = useRecoilValue(UserAtom);
  console.log(userId);
  return (
    <ValidatedForm
      method="post"
      validator={withZod(
        z.object({
          questionOne: likert,
          confidenceOne: likert,
        })
      )}
      action={`/images/${params.img}${
        actionEndpoint.length == 0 ? "/qone" : actionEndpoint
      }`}
    >
      {/* QUESTION ONE */}
      <fieldset name="questionOne">
        <input type="hidden" name="userId" value={userId} />
        <p id="question-one-title" className="font-semibold">
          {!isAttentionCheck ? (
            <>
              Angenommen, Sie hätten diese Bild mit Ihrer eigenen Kamera
              aufgenommen, inwieweit würden Sie der folgenden Aussage zustimmen:{" "}
              <br></br>
              <span className="text-center italic">
                Ich finde dieses Bild sensibel in Bezug auf meine Privatsphäre
              </span>
            </>
          ) : (
            <>
              Wie wahrscheinlich ist es, dass Sie aufmerksam sind? Bitte wählen
              Sie "nicht entscheidbar" aus.
            </>
          )}
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
