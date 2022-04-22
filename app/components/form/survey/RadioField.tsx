import type { FC } from "react";

export interface RadioFieldProps {
  label: string;
  name: string;
  options: string[];
}

const RadioField: FC<RadioFieldProps> = ({ label, name, options }) => {
  return <div></div>;
};

export default RadioField;
