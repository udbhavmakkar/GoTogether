# GoTogether

GoTogether is a peer-to-peer ride coordination platform for the VIT community. Students and alumni can create shared rides, join existing groups, and coordinate through a ride-specific chat.

GoTogether is not a cab-booking service and does not provide drivers, payments, or trip guarantees. Users coordinate rides and confirm final arrangements themselves.

## Core features

- Google Sign-In restricted to `@vitstudent.ac.in` and `@vitalum.ac.in` accounts
- Public ride board that hides member identities until login
- Ride creation with pickup, destination, date, time, group size, notes, and optional price
- Categorized VIT pickup/drop locations with hostel block selection
- Filters for route, date, departure time, ride type, and sharing size
- Seat availability and duplicate/conflicting ride protection
- Women-only rides that can be created and joined only by women users
- Ride membership management, including joining, leaving, and host deletion
- Private ride chat available only to ride members
- In-app and email notifications for new members and chat messages
- My Rides and Profile pages
- Cab provider directory with call tracking notifications
- Feedback form connected to GoTogether support
- Automatic deletion of expired rides and their related bookings, messages, and notifications
- Responsive mobile and desktop experience
- Vercel Analytics

## Tech stack

- Next.js 15 with the App Router
- React 19 and TypeScript
- Tailwind CSS and shadcn-style components
- Prisma ORM
- PostgreSQL (Neon in production)
- Auth.js / NextAuth v5 with Google OAuth
- Nodemailer with Gmail SMTP for email notifications
- Vercel for hosting, analytics, and scheduled cleanup

## Project structure

```text
.
├── api/                 # Browser-side API client helpers
├── app/                 # Pages and App Router API route handlers
│   ├── api/
│   ├── create/
│   ├── feedback/
│   ├── login/
│   ├── my-rides/
│   ├── profile/
│   ├── providers/
│   └── ride/[id]/
├── components/          # Shared application and UI components
├── lib/                 # Auth, database, email, validation, and domain logic
├── prisma/              # Prisma schema
├── auth.ts              # Auth.js configuration
├── vercel.json          # Vercel cron configuration
└── package.json
```

## Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database
- A Google Cloud OAuth web client
- Optional: a Gmail account with a Google App Password for notifications

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Add the required values to `.env.local`:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
   AUTH_SECRET="replace-with-a-secure-random-value"
   GOOGLE_CLIENT_ID="your-google-oauth-client-id"
   GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
   AUTH_URL="http://localhost:3000"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

   Generate an authentication secret with:

   ```bash
   openssl rand -base64 32
   ```

4. Optional: enable ride, chat, provider-contact, and feedback emails:

   ```env
   SMTP_GMAIL_USER="your-gmail-address@gmail.com"
   SMTP_GMAIL_APP_PASSWORD="your-16-character-google-app-password"
   ```

   The Gmail account must have 2-Step Verification enabled before an App Password can be created. Never commit credentials or `.env.local`.

5. Create/update the database schema and generate Prisma Client:

   ```bash
   npm run db:push
   npm run db:generate
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000).

## Google OAuth setup

Create a Google OAuth 2.0 Client ID with application type **Web application**.

For local development, configure:

```text
Authorized JavaScript origin:
http://localhost:3000

Authorized redirect URI:
http://localhost:3000/api/auth/callback/google
```

For production, add the deployed domain using the same format:

```text
Authorized JavaScript origin:
https://your-domain.example

Authorized redirect URI:
https://your-domain.example/api/auth/callback/google
```

The application validates the email domain again on the server. Google OAuth configuration alone is not treated as access control.

## Application flow

1. Visitors can see active routes, dates, times, and seat availability, but member names remain hidden.
2. A user signs in with an approved VIT student or alumni Google account.
3. New users complete their profile by selecting their gender.
4. Users create a ride or filter and join an available ride.
5. Ride members can see member names and gender, and coordinate in the private chat.
6. Hosts and existing members receive notifications when somebody joins or sends a chat message.
7. Expired rides are deleted automatically, including related bookings, chats, and notifications. User accounts remain intact.

## Privacy and access rules

- Email addresses are not displayed to other users.
- Logged-out visitors cannot see ride-member identities or open private ride details.
- Chat is restricted to the host and joined members.
- Users cannot join the same ride twice.
- Users cannot join full rides or conflicting rides at a similar date and time.
- Women-only rides are visible and joinable only to women users.
- Registration numbers are removed from Google display names before names are stored or shown.

## Available scripts

```bash
npm run dev          # Start the development server
npm run lint         # Run ESLint
npm run build        # Generate Prisma Client and create a production build
npm run start        # Start the production server locally
npm run db:push      # Apply the Prisma schema to the configured database
npm run db:generate  # Generate Prisma Client
```

Before deploying, run:

```bash
npm run lint
npm run build
```

## Deploying to Vercel

Add these environment variables to the Vercel project for the Production environment:

```text
DATABASE_URL
AUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
AUTH_URL
NEXTAUTH_URL
NEXT_PUBLIC_APP_URL
SMTP_GMAIL_USER                 # optional, required for email notifications
SMTP_GMAIL_APP_PASSWORD         # optional, required for email notifications
CRON_SECRET                     # optional additional protection for cleanup requests
```

Set `AUTH_URL`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_APP_URL` to the exact production URL, for example `https://your-domain.example`. Add that domain and its callback URL to the Google OAuth client before testing production login.

Deploy from the linked project with:

```bash
vercel deploy --prod
```

The Vercel cron in `vercel.json` calls `/api/cron/cleanup-rides` daily. PostgreSQL cascade rules remove bookings, messages, and notifications belonging to deleted rides while preserving users.

## Important notes

- API route handlers live under `app/api`, which is the App Router convention.
- PostgreSQL is configured in `prisma/schema.prisma` through `DATABASE_URL`.
- Email delivery is optional. Core ride features continue to work if SMTP is unavailable, but external email notifications will not be sent.
- Provider details and prices are informational. Users must confirm availability, pricing, and travel arrangements directly with the provider.
- This repository does not include payments, live location tracking, real-time sockets, or cab-driver assignment.
