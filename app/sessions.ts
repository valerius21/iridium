// app/sessions.js

import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "dfg-session",

      // all of these are optional
      //   domain: "remix.run",
      expires: new Date(Date.now() + 60_000),
      httpOnly: true,
      maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET || "super-heavy-secret"],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
