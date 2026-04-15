---
name: api-request-builder
description: Construct correct API requests in Playwright format — GET/POST/PUT/DELETE with proper headers, body, and query parameters.
---

# API Request Builder Skill

## Purpose
Correctly construct API requests in Playwright format.

---

## Responsibilities
- Build GET, POST, PUT, DELETE requests
- Attach headers (auth tokens if present)
- Attach request body correctly
- Handle query parameters

---

## Rules
- Use request.post/get/put/delete only
- Ensure correct endpoint formatting
- Ensure headers are properly structured