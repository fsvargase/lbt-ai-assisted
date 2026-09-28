# AGENTS.md

Guidance for AI coding agents working in the **lbt-ai-assisted** repository.

## Project overview

lbt-ai-assisted is a **luxury ground-transportation booking platform** focused
primarily on **New York City (USA)**. It lets clients browse, quote, and book
premium chauffeured transport services (airport transfers, hourly hire,
point-to-point, events), lets operators/admins manage vehicles, drivers,
pricing, and reservations, and provides a **driver portal** where chauffeurs can
view and track their assigned trips.

## Tech stack

- **Framework**: Next.js (App Router) + TypeScript — single monolith.
- **Backend**: Route Handlers inside the same Next.js app under `app/api/`.
- **Runtime**: Node.js.
- **Database**: PostgreSQL via **Prisma** ORM.
- **Auth**: NextAuth / Auth.js (session-based, role-aware).
- **UI**: Tailwind CSS + shadcn/ui.
- **Testing**: Jest + React Testing Library (unit/component), Playwright (E2E).
- **Tooling**: ESLint + Prettier.

## Project structure

- `app/` — route segments (App Router).
  - `app/(marketing)`, `app/(booking)`, `app/(dashboard)`, `app/admin`.
  - `app/driver` — driver portal to view/track assigned trips.
  - `app/api/**/route.ts` — Route Handlers (booking, quoting, availability,
    auth, admin).
  - `app/api/auth/[...nextauth]/` — NextAuth configuration.
- `components/` — reusable UI (shadcn/ui primitives + composed feature
  components).
- `hooks/` — shared React hooks.
- `lib/` — utilities, `lib/prisma.ts` (shared Prisma client), server-only domain
  logic.
- `prisma/` — Prisma schema and migrations.
- `openspec/` — spec-driven planning (see workflow below).

## Roles & access control

- **client** — books and manages their own reservations.
- **driver** — dedicated portal; can only see and track their **own assigned
  trips** (status, pickup/dropoff details, schedule).
- **operator/admin** — manages vehicles, drivers, pricing, and all reservations.

Enforce role-based access on every Route Handler / Server Action. Never expose
data across roles (e.g., a driver must never read another driver's or a client's
private data).

## Domain notes

- Core entities: Booking/Reservation, Quote, Vehicle, Driver, Route/Trip,
  Location (NYC-centric: airports **JFK / LGA / EWR**, boroughs), Customer,
  Payment.
- Time zones and NYC geography matter for availability and pricing — handle
  dates/times carefully (America/New_York).

## Conventions

- **Server Components by default**; add `"use client"` only when interactivity is
  required.
- Perform data mutations via Route Handlers and/or Server Actions with Prisma.
- **Strong typing end-to-end**: reuse Prisma-generated types across server and
  client; avoid `any`.
- Keep environment/config in typed, validated modules; **never expose secrets to
  the client**.
- Follow **SOLID** principles where applicable.
- **Accessibility is required**: ARIA labels and keyboard navigation on all
  interactive elements.
- **Every interactive element must expose a `data-testid` attribute.** Do not use
  CSS-only selectors for tests.
- Performance-conscious: use Next.js caching, image optimization, and
  code-splitting; target **Lighthouse score > 90**.

## Commands

> Adjust to the actual scripts in `package.json` if they differ.

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Unit/component tests: `npm test`
- E2E tests: `npm run test:e2e` (Playwright)
- Prisma migrate (dev): `npx prisma migrate dev`
- Prisma client generate: `npx prisma generate`

## Git & commits

- Use **Conventional Commits**: `feat`, `fix`, `refactor`, `test`, `docs`,
  `chore`.
- Keep changes scoped and reviewable.

## Definition of done

- Types pass (`tsc`) and lint is clean (ESLint + Prettier).
- New interactive elements have `data-testid` and meet ARIA/keyboard
  requirements.
- Tests added/updated (Jest + RTL for components, Playwright for user flows).
- Prisma migrations included when the schema changes.
- Role-based access verified for any new endpoint or page.

<!-- OPENSPEC:START -->
## OpenSpec workflow

This repo uses **OpenSpec** for spec-driven planning. Planning artifacts live
under `openspec/` and project context/rules are defined in
`openspec/config.yaml`.

Before implementing non-trivial features, follow the OpenSpec flow:

1. **Propose** a change (proposal + design + specs + tasks).
2. **Apply** — implement tasks from the change.
3. **Archive** the change once implementation is complete.

Use the OpenSpec skills/commands available in this workspace
(`.github/skills/openspec-*`) and the `openspec` CLI. Always honor the
per-artifact `rules` in `openspec/config.yaml` when generating proposals, specs,
design, and tasks.
<!-- OPENSPEC:END -->
