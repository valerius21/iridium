import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const register = withZod(
  z.object({
    ticket: z.string().nonempty("Ticket is required"),
    age: z.string().nonempty("Alter ist erforderlich"),
    gender: z.string().nonempty("Geschlecht ist erfoderlich"),
    country: zfd
      .checkbox()
      .refine((x) => !!x, "Sie muessen in Deutschland leben um teilzunehmen"),
    socialNetworks: zfd
      .checkbox()
      .refine(
        (x) => !!x,
        "Sie muessen eine Form von Sozialnetzwerken nutzen um teilzunehmen"
      ),
    tos: zfd
      .checkbox()
      .refine((x) => !!x, "Sie muessen die Nutzungsbedingungen akzeptieren"),
  })
);

export const radio = zfd
  .repeatableOfType(z.string())
  .refine(
    (val) => val.length > 0,
    "Sie muessen mindestens eine Option auswaehlen"
  );

export const checkbox = zfd
  .repeatableOfType(z.string())
  .refine(
    (val) => val.length > 0 && val[0].length > 2,
    "Sie muessen mindestens eine Option auswaehlen"
  );

export const likert = zfd
  .repeatableOfType(
    z
      .string()
      .refine(
        (val) => val.length > 0,
        "Sie muessen mindestens eine Option auswaehlen"
      )
  )
  .refine(
    (val) => val.length > 0,
    "Sie muessen mindestens eine Option auswaehlen"
  );
