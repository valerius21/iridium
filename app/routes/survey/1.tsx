import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import RadioField from "~/components/form/survey/RadioField";

const validator = withZod(
  z.object({
    occupation: zfd.text(),
    education: zfd.text(),
    relationship_status: zfd.text(),
  })
);

const Demographics = () => {
  let questionNo = 1;
  return (
    <>
      <h2>Zielgruppendaten</h2>;
      <ValidatedForm id="demograhics-form" >
        {/* <RadioField
          label={`${questionNo++}.) Welche der folgenden Aussagen beschreibt Ihre derzeitige Tätigkeit am besten?`}
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
          label={`${questionNo++}.) Welches ist Ihr höchster Bildungsabschluss?`}
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
          label={`${questionNo++}.) Welche der folgenden Auswahlmöglichkeiten beschreiben Sie am besten?`}
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
        <button className="btn btn-primary my-5">Weiter</button> */}
      </ValidatedForm>
    </>
  );
};

export default Demographics;
