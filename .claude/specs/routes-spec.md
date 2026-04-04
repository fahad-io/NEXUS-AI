# Routes Spec

- Public routes:
  - `/`
  - `/chat`
  - `/marketplace`
  - `/discover`
  - `/agents`
  - `/login`
  - `/signup`
- Protected routes:
  - `/dashboard`
  - `/dashboard/chat`
  - `/dashboard/marketplace`
  - `/dashboard/usage`
  - `/dashboard/settings`
- Route behavior:
  - Guests can access public discovery and guest chat routes.
  - Guests trying protected routes are redirected to login.
  - Authenticated users can open dashboard routes directly.
  - Marketplace CTA can deep-link into `/chat` with a selected model.

