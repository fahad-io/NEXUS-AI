# Release Command

- Goal:
  - Prepare the repo for a safe handoff or deployment.
- Run list:
  - Install deps if lockfiles changed.
  - Run frontend lint and build.
  - Run backend lint, test, and build.
  - Verify protected routes and guest-session behavior.
- Final checks:
  - No dead buttons.
  - No broken routes.
  - No placeholder API calls.
  - Light theme preserved.
  - QA and analyzer findings resolved or documented.

