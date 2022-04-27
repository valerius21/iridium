import { nanoid } from "nanoid";
import type { FC } from "react";
import { useField } from "remix-validated-form";
import FormError from "~/components/form/FormError";

export interface LikertScaleProps {
  title: string;
  name: string;
  selectOptions?: Option[];
}

type Option = { fieldText: string; value: any };

const LikertButton: FC<{ name: string; option: Option }> = ({
  name,
  option,
}) => {
  const hash = nanoid(10);
  const { getInputProps, error } = useField(name);
  return (
    <>
      <li className="inline-block w-[19%] text-center align-top">
        <input
          {...getInputProps({
            id: hash,
            type: "radio",
            value: option.value,
          })}
          name={name}
          value={option.value}
          className="radio radio-primary relative top-0 left-[50%] z-40 ml-[-6px] block bg-white "
        />
        <label htmlFor={hash} className="w-full">
          {option.fieldText}
        </label>

        {error && <FormError error={error} />}
      </li>
    </>
  );
};

export const LikertScale: FC<LikertScaleProps> = ({
  title,
  name,
  selectOptions = [
    { fieldText: "Ich weiss es nicht", value: 0 },
    { fieldText: "stimme überhaupt nicht zu", value: 1 },
    { fieldText: "stimme nicht zu", value: 2 },
    { fieldText: "stimme zu", value: 3 },
    { fieldText: "stimme voll zu", value: 4 },
  ],
}) => {
  return (
    <div className="form-control w-full">
      {title && <p className="mb-5 font-semibold">{title}</p>}
      <ul
        className="z-0 m-0 block w-full list-none border-b-2 border-solid border-gray-800 p-0
            before:relative before:top-[1.4rem] before:left-[9.5%] before:block before:h-1 before:w-[76%] before:bg-gray-800 last-of-type:border-b-0"
      >
        {selectOptions.map((option, index) => (
          <LikertButton key={index} option={option} name={name} />
        ))}
      </ul>
    </div>
  );
};

export default LikertScale;
