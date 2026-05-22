---
title: SurvivorOutDraft
description: A fantasy league app for the TV show Survivor — draft castaways with friends, earn points from real game events, and track scores live as episodes air.
stack: [Spring Boot, Expo, Python]
repo:
  - label: Backend
    url: https://github.com/joelemoffatt/SurvivorOutDraft-Backend
  - label: Frontend
    url: https://github.com/joelemoffatt/survivor-outdraft-frontend
  - label: Data Pipeline
    url: https://github.com/joelemoffatt/survivoRDataWrangling
live: "https://outdraft.joelmoffatt.com/login"
date: 2024-05-20
featured: true
---

## Overview

SurvivorOutDraft is a fantasy league app built around the TV show Survivor. Before a season starts, groups of friends draft castaways in a snake draft. As the season airs, real game events — immunity wins, idol finds, tribal votes, the final winner — automatically translate into points. Whoever drafted the best team wins the league.

The app has three parts: a React Native / Expo frontend (mobile + web), a Spring Boot REST API backend, and a Python data pipeline that ingests and transforms Survivor game data from an open-source dataset into the database.

## The Challenge

The core problem is data. Survivor is a complex game with dozens of event types per episode — challenges, votes, advantages, journeys, jury votes, boots — and the scoring system needs to handle all of them accurately. Getting that data from raw source files into a queryable schema, correctly modeled for scoring, without manual entry per episode was the main engineering challenge.

The secondary challenge was building a draft system that works in real time for a group on game night — snake order, turn management, live state, all running through a single API.

## What I Built

**Draft system** — Snake draft with configurable pick order, real-time turn tracking, and state transitions (`start` → `pick` → `complete` / `reset`). Each user picks a castaway performance (a castaway's run in a specific season), not just a castaway, so the same player can appear in multiple seasons.

**Scoring engine** — Groups define their own `PointRule` set: how many points for an immunity win, finding an idol, being voted out, winning the game, etc. `PointCalculationService` scans all game events and generates `TeamCastawayScoreEvent` records. Scores can be recalculated at any time as new episode data is loaded.

**Frontend** — Single Expo project targeting iOS, Android, and web from one codebase. Player view is mobile-optimized for game night on a phone. Admin dashboard is web-optimized for managing groups, triggering score recalculations, and loading new episode data. Expo Router handles file-based routing with route groups for the two experiences.

**Data pipeline** — A Python ETL script pulls raw JSON from the [survivoR](https://github.com/doehm/survivoR) open-source dataset, validates and transforms it to match the JPA entity models, and writes processed files that the Spring Boot `DataLoader` ingests on startup. Incremental mode skips the full wipe and only inserts new records, cutting reload time when only recent episodes have changed. A separate image importer script downloads castaway photos with safety checks: HTTPS only, host allowlist, content-type validation, file size cap, and atomic writes.

**Backend** — Spring Boot 4 / Java 21 REST API with JWT authentication, Spring Security, and a full DTO layer so controllers never expose raw entities. Flyway manages schema versioning. Hibernate batch size is set to 250 for efficient bulk inserts during data loading.

## Technical Highlights

- **Incremental data loading** — Full reloads of all Survivor seasons take around an hour. Incremental mode diffs against existing records and only inserts new episodes, keeping data refreshes fast as the current season airs.
- **Castaway performance model** — Drafting a "castaway performance" rather than a castaway means the same person returning for an all-stars season is treated as a distinct draftable entity, with their own stats and scoring history for that run.
- **Stateless API with JWT** — No server-side sessions. All auth is via Bearer tokens, keeping the backend horizontally scalable and the mobile client simple.
- **Shared Expo codebase** — Player and admin experiences share components, API clients, and types while diverging at the route-group level for platform-specific UI optimizations.

## Outcome

SurvivorOutDraft is a private project built for actual game nights with friends. The draft system, scoring engine, and data pipeline are all working. The current season's data can be updated episode by episode by running the ETL script and restarting the backend with the incremental flag set.
