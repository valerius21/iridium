import axios from "axios";
import yaml from "js-yaml";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

// types
export interface Config {
  distribution: Distribution;
  "male-percentage": number;
  "female-percentage": number;
  redirects: {
    screenout: string;
    quality: string;
    done: string;
  };
}

type GenderDist = {
  m: number;
  w: number;
  d: number;
};

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

// Age distribution config URL
const configURL =
  process.env.VITEST || (process.env.NODE_ENV != "production" && "")
    ? "http://localhost/config"
    : process.env.CONFIG_URL || "";
invariant(configURL.length > 0, "CONFIG_URL is not set");

// Load config
export const fetchConfig = async (url: string): Promise<Config> => {
  const { data } = await axios.get(url);

  // Parse config
  return yaml.load(data) as Config;
};

// give back available slots for a given age
export const getAvailableSlotsFromConfig = (
  config: Config,
  age: string
): GenderDist => {
  const distribution = config.distribution[age];

  if (!distribution) {
    throw new Error("No distribution for age " + age);
  }

  const m = Math.floor(distribution * (config["male-percentage"] / 100.0));
  const w = Math.floor(distribution * (config["female-percentage"] / 100.0));

  return {
    m,
    w,
    d: distribution - m - w,
  };
};

// give back availabe slots for a given range (db)
// Note: Queries could be optimized by taking the gender into account, but it is for the scale of the study sufficient
export const getUsedSlotsFromDB = async (age: string): Promise<GenderDist> => {
  const m = await prisma.user.count({
    where: {
      age,
      gender: "m",
    },
  });
  const w = await prisma.user.count({
    where: {
      age,
      gender: "w",
    },
  });
  const d = await prisma.user.count({
    where: {
      age,
      gender: "d",
    },
  });

  return {
    m,
    w,
    d,
  };
};

// determines if a slot for a certain age-range with gender is available
export const slotAvailable = async (
  config: Config,
  age: string,
  gender: "m" | "w" | "d"
): Promise<boolean> => {
  const configSlots = getAvailableSlotsFromConfig(config, age);
  const dbSlots = await getUsedSlotsFromDB(age);
  const dAvailable = configSlots.d - dbSlots.d;
  const mAvailable = configSlots.m - dbSlots.m + dAvailable;
  const wAvailable = configSlots.w - dbSlots.w + dAvailable;

  if (gender == "d") return dAvailable > 0;

  return gender == "m" ? mAvailable > 0 : wAvailable > 0;
};

// parse the body
export const parseRequest = (body: FormData): SignUpRequest => {
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

  return {
    ticket: ticket as string,
    country: country == "on",
    tos: tos == "on",
    age: age as string,
    gender: gender as string,
    socialNetworks: social == "on",
  };
};

// Validate a sign-up request
export const validateSignUp = (
  config: Config,
  { age, gender }: SignUpRequest
): Promise<boolean> => {
  invariant(gender == "w" || gender == "m" || gender == "d", "Invalid gender");
  return slotAvailable(config, age, gender);
};

// signup action function
export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const requestData = parseRequest(body);

  const isValid = await validateSignUp(
    await fetchConfig(configURL),
    requestData
  );
  // redirects to quotafull if no slot is available
  if (!isValid) {
  }

  // redirect to survey and set cookie
  // TODO: set cookie
  return redirect("/survey/1");
};

// Data-loading function
export const loader: LoaderFunction = async () => {
  const config = await fetchConfig(configURL);

  // age ranges
  return json([...Object.keys(config.distribution)]);
};
