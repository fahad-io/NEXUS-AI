---
name: assertion-engine
description: Generate strong Playwright validation logic — status codes, response schema, required fields, data types, and error message assertions.
---

# Assertion Engine Skill

## Purpose
Generate strong validation logic for API responses.

---

## Responsibilities
- Validate HTTP status codes
- Validate response schema structure
- Validate key business fields
- Validate error messages for negative cases

---

## Assertion Rules
- Always use expect()
- Validate response.json()
- Ensure critical fields exist
- Ensure data types are correct (string, number, boolean)

---

## Examples of Assertions
- expect(response.status()).toBe(200)
- expect(body).toHaveProperty("token")
- expect(body.user.id).toBeDefined()