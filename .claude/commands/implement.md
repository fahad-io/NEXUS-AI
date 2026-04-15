<<<<<<< HEAD
=======
---
name: implement
description: Execute scoped code changes with minimal churn — install deps, run dev servers, output only required code and a short verification summary.
---

>>>>>>> rajanouman
# Implement Command

- Goal:
  - Make scoped code changes with minimal churn.
- Before coding:
  - Re-check package scripts if commands are needed.
  - Prefer patch-based edits.
- How to run:
  - Install deps:
    - `cd frontend && npm install`
    - `cd backend && npm install`
  - Run frontend:
    - Use `npm run dev` in `frontend` if present.
  - Run backend:
    - Use `npm run start:dev` in `backend` if present.
    - Fallback to `npm run start` if no dev script exists.
- Output:
  - Only the required code and a short verification summary.

