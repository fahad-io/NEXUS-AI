# NexusAI Backend

## Stack
- **Framework**: NestJS 11 + TypeScript
- **Auth**: JWT (passport-jwt) + bcryptjs
- **File Upload**: Multer
- **Validation**: class-validator + class-transformer
- **Storage**: In-memory (Maps) — no database required

## Setup

```bash
cd backend
npm install
cp .env.example .env   # or create .env manually
npm run start:dev
```

Runs on **http://localhost:3000**

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | JWT signing secret | — (required) |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:3000` |
| `MOCK_AI` | Use mock AI responses | `true` |
| `AI_API_KEY` | Kimi (Moonshot) API key | — (optional) |
| `AI_BASE_URL` | Kimi API base URL | `https://api.moonshot.cn/v1` |

## API Endpoints

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Create account |
| POST | `/auth/login` | Public | Login → returns `{ access_token, user }` |
| GET | `/auth/me` | Bearer | Get current user |
| POST | `/auth/refresh` | Bearer | Refresh token |

### Models — `/api/models`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/models` | Public | List all models (supports `?type=&lab=&search=`) |
| GET | `/models/:id` | Public | Get single model |

### Chat — `/api/chat`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/chat/send` | Guest OK | Send message (include `x-session-id` header for guest) |
| GET | `/chat/history` | Bearer | Get user chat history |
| POST | `/chat/session` | Public | Create new session |
| DELETE | `/chat/session/:id` | Public | Delete session |

**POST /chat/send body:**
```json
{
  "message": "string",
  "modelId": "string",
  "sessionId": "optional-uuid",
  "history": []
}
```

### Upload — `/api/upload`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/upload` | Public | Upload file → returns `{ url, filename, size, type }` |

### Dashboard — `/api/dashboard`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/dashboard/stats` | Bearer | Usage statistics |
| GET | `/dashboard/history` | Bearer | Paginated chat history |
| GET | `/dashboard/billing` | Bearer | Billing information |

### Forms — `/api/forms`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/forms/contact` | Public | Contact form submission |
| POST | `/forms/feedback` | Public | Feedback submission |

## Key Files

```
src/
  main.ts              — Bootstrap, CORS, global pipes
  app.module.ts        — Root module
  auth/                — JWT auth module
  users/               — User management (in-memory)
  models/              — AI models data (loads from src/data/models.json)
  chat/                — Chat sessions + AI integration
  upload/              — File upload handling
  dashboard/           — Stats and history
  forms/               — Contact / feedback forms
  data/
    models.json        — 30 AI model definitions
    labs.json          — AI lab definitions
```

## Guest Sessions

- No authentication required for `/chat/send` with a `sessionId`
- Sessions stored in memory: `Map<sessionId, { messages, createdAt, expiresAt }>`
- Expiry: **3 hours** from creation
- On read: expired sessions are cleaned up
- Sessions are NOT persisted — restart clears them

## AI Integration

- `MOCK_AI=true` → returns rotating mock responses (no API call)
- `MOCK_AI=false` → calls Kimi (Moonshot) API at `AI_BASE_URL`
- Fallback: if Kimi call fails, returns a mock response

## Run Commands

```bash
npm run start:dev    # Development (watch mode)
npm run start        # Production
npm run build        # Compile TypeScript
npm run test         # Unit tests
npm run test:e2e     # End-to-end tests
```
