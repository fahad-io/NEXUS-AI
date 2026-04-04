# Auth Spec

- Entry points:
  - Login
  - Signup
- Auth model:
  - JWT access token.
  - Refresh token for session renewal.
- Required behavior:
  - Protect dashboard routes.
  - Preserve intended destination after login.
  - Support logout from protected areas.
- Security expectations:
  - Hash passwords.
  - Validate credentials and tokens.
  - Expire or revoke refresh tokens safely.

