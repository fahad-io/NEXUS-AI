# NexusAI Frontend

## Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + CSS Custom Properties (design tokens)
- **UI Library**: MUI (Material UI)
- **HTTP Client**: axios
- **Fonts**: Syne (headings), Instrument Sans (body) — Google Fonts

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local   # or create .env.local manually
npm run dev
```

Runs on **http://localhost:3000** (set via package.json `dev` script — update if needed).

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/` |

## Routes

| Route | Description | Auth |
|---|---|---|
| `/` | Landing page with hero + model showcase | Public |
| `/chat` | Chat Hub (3-column AI chat interface) | Guest OK |
| `/marketplace` | Model marketplace with filters | Public |
| `/discover` | AI research feed | Public |
| `/agents` | Agent builder & templates | Public |
| `/auth/login` | Login page | Public |
| `/auth/signup` | Sign-up page | Public |
| `/dashboard` | User dashboard overview | Protected |
| `/dashboard/history` | Chat history | Protected |
| `/dashboard/settings` | User settings | Protected |
| `/dashboard/billing` | Billing info | Protected |

## Key Files

```
src/
  app/             — Next.js App Router pages
  components/
    layout/        — Navbar, Footer
    ui/            — Reusable UI components (ModelCard, Toast, etc.)
    chat/          — Chat-specific components
    marketplace/   — Marketplace components
  hooks/
    useAuth.ts     — Auth state management
    useModels.ts   — Model fetching with fallback
  lib/
    api.ts         — Axios API client
    auth.ts        — Auth helpers (token/session storage)
    models-fallback.ts  — Static fallback models data
  types/
    index.ts       — TypeScript types + CPANEL_DATA + QUICK_ACTIONS
```

## Design System

All colors use CSS custom properties defined in `globals.css`:

```css
--accent: #C8622A      /* Primary orange-brown */
--bg: #F4F2EE          /* Page background */
--white: #FFFFFF       /* Cards */
--text: #1C1A16        /* Primary text */
--text2: #5A5750       /* Secondary text */
--text3: #9E9B93       /* Muted text */
```

Light theme only — dark mode is intentionally disabled.

## Guest Sessions

- Created automatically on first visit to `/chat`
- Stored in `localStorage` keys:
  - `nexusai_session_id` — UUID
  - `nexusai_session_expiry` — Timestamp (3 hours from creation)
- Chat history stored in `sessionStorage` keyed by session ID
- Guest banner shows remaining time
- Sessions expire after **3 hours** — expired sessions are cleared on next read

## Auth (Authenticated Users)

- JWT token stored in `localStorage` as `nexusai_token`
- User object stored as `nexusai_user`
- Token included in all API requests via axios interceptor
- Dashboard routes redirect to `/auth/login` if not authenticated

## Adding New Pages

```tsx
// src/app/(main)/my-page/page.tsx
'use client';
export default function MyPage() {
  return <main>...</main>;
}
```

Pages under `(main)/` automatically get the Navbar via `(main)/layout.tsx`.

## Run Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```
