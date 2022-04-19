import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const register = withZod(
  z.object({
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
