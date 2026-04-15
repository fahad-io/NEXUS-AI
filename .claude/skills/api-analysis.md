---
name: api-analysis
description: Analyze backend API routes or controllers to extract endpoints, request structure, auth requirements, validation rules, and error patterns before test generation.
---

# API Analysis Skill

## Purpose
You analyze backend API routes or controllers to extract key behavior before test case generation.

---

## Responsibilities
- Identify endpoint (method + route)
- Extract request structure (params, body, headers)
- Detect authentication requirements
- Identify validation rules
- Detect error handling patterns
- Identify business logic rules

---

## Output (Internal Use Only)
Return structured understanding like:

- Endpoint
- Method
- Required fields
- Optional fields
- Auth type
- Possible error scenarios

---

## Rules
- Do NOT generate test cases here
- Only analyze and structure API behavior
- Be precise and code-driven