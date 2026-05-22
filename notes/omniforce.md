# OmniForce

A full-stack CRM and route management platform for mobile service businesses — trash can cleaning, dumpster rentals, portable toilets, junk removal, and any other route-based field service operation — built on [Payload CMS](https://payloadcms.com) and [Next.js](https://nextjs.org).

OmniForce extends the Payload CMS base to deliver an opinionated, production-ready backend for managing customers, orders, routes, trucks, quotes, and SMS communications — all from a single admin panel.

---

## What It Does

- **CRM** — Manage contacts, orders, subscriptions, tasks, notes, and a full audit log
- **Quote Engine** — Automatically generate price quotes for new orders by evaluating available routes and applying configurable pricing rules
- **Route Optimization** — Plan truck routes, sequence stops, and visualize them on a map
- **SMS / Email Messaging** — Two-way communication with customers via Twilio, with an inbound webhook for parsing replies
- **Background Jobs** — Async job queue (Payload Jobs) for quote generation, message dispatch, and route time calculation
- **Role-Based Access Control** — Super Admin, Owner, Admin, Sales Rep, Tech, and Contact roles with granular permissions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Payload CMS 3.x](https://payloadcms.com) + [Next.js 16](https://nextjs.org) |
| Language | TypeScript 5.7 |
| Database | PostgreSQL (Payload postgres adapter) |
| Styling | TailwindCSS 4, shadcn/ui |
| Maps | MapLibre GL |
| Messaging | Twilio (SMS), SendGrid (email) |
| Geocoding | Nominatim (OSM) |
| Routing | OSRM (Open Source Routing Machine) |
| Phone Parsing | libphonenumber-js |
| Testing | Vitest (unit), Playwright (E2E) |

---

## Collections

### CRM

| Collection | Purpose |
|---|---|
| **Users** | Staff and customer contacts. Roles: Super Admin, Owner, Admin, Sales Rep, Tech, Contact |
| **Orders** | Customer service requests. Tracks status from `Pending` → `Quotes Ready` → `Quote Selected` → `In Progress` → `Completed` |
| **Quotes** | Price options auto-generated for each order. Types: `fastest`, `best-cost`, `other` |
| **Subscriptions** | Recurring service contracts with configurable day/week schedules |
| **Messages** | SMS, email, and internal messages. Two-way with status tracking and provider snapshots |
| **Tasks** | Work items assignable to users, related to orders, subscriptions, trucks, or services |
| **Notes** | Free-text notes attached to any entity |
| **Logs** | Immutable audit trail of all create/update/delete actions with data snapshots |

### Operations

| Collection | Purpose |
|---|---|
| **Routes** | Delivery plans per truck per day. Tracks max stops, max route minutes, start/end depot |
| **Route Stops** | Ordered stops on a route. Type: `order` (customer) or `location` (depot/gas/break) |
| **Trucks** | Fleet vehicles with type (flatbed/pickup) and maintenance status |
| **Locations** | Depots, gas stations, break points — used as route anchors |
| **Services** | Available service offerings linked to orders and subscriptions |

### Content (Payload Base)

Pages, Posts, Media, Categories — layout-builder enabled with draft/publish workflow, SEO plugin, and search indexing.

---

## Globals

| Global | Purpose |
|---|---|
| **Settings** | Pricing config: service rate/min, drive time rate/min, markup %, tax %, min/max charges, quote expiry days, max routes per quote |
| **Header / Footer** | Frontend navigation content |

---

## Quote Engine

When an order is created, a background job (`generateOrderQuotesTask`) automatically:

1. Geocodes the service address via Nominatim if coordinates are missing
2. Fetches global pricing settings
3. Queries planned routes within the order's pickup day window
4. For each candidate route, simulates inserting the stop and calls OSRM to calculate drive time delta
5. Computes cost: `labor (service time × rate) + drive time cost + markup + tax`, clamped between min/max
6. Creates `Quote` records tagged as `fastest`, `best-cost`, or `other`
7. Updates the order status to `Quotes Ready`

---

## Messaging System

Outbound messages are queued as jobs and dispatched via:

- **Twilio** — production SMS (requires `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`)
- **Simulator** — local development via `TWILIO_SIMULATOR_URL`
- **SendGrid** — email (planned)

Inbound SMS arrives at `POST /api/webhooks/sms`, which parses the message, looks up or creates the contact, and saves it as an internal `Message` record.

---

## Background Jobs

| Task | Trigger | Purpose |
|---|---|---|
| `generateOrderQuotesTask` | Order created/updated | Generate price quotes using route evaluation |
| `dispatchMessageTask` | Message created (pending) | Send SMS/email via external provider |
| `calculateOrderRouteTimeTask` | Order created/updated | Calculate service time contribution to a route |

---

## Planned Features

### AI / LLM Integration

The architecture is designed for LLMs to act as **translation layers only** — algorithms own all routing, pricing, and business logic. Planned touch points:

- **Inbound SMS parsing** — Extract structured order data (cans, days, dates, address) from freeform customer texts
- **Address resolution** — Resolve ambiguous/malformed addresses before geocoding
- **Message generation** — Render quote summaries and customer notifications from structured algorithm output (LLM never invents numbers)
- **Natural language to operations** — Parse operator freeform commands into Payload queries

Provider: Anthropic Claude API.

### Predictive Recommendations (ML Roadmap)

Three planned recommendation signals per customer account:

| Signal | Description |
|---|---|
| **Upsell Score** | Flag accounts likely to benefit from additional services |
| **Check-in Score** | Alert when high-value accounts haven't been contacted recently |
| **Risk Flag Score** | Detect potential churn, payment issues, or service problems |

**Implementation Phases:**

- **Phase 1 (MVP)** — Rule-based scoring with admin feedback collection (`prediction_feedback` collection)
- **Phase 2** — Lightweight classifier (logistic regression) trained on admin feedback labels
- **Phase 3** — Nightly feature pipeline with automated retraining

Feature engineering categories: temporal (service frequency, tenure), geographic (depot distance, route clustering), monetary (LTV, revenue trends), behavioral (contact frequency, message volume), and composite composites.

---

## Development

### Quick Start

```bash
cp .env.example .env       # fill in required values
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Follow on-screen instructions to create the first admin user.

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | JWT encryption key |
| `NEXT_PUBLIC_SERVER_URL` | Backend URL (no trailing slash) |
| `CRON_SECRET` | Auth token for cron endpoints |
| `PREVIEW_SECRET` | Auth token for draft preview |
| `BUSINESS_TIMEZONE` | IANA timezone (e.g. `America/Denver`) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID (SMS) |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_SIMULATOR_URL` | Local SMS simulator URL (dev only) |

### Database Migrations (PostgreSQL)

```bash
# Create a migration after schema changes
pnpm payload migrate:create

# Run pending migrations (production / CI)
pnpm payload migrate
```

In local development, `push: true` is set on the Postgres adapter so schema changes apply automatically without migrations.

### Seed Data

Click **Seed Database** in the admin panel to populate demo orders, routes, and contacts.

```
# Utility endpoints (dev only)
POST /api/seed-week-routes     # Generate a week of planned routes
POST /api/seed-route-stops     # Populate stops on existing routes
POST /api/delete-route-stops   # Remove all route stops
```

### Docker

```bash
docker-compose up
```

The compose file reads `.env` automatically. Open `http://localhost:3000` after startup.

---

## Production

```bash
pnpm build
pnpm start
```

Run `pnpm payload migrate` before `pnpm start` on each deploy to apply any pending schema migrations.

### Vercel Deployment

Install the Vercel Postgres adapter:

```bash
pnpm add @payloadcms/db-vercel-postgres
```

```ts
// payload.config.ts
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

export default buildConfig({
  db: vercelPostgresAdapter({
    pool: { connectionString: process.env.POSTGRES_URL || '' },
  }),
})
```

> Note: Vercel's free tier limits cron jobs to daily frequency, which affects quote generation scheduling.

---

## Questions

Open a [GitHub Discussion](https://github.com/payloadcms/payload/discussions) for Payload-specific questions, or reach out on [Discord](https://discord.com/invite/payload).
