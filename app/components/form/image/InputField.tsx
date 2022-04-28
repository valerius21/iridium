import { nanoid } from "nanoid";
import type { FC } from "react";
import { useField } from "remix-validated-form";
import FormError from "../FormError";

interface Props {
  title: string;
  name: string;
  type: "text" | "number" | "checkbox" | "radio";
  id?: string;
  value?: any;
}

const InputField: FC<Props> = ({
  title,
  name,
  type,
  value,
  id = nanoid(10),
}) => {
  const { error, getInputProps } = useField(name);
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
