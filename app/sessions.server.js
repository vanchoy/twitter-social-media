import { createCookieSessionStorage, redirect } from "@remix-run/node";

import { sessionCookie } from "./cookies.server";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: sessionCookie
  });

export { getSession, commitSession, destroySession };

export async function requireUserSession(request) {
  const cookie = request.headers.get("Cookie");
  
  //session storage
  const session = await getSession(cookie);

  // validate the session, `userId` is just an example, use whatever value you
  // put in the session when the user authenticated
  if (!session.has("userId")) {
    // If there is no user session, redirect to the login page
    throw redirect("/login");
  }

  return session;
}