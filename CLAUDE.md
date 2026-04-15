# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

NexusAI is a full-stack AI Model Hub — users discover, compare, and chat with 400+ AI models. It has a Chat Hub (3-column interface), Marketplace (filter/browse models), Research feed, and an Agent builder.

## Repository Layout

```
NEXUS-AI/
├── backend/          NestJS 11 API (port 8080)
├── frontend/         Next.js 16 app (port 3000)
├── skills/           Agentic skill definitions (api.md, playwright.md, test-generator.md)
├── agent-pipeline.js Orchestrates agentic workflows
└── package.json      Root: playwright E2E tests + pipeline runner
```

Each sub-project has its own `CLAUDE.md` with stack/routes/key-files detail:
- `backend/CLAUDE.md` — API endpoints, env vars, auth, guest sessions
- `frontend/CLAUDE.md` — Routes, design system, auth/guest storage keys

## Development Commands

**Backend** (from `backend/`):
```bash
npm run start:dev    # Hot-reload dev server on :8080
npm run build        # Compile TypeScript → dist/
npm run test         # Jest unit tests
npm run test:e2e     # E2E tests
npm run lint         # ESLint + auto-fix
```

**Frontend** (from `frontend/`):
```bash
npm run dev          # Dev server on :3000
npm run build        # Next.js production build
npm run lint         # ESLint
```

**Root** (from repo root):
```bash
npm run pipeline     # Run agentic workflow pipeline
npm run test         # Playwright E2E tests
```

**Swagger UI** is available at `http://localhost:8080/api/docs` when the backend is running.

## Architecture

```
Browser (Next.js :3000)
        │ axios — NEXT_PUBLIC_API_URL
        ▼
NestJS API (:8080)  — global prefix /api
        │
   ┌────┴────┐
   ▼         ▼
MongoDB    Kimi API (or mock)
(Mongoose) (MOCK_AI=true → rotating mock responses)
```

### Backend Modules

| Module | Path | Responsibility |
|---|---|---|
| Auth | `src/auth/` | JWT signup/login/refresh/logout, Passport strategies |
| Users | `src/users/` | MongoDB user CRUD |
| Models | `src/models/` | Serves 400+ models from `src/data/models.json` via MongoDB |
| Chat | `src/chat/` | Sessions (auth + guest), message routing, AI calls |
| Dashboard | `src/dashboard/` | Protected stats, history, billing |
| Upload | `src/upload/` | Multer file upload → `uploads/` directory |
| Forms | `src/forms/` | Contact/feedback submissions |

Route guards: `JwtAuthGuard` (default), `@Public()` decorator skips it, `@OptionalAuth()` allows both.

### Frontend Structure

Pages live under `src/app/`:
- `(main)/` group — all get the `Navbar` via `(main)/layout.tsx`
- `auth/` — login/signup (public)
- `dashboard/` — protected; redirects to `/auth/login` if not authenticated

State/API wiring:
- `hooks/useAuth.ts` — auth state + login/signup/logout actions
- `hooks/useModels.ts` — model fetching with static fallback
- `lib/api.ts` — Axios instance with two interceptors: adds `Authorization: Bearer` for auth users, adds `x-session-id` header for guest sessions
- `lib/models-fallback.ts` — ~30 static models used when backend is unreachable

## Key Cross-Cutting Concerns

### Authentication
JWT stored in `localStorage` as `nexusai_token`. The Axios interceptor in `lib/api.ts` attaches it automatically. Backend validates via `JwtAuthGuard` on every protected route.

### Guest Sessions
- Auto-created (UUID) on first visit to `/chat` if not authenticated
- Stored in `localStorage`: `nexusai_session_id`, `nexusai_session_expiry` (3-hour TTL)
- Sent to backend via `x-session-id` header
- Backend stores in MongoDB with a TTL index — auto-deleted after 3 hours
- `GuestBanner` component shows countdown and prompts sign-in

### Model Data
400+ models defined in `backend/src/data/models.json`, seeded into MongoDB on startup. Frontend falls back to `lib/models-fallback.ts` (~30 models) when the backend is unavailable.

### Design System
All colors use CSS custom properties in `frontend/src/app/globals.css` (e.g. `--accent: #C8622A`, `--bg: #F4F2EE`). Light theme only — dark mode is intentionally absent. Use these variables rather than hardcoded hex values.

## Environment Setup

**Backend** — create `backend/.env`:
```
PORT=8080
JWT_SECRET=<required>
MONGODB_URI=mongodb://localhost:27017/nexusai
FRONTEND_URL=http://localhost:3000
MOCK_AI=true
# AI_API_KEY=<kimi key if MOCK_AI=false>
```

**Frontend** — create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/
```
