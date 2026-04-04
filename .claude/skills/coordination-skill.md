# Coordination Skill

- Goal:
  - Coordinate FE, BE, QA, and analyzer work without scope drift.
- Use when:
  - A task spans more than one app area.
  - Route, API, and UI changes must stay aligned.
- Steps:
  - Read shared rules first.
  - Check shared specs before planning implementation.
  - Split work into frontend, backend, QA, and analyzer tracks.
  - Use the shared communication contract for every handoff.
  - Resolve blockers before expanding scope.
- Guardrails:
  - Do not create new repos.
  - Do not rename `frontend/` or `backend/`.
  - Keep changes patch-based and reviewable.
  - Keep blockers and done definitions explicit for the next scope.
