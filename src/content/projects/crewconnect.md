---
title: CrewConnect
description: A digital platform connecting field crews, safety managers, and project engineers — replacing paper-based construction workflows with real-time mobile and web tools.
stack: [Node.js, PostgreSQL, Expo]
repo: https://github.com/joelemoffatt/crewconnect
live: https://crewconnect.site/
date: 2024-11-01
featured: true
---

## Overview

CrewConnect modernizes construction field operations by replacing paper-based systems with real-time digital workflows. The platform connects field workers, safety managers, and project engineers — giving everyone the right tools and data for their role.

It ships as two products: a mobile app for field crews and a web dashboard for management.

## The Challenge

Construction sites run on paper. Timesheets, safety checklists, equipment inspections, and daily production logs are filled out by hand, handed in late, and often lost or illegible. The result is administrative overhead, compliance gaps, and no visibility into what's actually happening on site.

The core challenge was building something field workers would actually use — fast, offline-tolerant, and simple enough to operate with a hard hat on — while giving managers the real-time data they need to make decisions.

## What I Built

**Mobile app (iOS / Android)** — Built with React Native for cross-platform compatibility. Field workers can clock in/out with geolocation, complete digital safety checklists and equipment inspections, capture signatures, and log daily production. Push notifications handle task reminders and safety alerts.

**Web dashboard** — Built with React. Managers get live crew oversight, productivity analytics, and full reporting tools. Role-based access controls let admins, supervisors, and safety managers see exactly what they need.

**Backend** — Node.js + Express API with a PostgreSQL database. Cloud-integrated for file storage, push notifications, and analytics. Secure auth with role-based permissions throughout.

## Technical Highlights

- Cross-platform mobile from a single React Native codebase targeting iOS and Android
- Geolocation tracking tied to clock-in/clock-out events for accountability without micromanagement
- Role-based access model with distinct permission sets for field workers, supervisors, and admins
- Real-time dashboard updates so management sees field data as it's captured, not at end of day

## Outcome

CrewConnect is live and in use. The web app is at [crewconnect.site](https://crewconnect.site/) and the mobile version at [crewconnect.site/mobile](https://crewconnect.site/mobile).

Built with Spencer Perry, Liam Coburn, and Cody Mathews.
