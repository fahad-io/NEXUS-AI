---
name: playwright-api-execution-mapping
description: Convert API test cases into executable Playwright-ready structures with request objects, assertion arrays, retry logic, and traceable test steps.
---

# Playwright API Execution Mapping Skill

## Purpose
Convert API test cases into executable Playwright-ready structures.

---

## Responsibilities
- Convert API requests into Playwright API calls
- Structure test steps for automation
- Add assertions for response validation
- Include retry logic for flaky APIs
- Prepare traceable test steps

---

## Output Format
For each test case:

- test_name
- playwright_steps[]
- request_object
- assertions[]
- expected_status
- cleanup_steps (if needed)

---

## Rules
- Must be automation-ready
- Must include assertions
- Must be deterministic