import Link from "next/link";

import { Button } from "~/components/ui/button";
import { validateRequest } from "~/lib/auth";

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">Mugnavo SaaS Template</h1>
      <div className="flex items-center gap-2">
        This is an unprotected page:
        <pre className="rounded-md border bg-slate-50 p-1">app/page.tsx</pre>
      </div>

      {user ? (
        <div className="flex flex-col gap-2">
          <p>Welcome back, {user.name || user.firstName}!</p>
          <Button asChild className="w-fit" size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <div>
            More data:
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p>You are not signed in.</p>
          <Button asChild className="w-fit" size="lg">
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
