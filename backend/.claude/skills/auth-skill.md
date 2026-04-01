# Auth Skill

- Goal:
  - Implement or review authentication and route protection.
- Must support:
  - signup
  - login
  - JWT access token
  - refresh token
  - logout
- Protection rules:
  - Block guest access to protected dashboard routes.
  - Preserve intended route after successful login.
- Security rules:
  - Hash passwords.
  - Validate tokens and request payloads.
- Communication:
  - Tell frontend which routes are protected and what auth state the UI must expect.
