import { OAuth2RequestError } from "arctic";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";

import { facebook, lucia, redirectIfAuth } from "~/lib/auth";
import { db } from "~/lib/db";
import { oauthAccounts, users } from "~/lib/schema";

interface FacebookUser {
  id: string;
  name: string;
  first_name: string;
  last_name: string;
  picture: {
    data: { height: number; width: number; is_silhouette: boolean; url: string };
  };
  email: string;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("facebook_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  await redirectIfAuth(true, "/dashboard");

  try {
    const tokens = await facebook.validateAuthorizationCode(code);
    const url = new URL("https://graph.facebook.com/me");
    url.searchParams.set("access_token", tokens.accessToken);
    url.searchParams.set(
      "fields",
      ["id", "name", "first_name", "last_name", "picture", "email"].join(",")
    );
    const response = await fetch(url);
    const facebookUser: FacebookUser = await response.json();

    const existingUser = await db.query.oauthAccounts.findFirst({
      where: and(
        eq(oauthAccounts.providerId, "facebook"),
        eq(oauthAccounts.providerUserId, facebookUser.id)
      ),
    });

    // TODO:
    /**
     * if no existingUser, check if there is a user with the same email
     * then prompt to link the account (or just force?)
     */

    if (existingUser) {
      const session = await lucia.createSession(existingUser.userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateId(15);

    await db.transaction(async (tx) => {
      await tx.insert(users).values({
        id: userId,
        email: facebookUser.email,
        name: facebookUser.name,
        firstName: facebookUser.first_name,
        lastName: facebookUser.last_name,
        avatarUrl: facebookUser.picture.data.url,
      });
      await tx
        .insert(oauthAccounts)
        .values({ providerId: "facebook", providerUserId: facebookUser.id, userId });
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    // TODO: dev debugging purposes
    console.log(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
