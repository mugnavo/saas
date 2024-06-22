# mugnavo/saas

Starter kit for SaaS applications.

> [!NOTE]  
> **Work in progress.**
>
> _Currently being used as a generic Next.js boilerplate, but intended for future SaaS development._
>
> TODO:
>
> - Starter pages & dashboard styled with shadcn/ui
> - Payment gateways (see below)
> - Email & SMS providers
> - Logging
> - Analytics

### Tech stack:

Core:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Lucia](https://lucia-auth.com/)
- [pnpm](https://pnpm.io/)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)

Auth providers:

- [x] Facebook
- [x] GitHub
- [x] Google
- [ ] Email (magic links/OTP)

Payment gateways:

- [ ] Xendit
- [ ] Stripe
