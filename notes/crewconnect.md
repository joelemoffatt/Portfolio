# CrewConnect

## Overview
CrewConnect is a digital platform designed to modernize construction field operations. By connecting field crews, safety managers, and project engineers, it replaces outdated paper-based systems with real-time, streamlined workflows.

The platform includes:

- **Mobile App for Field Workers:** Tracks time, manages safety checklists, conducts equipment inspections, and records daily production.
- **Web Dashboard for Management:** Provides live analytics, crew oversight, and productivity insights.

By automatically capturing and analyzing field data, CrewConnect reduces administrative work, minimizes errors, and enhances compliance with safety policies. Built by construction professionals, it emphasizes ease of use, speed, and practicality, integrating geolocation tracking, digital signatures, and customizable forms.

CrewConnect empowers construction companies to make smarter, data-driven decisions, improving safety, accountability, and productivity across job sites.

## Front End

### Mobile (iOS / Android)
- Developed using React Native for cross-platform compatibility.
- Features include clock-in/clock-out, job tracking, equipment inspections, and safety reporting.
- Push notifications for task reminders and alerts.

### Web
- Built with React.
- Provides dashboards, reporting tools, and administrative controls.
- Real-time updates for project managers and supervisors.

## Back End
- Node.js with Express for API services.
- PostgreSQL database for structured data storage.
- Integration with cloud services for file storage, notifications, and analytics.
- Secure authentication and role-based access controls.

# CrewConnect

**Construction Workforce Management — Digitized.**

CrewConnect is a full-stack SaaS platform that replaces paper-based construction field operations with real-time, data-driven workflows. Built for foremen, superintendents, and back-office teams, it covers everything from GPS-verified time tracking to budget prediction and safety compliance.

**Live App:** https://crewconnect.site/
**Mobile:** https://crewconnect.site/mobile

---

## What It Does

| Domain | Features |
|---|---|
| **Time Tracking** | GPS-verified clock in/out, geofencing validation, live crew status |
| **Crew Management** | Assign workers to foremen, manage team structures, track workforce |
| **Project Management** | Create job sites with geofenced boundaries, cost code tracking |
| **Safety Compliance** | Digital DVIR submissions, safety observations, incident reporting |
| **Analytics & Reporting** | Labor cost dashboards, budget prediction (ML), equipment utilization |
| **Payroll** | Digital timecards with weekly approval workflows and export |
| **Custom Forms** | Form builder with submission tracking and review |
| **Offline Mobile** | Works without internet; data syncs when reconnected |

---

## Tech Stack

### Frontend — Web
- **React 19** with **Expo Router** (file-based routing, same codebase targets web + mobile)
- **Material-UI v6** for component library and theming
- **Recharts** for labor cost charts, budget graphs, and analytics dashboards
- **Mapbox GL** for interactive geofenced job site maps and GPS tracking
- **React Context API** for state management
- **Emotion** for CSS-in-JS styling

### Frontend — Mobile
- **React Native** with **Expo 54**
- **React Navigation** for tab-based navigation
- **Zustand** for state management
- **AsyncStorage** for offline-first persistence
- **expo-location** and **expo-image-picker** for device hardware access

### Backend
- **Node.js** with **Express.js v5**
- **Supabase** (PostgreSQL) for database and real-time subscriptions
- **Supabase Auth** + **JWT** for authentication
- Row-Level Security (RLS) enforces role-based access control at the database layer
- ML budget prediction model (`budgetPredictor.js`) trained at server startup

### Infrastructure
- **Frontend**: AWS CloudFront CDN — served at the edge globally
- **Backend**: AWS ECS (Fargate) on `us-east-2` with auto-scaling
- **Containers**: Docker (Node.js 18 base image)
- **CI/CD**: GitLab CI/CD with test and deploy stages
- **Database**: Supabase managed PostgreSQL

---

## Project Structure

```
crewconnect/
├── frontend/
│   ├── web/              # React/Expo web app
│   │   └── app/
│   │       ├── index.jsx         # Landing page
│   │       ├── features.jsx      # Feature showcase
│   │       ├── pricing.jsx       # Pricing plans
│   │       ├── support.jsx       # Help center
│   │       └── (app)/            # Authenticated routes
│   │           ├── dashboard.jsx       # Main dashboard
│   │           ├── map.jsx             # Interactive job site map
│   │           ├── projects/           # Project management
│   │           ├── workforce/          # Crew, employees, cost codes, equipment
│   │           ├── time/               # Timesheets, live status, timecards
│   │           ├── safety.jsx          # Safety forms and DVIR
│   │           ├── form/               # Custom forms and submissions
│   │           └── reports.jsx         # Analytics and reporting
│   └── mobile/           # React Native / Expo mobile app
├── backend/
│   ├── src/
│   │   ├── server.js           # Express server entry point
│   │   ├── routes/             # 20+ route modules
│   │   ├── controllers/        # Business logic
│   │   └── ml/
│   │       └── budgetPredictor.js  # ML budget forecasting model
│   ├── database/
│   │   ├── README.md           # Schema and RLS policy docs
│   │   └── migrations/         # Applied SQL migrations
│   └── Dockerfile
├── DEPLOYMENT.md
├── CLI_DEPLOYMENT_INSTRUCTIONS.md
├── CUSTOM_DOMAIN_SETUP.md
└── .gitlab-ci.yml
```

---

## App Routes

### Public (Marketing)
| Route | Description |
|---|---|
| `/` | Landing page — hero, feature highlights, tech stack, team |
| `/features` | Detailed feature breakdown with Field vs Management tabs |
| `/pricing` | Three-tier pricing with monthly/yearly billing toggle |
| `/support` | Help center with quick start guides and mobile downloads |

### Authenticated App
| Route | Description |
|---|---|
| `/dashboard` | Labor cost charts, weekly hours, company-wide stats |
| `/projects` | Job site list, creation, and editing |
| `/project/[id]/projectsOverview` | Individual project detail and labor overview |
| `/project/[id]/laborOverview` | Labor costs and hours broken down by worker |
| `/project/[id]/costCodesOverview` | Cost code tracking per project |
| `/workforce/employees` | Employee management, roles, and pay rate settings |
| `/workforce/crews` | Foreman-to-worker crew assignments |
| `/workforce/costCodes` | Hierarchical cost code management |
| `/workforce/equipment` | Equipment and vehicle tracking |
| `/time` | Timesheet management |
| `/time/live` | Live crew status with real-time updates |
| `/time/timecards` | Weekly timecard approval with digital signatures |
| `/map` | Interactive geofenced job site map |
| `/safety` | Safety compliance forms and DVIR submissions |
| `/form/formsOverview` | Custom form builder |
| `/form/submissions` | Submission tracking and review |
| `/reports` | Advanced analytics — labor, equipment, budget predictions |
| `/settings` | Company configuration |
| `/company` | Company profile management |

---

## Roles & Permissions

Access control is enforced via Supabase Row-Level Security policies:

| Role | Capabilities |
|---|---|
| **Admin** | Full access — all company data, settings, billing |
| **Supervisor** | Project management, crew assignment, timecard approval |
| **Foreman** | Manage their crew, submit timecards, view their projects |
| **Office** | Reporting, payroll export, read-only workforce data |
| **Laborer** | Clock in/out, submit safety forms, view own timecards |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Expo CLI (`npm install -g expo-cli`)
- A Supabase project with the schema applied

### Backend
```bash
cd backend
cp .env.example .env   # fill in Supabase URL, DB URL, JWT secret
npm install
npm run dev            # development with nodemon on port 3001
npm start              # production
npm test               # run test suite (Vitest)
```

### Web Frontend
```bash
cd frontend/web
cp .env.example .env   # fill in Supabase URL/keys, API base URL
npm install
npm run web            # start Expo web dev server
```

### Mobile App
```bash
cd frontend/mobile
npm install
npm start              # Expo CLI
npm run android        # Android emulator
npm run ios            # iOS simulator
```

---

## Deployment

The backend is containerized and deployed to AWS ECS Fargate; the frontend is distributed via CloudFront.

See the detailed runbooks for step-by-step instructions:
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — ECS/ECR deployment
- [`CLI_DEPLOYMENT_INSTRUCTIONS.md`](./CLI_DEPLOYMENT_INSTRUCTIONS.md) — CLI workflow
- [`CUSTOM_DOMAIN_SETUP.md`](./CUSTOM_DOMAIN_SETUP.md) — Domain and HTTPS configuration
- [`MOBILE_WEB_CLOUDFRONT_COMMANDS.md`](./MOBILE_WEB_CLOUDFRONT_COMMANDS.md) — CloudFront setup

The CI/CD pipeline in `.gitlab-ci.yml` runs tests on every push and deploys to ECS on merges to `main`.

---

## Database

PostgreSQL via Supabase. Core tables:

| Table | Purpose |
|---|---|
| `companies` | Multi-tenant root — all data scoped per company |
| `users` / `user_roles` | Authentication and RBAC |
| `projects` | Job sites with geofenced boundaries |
| `time_entries` | GPS-verified clock in/out records |
| `crews` / `employee_assignments` | Foreman-worker relationships |
| `cost_codes` | Hierarchical billing codes per project |
| `equipment` | Vehicle and equipment tracking |
| `customers` | Client/owner records |

Schema docs and RLS policies: [`backend/database/README.md`](./backend/database/README.md)

---

## Key Architecture Decisions

- **File-based routing** via Expo Router — single codebase targets both web and mobile
- **RLS at the database layer** — unauthorized data access is impossible even if the API layer has bugs
- **Offline-first mobile** — AsyncStorage buffers data; syncs when network is available
- **Geofencing via Mapbox** — GPS coordinates validated against job site polygons on clock in/out
- **Real-time dashboards** — Supabase real-time subscriptions push live crew status updates
- **Edge-served frontend** — CloudFront CDN eliminates latency for field workers on mobile data
- **Auto-scaling backend** — ECS Fargate scales compute to match peak crew clock-in windows

---

## Team

Built by four University of Utah Computer Science graduates:

| Name | Specialization | Contact |
|---|---|---|
| **Joel Moffatt** | Full Stack, Business Automation, DevOps | joelemoffatt@gmail.com |
| **Spencer Perry** | Networking, Embedded Systems, Mobile Dev | spencercoleperry@gmail.com |
| **Liam Coburn** | Web, Mobile, Image Processing | liammcoburn@gmail.com |
| **Cody Mathews** | Data Visualization, ML, Construction Tech | cody.m@crewconnect.io |
