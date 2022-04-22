import { createCookieSessionStorage } from "@remix-run/node";
import { json, redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

/**
 * Get a user from the db
 * @param userId desired user id
 * @returns user object
 */
export async function getUser(userId: string) {
  return prisma.user.findFirst({ where: { id: userId } });
}

// Always set a session secret in production
const sessionSecret =
  process.env.NODE_ENV == "production"
    ? process.env.SESSION_SECRET
    : "super-hot-secret-1337-ic3peak";

try {
  invariant(sessionSecret, "SESSION_SECRET must be set");
} catch (e) {
  console.error(e, "SESSION_SECRET is not set!");
  process.exit(1);
}

// cookie/session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: "dfg_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/500?${searchParams}`);
  }
  return userId;
}

/**
 * Creating a user session with the given user id
 *
 * @param userId user id
 * @param redirectTo page to redirect to after login
 * @returns redirect response object
 */
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

/**
 * Response object for bad requests
 * @param data any data
 * @returns 400 response object
 */
export const badRequest = (data: any) => json(data, { status: 400 });

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
