# SafePath Client

**SafePath** is a full-stack community safety platform for reporting, reviewing, and following local safety incidents in real time. This repository contains the **SafePath web client**, a Next.js 16 application that provides the public incident feed, authentication flows, a personal dashboard, and the administrator and super-admin consoles.

<div align="center">
  <img height="500" src="https://drive.google.com/uc?export=view&id=1h1nEyMjruNqskdQNG-fE27pqd26ZJLdd" />
</div>

---

## Table of Contents

- [Live Demo](#live-demo)
- [Overview](#overview)
- [Core Technologies](#core-technologies)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Demo Accounts](#demo-accounts)
- [Links](#links)
- [License](#license)

---

## Live Demo

| Resource | Link |
| -------- | ---- |
| Frontend | https://safe-path-client.vercel.app |
| Backend API | https://safe-path-server.vercel.app |
| API health check | https://safe-path-server.vercel.app/health |
| Postman documentation | https://documenter.getpostman.com/view/59636503/2sBYHYuHmm |

---

## Overview

SafePath gives residents a safe, transparent way to report and follow local safety incidents. The client communicates with the [SafePath API](https://github.com/mdashraful24/safe-path-server) through credentialed requests and supports three account roles:

| Role | Capabilities |
| ---- | ------------ |
| **User** | Report incidents, manage their own reports, comment on approved incidents, and manage their profile |
| **Admin** | Review incidents, moderate comments, manage users, and handle contact and deletion requests |
| **Super Admin** | Everything an admin can do, plus managing administrators and change requests |

The application is built with the Next.js App Router, uses TanStack Query for server-state, and is fully responsive with light and dark themes.

---

## Core Technologies

- **Next.js 16** (App Router, React Server Components)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **TanStack Query** for server-state and cache management
- **TanStack Form** for typed forms
- **Zod** for schema validation
- **Base UI** and custom accessible UI primitives
- **Sonner** for toast notifications
- **next-themes** for light/dark mode
- **ofetch** for the typed API client
- **Google OAuth** via `@react-oauth/google`
- **Biome** for linting and formatting

---

## Key Features

### Public

- Landing page with feature highlights, how it works, and calls to action
- Public incident feed containing approved incidents only
- Incident detail pages with images and paginated comments
- Contact form with client and server validation
- Legal pages: privacy policy, terms of service, cookie policy, and community guidelines
- Responsive layout with light and dark themes

### Authentication

- Registration with email verification via OTP
- Password login and Google sign-in
- Forgot-password and password-reset flows
- Account restoration and deletion request workflows
- Secure cookie-based sessions with automatic access-token refresh
- Role-aware navigation and route guards

### Authenticated Users

- Personal dashboard with overview statistics
- Create, edit, and delete pending incident reports
- Incident image upload and replacement
- Profile management, including verified email changes
- Account deletion and restoration requests
- Comment on approved incidents
- Quick demo login buttons for seeded accounts

### Administrators

- Review, approve, or reject incident reports with moderation notes
- Manage users, including blocking and restoring accounts
- Review account deletion requests
- Read and reply to contact messages
- Moderate comments on incidents
- View dashboard analytics

### Super Administrators

- Everything available to administrators
- Review and action administrator change requests
- Promote or demote administrators

### Platform

- Role-based access control
- Client-side validation with Zod
- Cache synchronization for authentication state
- Loading skeletons and accessible, responsive UI components
- Centralized error handling with toast feedback
- Dark mode support

---

## Project Structure

```text
safe-path-client/
├── src/
│   ├── api/               # API request functions
│   ├── app/               # App Router pages and layouts
│   │   ├── (public)/      # Public and authentication routes
│   │   └── (dashboard)/   # User, admin, and super-admin routes
│   ├── components/        # UI, layout, form, and feature components
│   ├── hooks/             # TanStack Query hooks
│   ├── lib/               # API client and utilities
│   ├── providers/         # Query, theme, and Google providers
│   ├── types/             # Shared TypeScript types
│   └── validation/        # Zod schemas
├── public/
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

---

## Dependencies

### Runtime

| Package | Version | Purpose |
| ------- | ------- | ------- |
| `next` | ^16.4.5 | React framework and routing |
| `react`, `react-dom` | ^19.3.0 | UI runtime |
| `@tanstack/react-query` | ^5.106.1 | Server-state management |
| `@tanstack/react-form` | ^1.33.5 | Typed form state |
| `zod` | ^4.6.7 | Schema validation |
| `@base-ui/react` | ^1.9.0 | Accessible UI primitives |
| `@react-oauth/google` | ^0.13.5 | Google sign-in |
| `sonner` | ^2.0.8 | Toast notifications |
| `next-themes` | ^0.4.6 | Theme switching |
| `lucide-react` | ^1.70.0 | Icons |
| `ofetch` | ^1.5.1 | HTTP client |
| `input-otp` | ^1.5.0 | OTP input |
| `class-variance-authority`, `cn`, `shadcn` | - | Component styling utilities |
| `tailwindcss`, `tw-animate-css` | ^4 | Styling |

### Development

| Package | Version | Purpose |
| ------- | ------- | ------- |
| `typescript` | ^5 | Static typing |
| `@tailwindcss/turbopack` | ^4 | Tailwind integration for Turbopack |
| `@biomejs/biome` | 2.4.2 | Linting and formatting |
| `babel-plugin-react-compiler` | 1.0.0 | React Compiler support |
| `@types/node`, `@types/react`, `@types/react-dom` | - | Type definitions |

---

## Getting Started

### Prerequisites

- **Bun** 1.4 or newer (recommended) or Node.js 20 or newer
- A running instance of the **SafePath API** (local or deployed)
- A **Google OAuth Web Client ID** if you want Google sign-in

### 1. Clone the repository

```bash
git clone https://github.com/mdashraful24/safe-path-client.git
cd safe-path-client
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure the environment

```bash
cp .env.example .env.local
```

On Windows, use `copy .env.example .env.local`.

Set `NEXT_PUBLIC_API_URL` to your backend URL, including the `/api/v1` prefix:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

Optionally add the demo account credentials to enable the quick-login buttons on the login page.

### 4. Start the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page reloads automatically as you edit files.

### 5. Using the deployed API

To run the client against the deployed backend, set:

```env
NEXT_PUBLIC_API_URL=https://safe-path-server.vercel.app/api/v1
```

Make sure the backend's `FRONTEND_URL` allows the origin you are running the client on.

---

## Environment Variables

| Variable | Required | Description |
| -------- | :------: | ----------- |
| `NEXT_PUBLIC_API_URL` | Yes | Backend base URL including the `/api/v1` prefix |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | No | Google OAuth Web Client ID |
| `SEED_USER_EMAIL` / `SEED_USER_PASSWORD` | No | Demo user credentials for quick login |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | No | Demo admin credentials for quick login |
| `SEED_SUPER_ADMIN_EMAIL` / `SEED_SUPER_ADMIN_PASSWORD` | No | Demo super-admin credentials for quick login |

See [`.env.example`](./.env.example) for the complete template. Never commit real credentials.

---

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `bun dev` | Start the Next.js development server |
| `bun run build` | Create a production build |
| `bun start` | Run the production build |
| `bun run lint` | Run Biome checks |
| `bun run format` | Format source files with Biome |

The same commands work with `npm`, `pnpm`, or `yarn` if you prefer a different package manager.

---

## API Overview

The client consumes the SafePath REST API at `/api/v1`:

| Area | Base path |
| ---- | --------- |
| Authentication | `/auth` |
| Contact | `/contact` |
| Users | `/users` |
| Dashboard | `/dashboard` |
| Incidents | `/incidents` |
| Admin | `/admin` |
| Super admin | `/super-admin` |

For full endpoint documentation, see the [Postman collection](https://documenter.getpostman.com/view/59636503/2sBYHYuHmm) or the [server repository](https://github.com/mdashraful24/safe-path-server).

---

## Demo Accounts

Demo accounts and demo incidents can be created automatically by the backend when `SEED_ON_START=true`. Configure the credentials with the `SEED_*` variables in the server environment, then mirror the user-facing values in `.env.local` to enable the quick-login buttons.

Demo roles:

- **User** - reports and manages their own incidents
- **Admin** - moderates incidents, users, comments, and contact messages
- **Super Admin** - manages administrators and reviews change requests

---

## Links

- Live frontend: https://safe-path-client.vercel.app
- Live API: https://safe-path-server.vercel.app
- API health check: https://safe-path-server.vercel.app/health
- Postman documentation: https://documenter.getpostman.com/view/59636503/2sBYHYuHmm
- Frontend repository: https://github.com/mdashraful24/safe-path-client
- Backend repository: https://github.com/mdashraful24/safe-path-server

---

## License

No license has been specified for this project. Contact the repository owner before reusing or distributing the code.
