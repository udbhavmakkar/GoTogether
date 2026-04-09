# GoTogether

Peer-to-peer ride-sharing coordination app for students built with Next.js App Router, Tailwind CSS, shadcn-style UI components, Prisma, and PostgreSQL.

## Project structure

```text
.
├── api
├── app
├── components
├── lib
├── prisma
├── package.json
└── README.md
```

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env
   ```

3. Configure PostgreSQL and create the Prisma client:

   ```bash
   npm run db:push
   npm run db:generate
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## App flow

1. Sign in with Google on `/login` or `/register`
2. Access is allowed only for `@vitstudent.ac.in` accounts
3. Create a ride on `/create`
4. Join rides from `/ride/[id]`
5. Chat inside the ride once you are a member

## Notes

- Route handlers live in `app/api` because this is the correct Next.js App Router convention.
- PostgreSQL is configured through `prisma/schema.prisma`.
- Google Sign-In is used for authentication with `@vitstudent.ac.in` restriction.
