import { FC, useId } from "react";
import { useField } from "remix-validated-form";

export interface CheckBoxFielProps {
  title: string;
  name: string;
  options: string[];
  otherField?: boolean;
}

const CheckBoxButton: FC<{ name: string; label: string }> = ({
  label,
  name,
}) => {
  const { error, getInputProps } = useField(name);
  const hash = useId()

  return (
    <>
      <label htmlFor={hash} className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          {...getInputProps({ id: hash, type: "checkbox", value: label })}
          className="checkbox checkbox-primary"
        />
      </label>
      {error && (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 flex-shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </>
  );
};

const OtherField: FC<{ name: string; label: string }> = ({ label, name }) => {
  const { error, getInputProps } = useField(name);
  const hash = useId();

  return (
    <>
      <label htmlFor={hash} className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          {...getInputProps({ id: hash, type: "text" })}
          className="input input-primary"
        />
      </label>
      {error && (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 flex-shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
    </>
  );
};

const CheckBoxField: FC<CheckBoxFielProps> = (props) => {
  const { title, name, options, otherField } = props;
  return (
    <div className="my-5">
      <h3>{title}</h3>
      {options.map((option, i) => (
        <CheckBoxButton key={i} name={name} label={option} />
      ))}
      {otherField && <OtherField label="Sonstiges" name={name} />}
    </div>
  );
};

export default CheckBoxField;
