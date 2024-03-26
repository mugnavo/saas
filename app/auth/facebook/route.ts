import { generateState } from "arctic";
import { cookies } from "next/headers";

import { facebook } from "~/lib/auth";

export async function GET(): Promise<Response> {
  const state = generateState();

  const url = await facebook.createAuthorizationURL(state, {
    scopes: ["public_profile", "email"],
  });

  cookies().set("facebook_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
