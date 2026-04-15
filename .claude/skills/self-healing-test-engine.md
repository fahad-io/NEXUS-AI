---
name: self-healing-test-engine
description: Automatically detect and fix broken Playwright tests — update stale selectors, adjust changed endpoints/payloads, fix assertions, and re-run corrected tests.
---

# Self-Healing Test Engine

## Purpose
Automatically fix broken Playwright tests.

---

## Responsibilities
- Detect broken selectors or API changes
- Suggest updated endpoints or payloads
- Auto-adjust assertions if schema changed
- Re-run corrected tests

---

## Rules
- Never silently ignore failures
- Always log modifications
- Keep original + fixed version