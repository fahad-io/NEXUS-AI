---
name: error-handling
description: Ensure Playwright tests properly validate API failures — status codes 400/401/403/404/500, error messages, and consistent error structure.
---

# Error Handling Skill

## Purpose
Ensure Playwright tests properly validate API failures.

---

## Responsibilities
- Validate error status codes (400, 401, 403, 404, 500)
- Validate error messages in response body
- Ensure API returns meaningful errors

---

## Rules
- Negative cases must be validated strictly
- Do not ignore failed responses
- Always assert error structure consistency