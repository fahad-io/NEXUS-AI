---
name: playwright-execution-stability
description: Ensure generated Playwright tests are stable and non-flaky — proper async handling, no race conditions, no hardcoded delays, isolated independent tests.
---

# Playwright Execution Stability Skill

## Purpose
Ensure generated tests are stable, deterministic, and non-flaky.

---

## Responsibilities
- Avoid race conditions
- Ensure proper async handling
- Ensure response waits are correct
- Avoid dependency between tests

---

## Stability Rules
- Always await API responses
- Do not use hardcoded delays
- Ensure isolated tests