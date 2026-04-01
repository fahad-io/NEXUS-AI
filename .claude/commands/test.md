# Test Command

- Goal:
  - Validate changes with the smallest useful command set.
- How to run:
  - Lint frontend:
    - `cd frontend && npm run lint`
  - Lint backend:
    - `cd backend && npm run lint`
  - Test backend:
    - `cd backend && npm run test`
    - Optional: `npm run test:e2e`
  - Test frontend:
    - Check `frontend/package.json` first.
    - If no test script exists, state that explicitly.
  - Build frontend:
    - `cd frontend && npm run build`
  - Build backend:
    - `cd backend && npm run build`
- Output:
  - Report pass, fail, or not available for each command.

