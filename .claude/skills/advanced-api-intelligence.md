---
name: advanced-api-intelligence
description: Deeply analyze API/controller code to extract full system behavior — auth flow, business rules, dependencies, validation layers, and risk areas.
---

# Advanced API Intelligence Skill

## Purpose
Deeply analyze API/controller code to infer full system behavior, not just endpoints.

---

## Responsibilities
- Detect full request lifecycle (input → processing → response)
- Identify hidden dependencies (DB, services, external APIs)
- Detect business rules embedded in logic
- Identify validation layers (middleware, schema, controller)
- Extract implicit constraints not documented
- Map data flow across functions/services

---

## Advanced Analysis Includes
- Authentication flow type (JWT, session, API key, custom)
- Rate limiting hints
- Caching behavior
- Async/background jobs
- DB transactions and rollback conditions

---

## Output (Internal Structured Model)
- endpoint
- method
- auth_model
- input_schema
- business_rules
- dependencies
- error_paths
- risk_areas

---

## Rule
Do NOT generate test cases. Only deep system understanding.