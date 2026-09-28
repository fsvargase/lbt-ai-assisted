# lbt-ai-assisted

Luxury ground-transportation booking platform focused primarily on **New York
City (USA)**. Clients can browse, quote, and book premium chauffeured transport
services; operators/admins manage the fleet and reservations; and drivers track
their assigned trips through a dedicated portal.

## Vision

Deliver a seamless, high-end booking experience for premium ground
transportation in NYC — from instant quotes to real-time trip tracking — while
giving operators full control over vehicles, drivers, pricing, and reservations.

## Services

- **Airport transfers** — JFK, LaGuardia (LGA), Newark (EWR).
- **Hourly hire** — chauffeur booked by the hour.
- **Point-to-point** — fixed origin/destination rides.
- **Events** — weddings, corporate events, and group transport.

## Users & roles

| Role               | Capabilities                                                        |
| ------------------ | ------------------------------------------------------------------- |
| **Client**         | Browse, quote, book, and manage their own reservations.             |
| **Driver**         | View and track their **own assigned trips** via the driver portal.  |
| **Operator/Admin** | Manage vehicles, drivers, pricing, and all reservations.            |

Role-based access is enforced on every API route and page. Data is never shared
across roles.

## Core domain

- **Booking/Reservation** — a confirmed trip request.
- **Quote** — a price estimate for a requested service.
- **Vehicle** — a fleet vehicle with class and availability.
- **Driver** — a chauffeur assigned to trips.
- **Route/Trip** — the journey with pickup/dropoff and schedule.
- **Location** — NYC-centric (airports JFK/LGA/EWR, boroughs).
- **Customer** — the booking client.
- **Payment** — charge associated with a reservation.

> Time zones and NYC geography matter for availability and pricing. Handle
> dates/times in **America/New_York**.

## Tech stack

- **Framework**: Next.js (App Router) + TypeScript — single monolith.
- **Backend**: Route Handlers under `app/api/` (Node.js runtime).
- **Database**: PostgreSQL via **Prisma** ORM.
- **Auth**: NextAuth / Auth.js (session-based, role-aware).
- **UI**: Tailwind CSS + shadcn/ui.
- **Testing**: Jest + React Testing Library (unit/component), Playwright (E2E).
- **Tooling**: ESLint + Prettier.

## Project structure

- `app/` — route segments (marketing, booking, dashboard, admin, driver).
- `app/api/**/route.ts` — Route Handlers (booking, quoting, availability, auth).
- `components/` — reusable UI (shadcn/ui primitives + feature components).
- `hooks/` — shared React hooks.
- `lib/` — utilities, shared Prisma client, server-only domain logic.
- `prisma/` — Prisma schema and migrations.
- `openspec/` — spec-driven planning artifacts and rules.

## Quality bar

- Strong typing end-to-end (Prisma-generated types; avoid `any`).
- Accessibility required: ARIA labels + keyboard navigation.
- Every interactive element exposes a `data-testid`.
- Performance target: **Lighthouse score > 90**.
- Conventional Commits: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.

## Planning workflow

This repo uses **OpenSpec** for spec-driven planning. See
[`AGENTS.md`](AGENTS.md) for agent guidance and
[`openspec/config.yaml`](openspec/config.yaml) for project context and
per-artifact rules.
