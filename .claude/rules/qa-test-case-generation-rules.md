# QA Test Case Generation Rules

## Required
- Use repo-specific terminology and paths.
- Reflect actual validation rules from DTOs and forms.
- Reflect actual protected-route behavior from auth hooks and backend guards.
- Keep frontend and backend cases separate.
- Leave `Actual Result` blank.

## Do Not
- Do not invent screens, APIs, payments, or stepper forms that are not implemented.
- Do not claim custom React error boundaries exist when they do not.
- Do not create generic “verify page loads” cases without naming concrete UI elements.
- Do not merge multiple unrelated verifications into one oversized test unless they are one user flow.

## Coverage Expectations
- Every user-facing route in `frontend/src/app`
- Every backend controller endpoint in `backend/src`
- Positive, negative, and edge scenarios for auth, chat, upload, and filters
- FE to BE integration points triggered by UI actions
