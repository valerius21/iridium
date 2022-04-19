import axios from "axios";
import yaml from "js-yaml";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";

// types
export interface Config {
  distribution: Distribution;
  "male-percentage": number;
  "female-percentage": number;
}

export interface SignUpRequest {
  ticket: string;
  country: boolean;
  age: string;
  gender: string;
  socialNetworks: boolean;
  tos: boolean;
}

export interface Distribution {
  [key: string]: number;
}

// Load config
export const fetchConfig = async (url: string): Promise<Config> => {
  const { data } = await axios.get(url);

  // Parse config
  return yaml.load(data) as Config;
};

// Validate a sign-up request
export const validateSignUp = (config: Config, request: any): boolean => {
  throw new Error("Not implemented");
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();

  const ticket = body.get("ticket");
  invariant(ticket, "Ticket is required");
  const country = body.get("country");
  invariant(country == "on", "Country is required");
  const age = body.get("age");
  invariant(age, "Age is required");
  const social = body.get("socialNetworks");
  invariant(social == "on", "Social networks is required");
  const tos = body.get("tos");
  invariant(tos == "on", "TOS is required");
  const gender = body.get("gender");
  invariant(gender, "gender is required");

  const signUpRequest: SignUpRequest = {
    ticket: ticket as string,
    country: country == "on",
    tos: tos == "on",
    age: age as string,
    gender: gender as string,
    socialNetworks: social == "on",
  };

  console.log(signUpRequest);

  return redirect("/survey/1");
};
