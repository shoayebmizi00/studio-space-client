# StudioSpace

StudioSpace is a high-performance peer-to-peer marketplace for creators — photographers, filmmakers, podcasters, musicians and designers can rent out their creative spaces, and fellow creators can discover, filter and reserve studio slots by the hour with transparent pricing and real-time booking management.

**Live site:** not deployed yet — run it locally (steps below). Production target: Vercel.
**Repository:** https://github.com/shoayebmizi00/studio-space-client

## Features

- **Full studio marketplace** — hero slider, 6 dynamically-fetched featured studios, category cards that deep-link into `/studios?category=...`, a 4-step "How Booking Works" flow and a "Host Guarantee & Creator Support" section.
- **Complete host CRUD** — add a studio (`/add-studio`), view your own listings (`/my-listings`), update them (`/studios/edit/[id]`) and delete them behind a confirmation modal, all persisted in MongoDB.
- **Booking system with double-booking protection** — bookings start as `Pending` and progress through `Confirmed` → `Completed` / `Cancelled`; overlapping requests against a confirmed slot are rejected with a clear 409 message.
- **JWT security with HTTPOnly cookies** — `POST /api/studios`, `DELETE /api/studios/[id]` and `POST /api/bookings` reject unauthenticated requests with `401 Unauthorized`; private pages redirect to login only when the session cookie is missing (logged-in reloads never bounce).
- **Rich UX** — Sonner toasts everywhere (no `alert()`/`confirm()`), custom confirmation dialogs, branded skeleton loaders on every route, a custom 404 page, friendly empty states with CTAs, light/dark theme toggle, and saved-studios wishlist stored in MongoDB.
- **Optional extras** — downloadable PDF booking invoices (jsPDF) for confirmed/completed bookings and a heart-icon wishlist synced across the navbar, studio cards and details page.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19, TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (Base UI primitives), lucide icons
- **Auth:** better-auth (email/password + Google OAuth) with the JWT plugin — session stored in an HTTPOnly cookie
- **Database:** MongoDB Atlas (`studios`, `bookings`, `saved_studios`, plus better-auth collections)
- **API:** Next.js route handlers for mutations, sibling Express server (`../studio-space-server`) for the public studio catalog
- **Notifications:** Sonner toasts · **PDF:** jsPDF

## Local setup

```bash
# 1. Clone and install (npm only)
git clone https://github.com/shoayebmizi00/studio-space-client.git
cd studio-space-client
npm install

# 2. Create a .env file in the project root
#    BETTER_AUTH_SECRET=generate-a-secret-with: npx @better-auth/cli secret
#    BETTER_AUTH_URL=http://localhost:3000
#    MONGODB_URI=your-mongodb-atlas-uri
#    GOOGLE_CLIENT_ID=...
#    GOOGLE_CLIENT_SECRET=...

# 3. Start the API server (separate terminal)
cd ../studio-space-server
npm install
node index.js          # http://localhost:5000

# 4. Start the client
cd ../studio-space-client
npm run dev            # http://localhost:3000
```

Checks: `npm run lint` and `npx tsc --noEmit` (there is no test suite).

## Examiner test credentials

| Field    | Value                       |
| -------- | --------------------------- |
| Email    | `examiner@studiospace.dev`  |
| Password | `Examine123`                |

Sign in at `/sign-in` with the table above, or register a new account — passwords
require an uppercase letter, a lowercase letter and at least 6 characters.
Private routes to test: `/dashboard`, `/add-studio`, `/my-listings`,
`/my-bookings`, `/profile`, `/studios/edit/[id]`.
