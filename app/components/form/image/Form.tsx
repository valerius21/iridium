import { withZod } from "@remix-validated-form/with-zod";
import type { FC } from "react";
import { useState } from "react";
import { useFormContext, ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import LikertScale from "../survey/LikertField";
import InputField from "./InputField";

const schema = z.object({});
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
export const questionTwoProps = {
  Bekannte: false,
  Jeden: false,
  Kollegen: false,
  Familie: false,
  Freunde: false,
  Niemanden: false,
};

// TODO: Form was invalid, please try again -> reload page

const Form: FC<{ count: number }> = ({ count }) => {
  const [isFirstHalf, setIsFirstHalf] = useState(true);
  //   const { validateField } = useFormContext("img-form");
  return (
    <div>
      <p>{count}</p>
      <ValidatedForm
        action="/images?index"
        method="post"
        validator={withZod(schema)}
        className="form-control"
        id="img-form"
        resetAfterSubmit={true}
        // onSubmit={() => setIsFirstHalf(true)}
      >
        {isFirstHalf ? (
          <>
            {/* QUESTION ONE */}
            <fieldset name="questionOne">
              <p id="question-one-title" className="font-semibold">
                Angenommen, Sie hätten diese Bild mit Ihrer eigenen Kamera
                aufgenommen, inwieweit würden Sie der folgenden Aussage
                zustimmen: <br></br>
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

            <span
              className="btn btn-primary"
              onClick={() => {
                // if (
                //   !validateField("questionOne") &&
                //   !validateField("confidenceOne")
                // ) {
                //   //   setIsFirstHalf((val) => !val);
                //   console.log("valid");
                // }
                setIsFirstHalf(false);
              }}
            >
              Weiter
            </span>
          </>
        ) : (
          <>
            {/* QUESTION TWO */}
            <div className="divider" />
            <fieldset name="questionTwo" className="mb-5">
              <p id="question-two-title" className="font-semibold">
                Weiterhin unter der Annahme, dass Sie haben dieses Bild
                aufgenommen hätten: Mit wem würden Sie es am ehesten teilen?
              </p>
              <InputField
                type="checkbox"
                title="Bekannte"
                name={"questionTwo"}
                value={"Everybody"}
              />
              <hr className="my-2" />
              {Object.keys(questionTwoProps)
                .filter((x) => x !== "Nobody" && x !== "Everybody")
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
                value={"Nobody"}
              />
            </fieldset>
            {/* CONFIRM TWO */}
            <LikertScale
              title="Wie sicher sind Sie sich mit Ihrer Entscheidung?"
              name="confidenceTwo"
              selectOptions={confirmationLikert}
            />
            <button type="submit" className="btn btn-primary">
              Weiter
            </button>
          </>
        )}
      </ValidatedForm>
    </div>
  );
};

export default Form;
