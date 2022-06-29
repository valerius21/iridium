import { FC, useId} from "react";
import { useField } from "remix-validated-form";

export interface RadioFieldProps {
  title: string;
  name: string;
  options: string[];
}

const RadioButton: FC<{ name: string; label: string }> = ({ label, name }) => {
  const { error, getInputProps } = useField(name);
  const hash = useId();

  return (
    <>
      <label htmlFor={hash} className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          {...getInputProps({ id: hash, type: "radio", value: label })}
          className="radio radio-primary"
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

const RadioField: FC<RadioFieldProps> = (props) => {
  const { title, name, options } = props;
  return (
    <div className="my-5">
      <h3>{title}</h3>
      {options.map((option, i) => (
        <RadioButton key={i} name={name} label={option} />
      ))}
    </div>
  );
};

export default RadioField;
