import { OAuth2RequestError } from "arctic";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";

import { github, lucia, redirectIfAuth } from "~/lib/auth";
import { db } from "~/lib/db";
import { oauthAccounts, users } from "~/lib/schema";

interface GitHubUser {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string;
  location: string | null;
  login: string;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  await redirectIfAuth(true, "/dashboard");

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await db.query.oauthAccounts.findFirst({
      where: and(
        eq(oauthAccounts.providerId, "github"),
        eq(oauthAccounts.providerUserId, githubUser.id)
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
        email: githubUser.email,
        name: githubUser.name || githubUser.login,
        avatarUrl: githubUser.avatar_url,
      });
      await tx
        .insert(oauthAccounts)
        .values({ providerId: "github", providerUserId: githubUser.id, userId });
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
