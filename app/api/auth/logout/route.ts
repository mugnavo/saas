import { cookies } from "next/headers";

import { lucia, validateRequest } from "~/lib/server/auth";

export async function GET() {
  const { session } = await validateRequest();
  if (!session) {
    return new Response(null, {
      status: 401,
      headers: {
        Location: "/",
      },
    });
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
