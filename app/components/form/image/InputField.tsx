import { FC, useId } from "react";
import { useField } from "remix-validated-form";
import FormError from "../FormError";

interface Props {
  title: string;
  name: string;
  type: "text" | "number" | "checkbox" | "radio";
  value?: any;
}

const InputField: FC<Props> = ({
  title,
  name,
  type,
  value,
}) => {
  const { error, getInputProps } = useField(name);
  const id = useId()
  return (
    <>
      <label htmlFor={id} className="label cursor-pointer">
        <span className="label-text">{title}</span>
        <input
          {...getInputProps({ id, type, value })}
          className={`${type} ${type}-primary`}
        />
      </label>
      {error && <FormError error={error} />}
    </>
  );
};

export default InputField;
