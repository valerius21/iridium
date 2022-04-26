import type { FormProps } from "remix-forms";
import { Form as RemixForm } from "remix-forms";
import type { SomeZodObject } from "zod";

export function Form<Schema extends SomeZodObject>(props: FormProps<Schema>) {
  return <RemixForm<Schema> {...props} />;
}

export default Form;
