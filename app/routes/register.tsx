import { useField, useIsSubmitting, ValidatedForm } from "remix-validated-form";
import { register, register as validator } from "~/utils/validators";
import classNames from "classnames";
import { Link, useSearchParams } from "@remix-run/react";
import { action as registerAction } from "~/utils/register";

const XIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="m12 10.586l4.95-4.95l1.414 1.414l-4.95 4.95l4.95 4.95l-1.414 1.414l-4.95-4.95l-4.95 4.95l-1.414-1.414l4.95-4.95l-4.95-4.95L7.05 5.636z"
    ></path>
  </svg>
);

const CheckboxInput = ({
  title,
  name,
  label,
}: {
  title: string;
  name: string;
  label: string;
}) => {
  const { error, getInputProps, validate } = useField(name);
  const [searchParams] = useSearchParams();

  return (
    <>
      {name == "tos" ? (
        <Link to={`/datenschutz?tic=${searchParams.get("tic")}`}>
          <p>{title}</p>
        </Link>
      ) : (
        <p>{title}</p>
      )}
      <label
        htmlFor={`${name}-field`}
        className="label cursor-pointer"
        onClick={validate}
      >
        <span className="label-text">{label}</span>
        <input
          {...getInputProps({
            id: `${name}-field`,
            type: "checkbox",
          })}
          className="checkbox checkbox-primary"
        />
      </label>
      {error && (
        <div className="alert alert-error shadow-lg">
          <div>
            <XIcon />
            <span>{error}</span>
          </div>
        </div>
      )}
    </>
  );
};

const GenderInput = () => {
  const { validate, error, getInputProps } = useField("gender");
  return (
    <>
      {/* GENDER */}
      <p>Zu welchem Geschlecht möchten Sie registrieren?</p>
      <label
        htmlFor="gender-m"
        className="label cursor-pointer"
        onClick={validate}
      >
        <span className="label-text">männlich</span>
        <input
          {...getInputProps({
            id: "gender-m",
            type: "radio",
            value: "m",
          })}
          className="radio radio-primary"
        />
      </label>
      <label htmlFor="gender-w" className="label cursor-pointer">
        <span className="label-text">weiblich</span>
        <input
          {...getInputProps({
            id: "gender-w",
            type: "radio",
            value: "w",
          })}
          className="radio radio-primary"
        />
      </label>
      <label htmlFor="gender-d" className="label cursor-pointer">
        <span className="label-text">divers</span>
        <input
          {...getInputProps({
            id: "gender-d",
            type: "radio",
            value: "d",
          })}
          className="radio radio-primary"
        />
      </label>
      {error && (
        <div className="alert alert-error shadow-lg">
          <div>
            <XIcon />
            <span>Bitte waehlen Sie eine Option aus</span>
          </div>
        </div>
      )}
    </>
  );
};

const AgeInput = () => {
  const { error, getInputProps, validate } = useField("age");

  const selectStyle = classNames(
    "select",
    {
      "select-bordered": !error,
      "select-error": error,
    },
    "w-full",
    "mb-5"
  );

  return (
    <>
      <p>Wie alt sind Sie?</p>
      <select
        {...getInputProps({ id: "age-select" })}
        className={selectStyle}
        defaultValue={""}
        onClick={validate}
      >
        <option disabled value={""}>
          Auswaehlen
        </option>
        <option value="18-24">18-24</option>
        <option value="25-34">25-34</option>
        <option value="35-44">35-44</option>
      </select>

      {error && (
        <>
          <div className="alert alert-error mt-3 shadow-lg">
            <div>
              <XIcon />
              <span>Bitte waehlen Sie eine Option aus</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const SubmitButton = () => {
  const isSubmitting = useIsSubmitting("registerForm");
  return (
    <button
      type="submit"
      disabled={isSubmitting} //|| !isValid}
      className="btn btn-primary btn-xl btn-block"
    >
      {isSubmitting ? "Sende..." : "Weiter"}
    </button>
  );
};

export const action = registerAction;

const Register = () => {
  const [searchParams] = useSearchParams();
  const ticket = searchParams.get("tic") || "";

  return (
    <>
      <div className="prose mx-auto">
        <h1>Registrieren</h1>
        {!ticket && (
          <div className="alert alert-error mt-3 shadow-lg">
            <div>
              <XIcon />
              <span>Es wurde kein Respondi-Ticket gefunden</span>
            </div>
          </div>
        )}
        <ValidatedForm
          validator={validator}
          id="registerForm"
          method="post"
          action="/register"
        >
          {/* TICKET */}
          <input type={`hidden`} name="ticket" value={ticket} />

          <div className="form-control w-full">
            {/* AGE */}
            <AgeInput />

            {/* GENDER */}
            <GenderInput />

            {/* COUNTRY */}
            <CheckboxInput
              name="country"
              title="Land"
              label="Ich bin derzeit wohnhaft in Deutschland"
            />

            {/* OSN */}
            <CheckboxInput
              name="socialNetworks"
              title="Studie"
              label="Ich benutze regelmäßig mindestens ein soziales Netzwerk"
            />

            {/* TOS */}
            <CheckboxInput
              name="tos"
              title="Datenschutz- und Nutzungsbestimmungen"
              label={`
                Den Nutzungsbedingungen und Datenschutzrichtlinien stimme ich
                zu. Mir ist bekannt, dass für die Benutzung der Website
                wesentliche Cookies verwendet werden. Wenn Sie fortfahren,
                erklären Sie sich damit einverstanden.
            `}
            />
          </div>

          <div className="my-5"></div>
          <SubmitButton />
        </ValidatedForm>
      </div>
    </>
  );
};

export default Register;
