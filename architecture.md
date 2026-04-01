# NexusAI Architecture

## Overview

Full-stack AI Model Hub platform enabling users to discover, compare, and interact with 400+ AI models.

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Client)                   │
│  Next.js 16 App Router  ·  Tailwind CSS  ·  MUI     │
│  Port: 3000                                          │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP/REST (axios)
                       │ NEXT_PUBLIC_API_URL
                       ▼
┌─────────────────────────────────────────────────────┐
│              NestJS Backend API                      │
│  Port: 3000  ·  Global prefix: /api                 │
│  CORS: localhost:3000                                │
└──────────────────────┬──────────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
   In-Memory Store            Kimi / Mock AI
   (Maps for users,           (configurable via
   sessions, chats)           MOCK_AI env var)
```

## Frontend Architecture

```
src/
├── app/
│   ├── layout.tsx              — Root layout (metadata, fonts)
│   ├── page.tsx                — Landing page (/)
│   ├── (main)/
│   │   ├── layout.tsx          — Layout with Navbar
│   │   ├── chat/page.tsx       — Chat Hub (/chat)
│   │   ├── marketplace/page.tsx — Marketplace (/marketplace)
│   │   ├── discover/page.tsx   — Research feed (/discover)
│   │   └── agents/page.tsx     — Agent builder (/agents)
│   ├── auth/
│   │   ├── login/page.tsx      — Login (/auth/login)
│   │   └── signup/page.tsx     — Sign-up (/auth/signup)
│   └── dashboard/
│       ├── page.tsx            — Dashboard overview
│       ├── history/page.tsx    — Chat history
│       ├── settings/page.tsx   — User settings
│       └── billing/page.tsx    — Billing
├── components/
│   ├── layout/Navbar.tsx       — Top navigation bar
│   ├── ui/                     — ModelCard, Toast, etc.
│   └── chat/GuestBanner.tsx    — Guest session banner
├── hooks/
│   ├── useAuth.ts              — Auth state + actions
│   └── useModels.ts            — Model fetching
├── lib/
│   ├── api.ts                  — Axios client + endpoint helpers
│   ├── auth.ts                 — localStorage auth helpers
│   └── models-fallback.ts      — Static model data (30 models)
└── types/index.ts              — All TS types + CPANEL_DATA
```

## Backend Architecture

```
src/
├── main.ts                  — Bootstrap + CORS + global pipes
├── app.module.ts            — Root module
├── auth/                    — JWT auth (signup/login/me/refresh)
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   └── local.strategy.ts
├── users/                   — User management (in-memory Map)
│   ├── users.module.ts
│   └── users.service.ts
├── models/                  — AI model catalog
│   ├── models.module.ts
│   ├── models.service.ts    — Loads from data/models.json
│   └── models.controller.ts
├── chat/                    — Chat sessions + AI responses
│   ├── chat.module.ts
│   ├── chat.service.ts      — Guest sessions + AI integration
│   └── chat.controller.ts
├── upload/                  — File uploads (multer)
│   ├── upload.module.ts
│   ├── upload.service.ts
│   └── upload.controller.ts
├── dashboard/               — Stats + history (protected)
│   ├── dashboard.module.ts
│   ├── dashboard.service.ts
│   └── dashboard.controller.ts
├── forms/                   — Contact/feedback forms
│   ├── forms.module.ts
│   └── forms.controller.ts
└── data/
    ├── models.json          — 30 AI model definitions
    └── labs.json            — AI lab metadata
```

## Authentication Flow

```
Signup/Login
    │
    ▼
POST /api/auth/signup|login
    │
    ▼
Returns { access_token (JWT), user }
    │
    ▼
Frontend stores in localStorage:
  nexusai_token = JWT
  nexusai_user  = JSON user object
    │
    ▼
Axios interceptor adds: Authorization: Bearer <token>
    │
    ▼
Backend JwtAuthGuard validates on every protected route
```

## Guest Session Flow

```
User visits /chat (not authenticated)
    │
    ▼
createGuestSession() generates UUID
Stores in localStorage:
  nexusai_session_id     = UUID
  nexusai_session_expiry = now + 3hrs
    │
    ▼
Axios interceptor adds: x-session-id header
    │
    ▼
POST /api/chat/send with sessionId
Backend stores session in Map<id, { messages, expiresAt }>
    │
    ▼
GuestBanner shows "Xh Xm remaining · Sign in to save"
    │
    ▼
After 3 hours: session cleared, banner prompts sign-in
```

## Model Switching

```
Left sidebar model list
    │ click
    ▼
setActiveModel(modelId)
    │
    ▼
Active model shown in:
  - Chat input badge (bottom right)
  - Right panel "Active Model" card
  - POST /chat/send body: { modelId }
    │
    ▼
Backend uses modelId to select AI provider
(Mock: fixed responses regardless of model)
(Live: passes modelId to Kimi/OpenAI API)
```

## Data Flow: Chat Message

```
User types + clicks send
    │
    ▼
addUserMessage(text) → UI update
showTypingIndicator()
    │
    ▼
POST /api/chat/send
  { message, modelId, sessionId, history }
    │
    ▼
Backend chat.service.ts:
  - Validates/extends guest session
  - MOCK_AI=true → returns mock response
  - MOCK_AI=false → calls Kimi API
    │
    ▼
Response: { reply, modelId, sessionId, timestamp }
    │
    ▼
removeTypingIndicator()
addAIMessage(reply) → UI update
Save to sessionStorage (guests) or backend (auth users)
```

## Tech Decisions

| Decision | Choice | Reason |
|---|---|---|
| No database | In-memory Maps | Simplicity; easy to swap for PostgreSQL/MongoDB later |
| Guest sessions | localStorage + sessionStorage | No backend state needed for UI; 3-hour TTL enforced |
| Fallback models | Static TypeScript array | Works without backend; consistent UI during dev |
| Mock AI | Rotating string responses | Enables full UI dev/testing without API costs |
| CSS variables | Custom properties in globals.css | Matches reference HTML exactly; no Tailwind utility conflicts |
| Light theme only | Intentional | Matches reference HTML design system |
