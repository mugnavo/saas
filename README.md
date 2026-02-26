> [!IMPORTANT]
> Deprecated, check out https://github.com/mugnavo/tanstarter instead

# mugnavo/next-starter

Minimal Next.js starter based on [dotnize/react-tanstarter](https://github.com/dotnize/react-tanstarter).

- [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/) + [React Compiler](https://react.dev/learn/react-compiler)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Better Auth](https://www.better-auth.com/)

## Getting Started

1. [Use this template](https://github.com/new?template_name=next-starter&template_owner=mugnavo) or clone this repository with gitpick:

   ```bash
   npx gitpick mugnavo/next-tanstarter myapp
   cd myapp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file based on [`.env.example`](./.env.example).

4. Push the schema to your database with drizzle-kit:

   ```bash
   pnpm db push
   ```

   https://orm.drizzle.team/docs/migrations

5. Run the development server:

   ```bash
   pnpm dev
   ```

   The development server should be now running at [http://localhost:3000](http://localhost:3000).

## Goodies

#### Scripts

We use **pnpm** by default, but you can modify these scripts in [package.json](./package.json) to use your preferred package manager.

- **`auth:generate`** - Regenerate the [auth db schema](./src/lib/db/schema/auth.schema.ts) if you've made changes to your Better Auth [config](./src/lib/auth/auth.ts).
- **`db`** - Run drizzle-kit commands. (e.g. `pnpm db generate` to generate a migration)
- **`ui`** - The shadcn/ui CLI. (e.g. `pnpm ui add button` to add the button component)
- **`format`** and **`lint`** - Run Prettier and ESLint.

#### Utilities

- [`getAuthSession()`](./src/lib/auth/auth.ts#L50) - Retrieves the session and user data. Can be used in server components, API route handlers, and server actions.
- [`authGuard(redirectUrl?: string)`](./src/lib/auth/auth.ts#L65) - Same as `getAuthSession`, but redirects to the specified URL or unauthorized.tsx if the user is not authenticated.
- [`theme-toggle.tsx`](./src/components/theme-toggle.tsx) - A simple component to toggle between light and dark mode.

For more information, you may refer to the [Next.js documentation](https://nextjs.org/docs) and [react-tanstarter readme](https://github.com/dotnize/react-tanstarter/blob/main/README.md), which this starter is based on.
