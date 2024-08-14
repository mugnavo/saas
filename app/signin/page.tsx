import { redirectIfAuth } from "~/lib/auth";

import { Button } from "~/components/ui/button";

export default async function AuthPage() {
  await redirectIfAuth(true, "/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8 rounded-xl border bg-muted p-10">
        Logo here
        <form method="GET" className="flex flex-col gap-2">
          <Button
            formAction="/api/auth/facebook"
            type="submit"
            variant="outline"
            size="lg"
          >
            Sign in with Facebook
          </Button>
          <Button formAction="/api/auth/github" type="submit" variant="outline" size="lg">
            Sign in with GitHub
          </Button>
          <Button formAction="/api/auth/google" type="submit" variant="outline" size="lg">
            Sign in with Google
          </Button>
          TODO: email?
        </form>
      </div>
    </div>
  );
}
