import type { FC } from "react";

const FormError: FC<{ error: any }> = ({ error }) => {
  return (
    <div className="alert alert-error my-5 w-full">
      <div className="flex-1 items-center justify-center">
        <label>{error || `Error!`}</label>
      </div>
    </div>
  );
};

export default FormError;
