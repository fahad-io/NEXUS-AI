---
name: playwright-trace-generation
description: Generate structured trace logs for debugging failed tests — request/response flow, headers, payloads, failure point, timing, and step-by-step execution.
---

# Playwright Trace Generation Skill

## Purpose
Generate structured trace logs for debugging failed test cases.

---

## Responsibilities
- Capture request/response flow
- Log headers, payloads, response
- Capture failure point
- Include timing information
- Attach step-by-step execution flow

---

## Output Format
- trace_id
- api_call_sequence[]
- request_snapshot
- response_snapshot
- failure_step
- error_message
- debug_notes

---

## Rules
- Must be reproducible
- Must help developer debug without guessing