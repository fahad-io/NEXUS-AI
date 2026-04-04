# QA Workflow

- Preparation:
  - Confirm target branch and changed areas.
  - Load shared specs and route list.
- Execution:
  - Test public routes first.
  - Test auth routes next.
  - Test guest-session behavior.
  - Test chat and marketplace interactions.
- Checklist:
  - Navbar links work.
  - Language selector works.
  - Sign in and sign up work.
  - Protected routes redirect guests.
  - Chat model switch updates visible state.
  - Voice, file, and video entry points render.
  - Marketplace filters affect results.
  - "Use in Chat Hub" CTA opens chat with selected model.
  - Session expiry handling works.
- Output:
  - Findings first.
  - Include repro steps.
  - Mark blocked checks clearly.

