# Guest Session Skill

- Goal:
  - Support guest chat before authentication.
- Requirements:
  - Guest data lasts 3 hours.
  - Track selected model and chat history.
  - Allow optional migration after login.
- Backend concerns:
  - Enforce expiry.
  - Keep guest ownership separate from user ownership.
  - Prevent silent data mixing across sessions.
- Communication:
  - Tell frontend the expiry behavior, migration path, and failure states to handle.
