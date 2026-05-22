---
title: OmniForce
description: A full-stack CRM and route management platform for mobile service businesses — built on Payload CMS and Next.js to replace spreadsheets and phone calls with automated quoting, route planning, and two-way SMS.
stack: [Next.js, Payload CMS, MapLibre GL]
repo: https://github.com/joelemoffatt/omniforce
live: ""
date: 2025-03-01
featured: true
---

## Overview

OmniForce is a CRM and operations platform built for route-based field service businesses — trash can cleaning, dumpster rentals, portable toilets, junk removal. These businesses run on a mix of spreadsheets, phone calls, and paper routes. OmniForce replaces that with a single admin panel: customer management, automated quoting, route planning, fleet tracking, and two-way SMS, all connected.

It's built on Payload CMS 3.x as the backend framework, extended heavily with custom collections, background jobs, and business logic. Next.js 16 handles the frontend and API layer.

## The Challenge

Route-based service businesses have a specific operational loop that generic CRMs don't model well. An order comes in, someone has to figure out which truck can take it, what it will cost given drive time and service time, and then get a quote back to the customer before they call a competitor. Doing this manually for every order doesn't scale.

The core technical challenge was building a quote engine that could evaluate real candidate routes, simulate inserting a stop, calculate drive time using actual road data, and price the job — automatically, the moment an order is created — without any manual input.

## What I Built

**Quote engine** — When an order is created, a background job geocodes the address, fetches all candidate routes in the order's pickup window, and for each route simulates inserting the stop and calls OSRM to calculate the drive time delta. Cost is computed as `labor + drive time cost + markup + tax`, clamped between configured min/max charges. The engine generates `fastest`, `best-cost`, and `other` quote options and updates the order status to `Quotes Ready`.

**CRM** — Full contact and order lifecycle: status transitions from `Pending` → `Quotes Ready` → `Quote Selected` → `In Progress` → `Completed`, recurring subscriptions with configurable day/week schedules, tasks, notes, and an immutable audit log of every create/update/delete action.

**Route management** — Plan truck routes per day, sequence stops, track depots and break points, and visualize routes on a map with MapLibre GL.

**SMS / Email messaging** — Two-way customer communication via Twilio. Outbound messages are queued as background jobs. Inbound SMS hits a webhook, parses the message, looks up or creates the contact, and saves it as a message record. All messages are stored with provider snapshots and delivery status.

**Role-based access** — Six roles (Super Admin, Owner, Admin, Sales Rep, Tech, Contact) with granular collection-level permissions throughout.

## Technical Highlights

- **OSRM integration for real drive time** — Rather than straight-line estimates, every quote simulation calls the Open Source Routing Machine to get actual road-network drive times. This is what makes the pricing accurate enough to trust for real jobs.
- **Payload Jobs for async work** — Quote generation, message dispatch, and route time calculation all run as background tasks through Payload's job queue, keeping the API response fast and failures recoverable.
- **Geocoding pipeline** — Nominatim (OSM) handles address-to-coordinate resolution before any routing call, with the result cached on the order to avoid redundant lookups.
- **LLM as translation layer (planned)** — The architecture deliberately keeps algorithms in control of all routing and pricing logic. LLM integration via Anthropic's API is scoped to structured-data extraction (parsing inbound SMS into order fields) and message rendering — never inventing numbers or making routing decisions.

## Outcome

OmniForce is in active development. The quote engine, CRM, messaging system, and route planner are all implemented. Planned next phases include ML-based predictive scoring (upsell likelihood, churn risk, check-in alerts) trained on admin feedback labels, and LLM-powered inbound SMS parsing to automatically create orders from freeform customer texts.
