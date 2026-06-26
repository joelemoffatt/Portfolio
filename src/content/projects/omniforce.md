---
title: OmniForce
description: Full-stack CRM and route management platform for field service businesses. Features a fully automated quoting pipeline, configurable pricing engine and two-way SMS communication.
stack: [Next.js, Payload CMS, MapLibre GL]
repo: https://github.com/joelemoffatt/omniforce
live: ""
date: 2026-04-24
featured: true
---

## Overview

OmniForce is a CRM and operations platform built for route-based field service businesses — trash can cleaning, dumpster rentals, portable toilets, junk removal. These businesses run on a mix of spreadsheets, phone calls, and paper routes. OmniForce replaces that with a single admin panel: customer management, automated quoting for one-off jobs and recurring subscriptions, route planning, fleet tracking, two-way SMS, and a custom report builder.

Under the hood, OmniForce is a ~390-file TypeScript codebase built on Payload CMS 3.x and Next.js 16: 27 domain collections wired up with custom business logic, a background job queue handling quote generation and message dispatch, a geospatial routing layer over OSRM and Nominatim, in-memory analytics with period-aware filters, and a Puppeteer-driven pipeline that renders editable report templates to print-perfect PDFs.

## The Challenge

Route-based service businesses have a specific operational loop that generic CRMs don't model well. An order comes in, someone has to figure out which truck can take it, what it will cost given drive time and service time, and then get a quote back to the customer before they call a competitor. Doing this manually for every order doesn't scale.

The core technical challenge was building a quote engine that could evaluate real candidate routes, simulate inserting a stop, calculate drive time using actual road data, and price the job — automatically, the moment an order is created — without any manual input. The same engine then had to extend to recurring subscriptions, where a single quote covers multiple weekly slots on a truck's fixed schedule and each slot has to be priced against a route that doesn't fully exist yet.

## What I Built

**Quote engine** — When an order comes in, a background job geocodes the address, fetches every candidate route in the pickup window, simulates inserting the stop, and asks OSRM for the real drive-time delta against the road network. Cost is `labor + drive cost + markup + tax`, clamped between configured min/max charges, and surfaced as `fastest`, `best-cost`, and `other` options. Subscriptions run the same engine against recurring weekly slots — for a weekly cadence, all four occurrences (1st–4th Monday, say) are priced independently and bundled into a single quote total, with per-frequency markups so weekly, monthly, quarterly, and half-yearly prices stay directly comparable.

**CRM** — Full lifecycle for contacts, orders, and subscriptions: status transitions from Pending → Quotes Ready → Quote Selected → In Progress → Completed, recurring subscriptions with configurable day/week schedules, tasks, notes, and an immutable audit log of every create/update/delete action. Six roles (Super Admin, Owner, Admin, Sales Rep, Tech, Contact) with granular collection-level permissions throughout.

**Route management** — Plan truck routes per day and per recurring weekly slot, sequence stops, track depots and break points, and visualise routes on a map with MapLibre GL. Stop order is re-optimised live in the admin as stops are added or moved.

**Reports & analytics** — Saveable Graph, KPI, and Table primitives, each backed by a query config (collection + filter + metric + dimension) that runs in-memory against the live database. The same primitives compose into a Document Template — a drag-and-build report layout with rows, columns, sections, and content blocks — that the admin previews live and can generate as an immutable PDF snapshot on demand.

**Messaging** — Two-way customer communication over SMS via Twilio, with a local simulator behind the same interface so development and tests never touch the real provider. Outbound messages are queued as background jobs. Inbound SMS hits a signed webhook, parses the message, looks up or creates the contact, and saves the message with the provider snapshot and delivery status.

**Marketing attribution** — UTM parameters and landing path are captured on the visiting browser and persisted on the converting record (Order or Subscription) at form submit. A derived channel field — paid, organic, social, email, referral, direct, plus non-marketing classes for inbound SMS, phone, and walk-in — anchors a drill-down hierarchy of channel → source → campaign so the admin can ask which marketing spend produced which revenue.

## Design Process

A consistent process powers most of what shipped — and most of why it shipped quickly.

**Spec-driven, grounded in the domain.** Every non-trivial feature starts as a spec. The spec is interview-driven and pressure-tested against the project's living glossary and prior architectural decisions before any code is written, so new work either fits the existing model or explicitly displaces it.

**Vertical-slice user stories.** Each spec is broken into the thinnest end-to-end slices that prove a real path through the system, filed as issues on the project tracker. A slice ships as a single PR rather than queueing up half-finished scaffolding.

**Test-driven development against the real stack.** Features are built red-green-refactor. Integration tests run against a real Postgres and the actual Payload local API rather than mocks, so what the tests cover is what production sees. Frontend slices add a Playwright E2E that drives the admin and asserts the visible result.

**Architectural decisions as durable records.** Non-obvious calls — in-memory analytics over a separate warehouse, Puppeteer for PDF generation, conversion-only marketing attribution — are written up as short ADRs alongside the code. Future decisions get sharpened against the same record.

**Choosing what to delegate.** AI assistance is woven through every step above, but the call about which slices to delegate and which to write by hand is mine. High-risk algorithmic work — pricing, route optimisation, idempotent job handlers — gets owned and reviewed line by line. Repetitive scaffolding gets delegated and verified.

## Technical Highlights

- **OSRM-powered drive-time deltas** — Every quote candidate calls the Open Source Routing Machine for an actual road-network drive time rather than a straight-line estimate. Addresses are geocoded once via Nominatim and cached on the record so a quote regeneration costs zero extra geocoding calls.
- **TSP heuristics for live route optimisation** — A haversine-based distance matrix feeds a nearest-neighbour seed and an iterative 2-opt swap pass to produce a near-optimal stop order. The whole pass is pure TypeScript, fast enough to re-run on every stop edit in the admin (~50 stops), and lives in a single module that everything else imports — no scattered geo math.
- **Async job queue with idempotent handlers** — Quote generation, message dispatch, and route assignment all run as background jobs through Payload's queue, so the API stays fast and failures retry safely. Acceptance and locking jobs are idempotent by construction — they check for the side effect's prior existence before performing it, so a retry is a no-op rather than a duplicate.
- **Document templates → print-perfect PDF** — Reports are designed with recursive flex layout primitives (rows and columns nested up to three deep, with `fit`/`fill`/`fixed` sizing) at a fixed A4 page width. The same React tree renders both the live admin preview and the Puppeteer-captured PDF, so what the admin sees is what the customer gets — and the resulting report is stored as an immutable snapshot with the exact variables it was generated from.
- **In-memory analytics with period-aware filters** — Graphs, KPIs, and Tables share a query shape (collection + filter + metric + dimension). Filters use a custom `within` operator that takes period strings like `this-month` and resolves them to explicit date ranges at every query, so the preview stays live and saved configurations don't go stale.

## Outcome

OmniForce is in active development. Shipped: the quote engine for orders and subscriptions, full CRM with role-based access, day-of and recurring route planning, the report builder with live preview and PDF generation, two-way SMS, and marketing attribution. Next phases focus on LLM-assisted inbound SMS parsing — kept strictly as a translation layer that extracts structured order fields and renders outbound messages, never inventing numbers or making routing decisions — and ML-based predictive scoring (upsell likelihood, churn risk, check-in alerts) trained on admin feedback labels.
