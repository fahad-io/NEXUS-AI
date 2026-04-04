# QA Test Case Generation Skill

## Goal
- Build QA coverage from the code that actually exists in the monorepo.

## Workflow
1. Inspect frontend routes and shared components.
2. Identify UI states:
   - default render
   - loading
   - empty
   - validation error
   - API failure
   - unauthorized redirect
3. Map each user action to backend requests through `frontend/src/lib/api.ts`.
4. Inspect backend DTOs and controllers to derive request validation and security expectations.
5. Produce separate frontend and backend test suites.
6. Export the suites to Excel using the repo generator.

## Frontend Focus Areas
- Navbar navigation and language selector
- Auth screens and guest entry
- Chat Hub:
  - 3-column layout
  - model selection
  - session switching
  - text, voice, file, image, and camera flows
  - guest banner and guest session lifecycle
- Marketplace:
  - search
  - chips
  - provider, pricing, rating, and license filters
  - model detail dialog tabs
- Discover feed
- Agents page templates and banner states
- Dashboard pages:
  - overview
  - history
  - settings
  - billing

## Backend Focus Areas
- Auth cookie + token lifecycle
- Global validation pipe behavior
- Public vs protected route access
- Chat guest/user session ownership
- File upload constraints
- Form validation constraints
- Dashboard aggregation behavior
- Models search/filter behavior

## Output Style
- Use concrete module/page names.
- Keep steps executable by a manual QA tester.
- Mention exact field labels, route paths, and endpoint paths where possible.
