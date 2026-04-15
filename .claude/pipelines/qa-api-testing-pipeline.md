# QA Testing Pipeline Workflow

## Overview
Full-stack automated QA pipeline covering both backend API and frontend UI. Analyzes source code from both apps, generates comprehensive test cases, produces executable Playwright tests across three suites, runs execution and performance testing, and reports all bugs.

Produces five artifacts per run in `.claude/context/`:
- `testcases.json` — all generated test cases (API + UI + integration)
- `execution-results.json` — pass/fail per test case after Playwright execution
- `performance-results.json` — response time measurements and threshold violations
- `bug-reports.json` — structured bug reports from functional and performance failures

## Pipeline Flow

```
Backend Source (backend/src/)      Frontend Source (frontend/src/)
          ↓                                    ↓
────────────────────────────────────────────────────────────
Stage 1a: api-intelligence agent   Stage 1b: ui-intelligence agent
          (run in parallel)
────────────────────────────────────────────────────────────
          ↓                                    ↓
    Structured API Model          Structured UI Model
          ↓                                    ↓
────────────────────────────────────────────────────────────
              Unified Application Model (API + UI)
────────────────────────────────────────────────────────────
                          ↓
             Stage 2: test-case-generator agent
                          ↓
         .claude/context/testcases.json
          (positive, negative, api, ui, integration,
           performance, field-validation)
                          ↓
             Stage 3: playwright-generator agent
                          ↓
              tests/
               ├── api/          ← API-layer .spec.ts files
               ├── ui/           ← Browser UI .spec.ts files
               └── integration/  ← End-to-end flow .spec.ts files
                          ↓
             Stage 4: execution-runner agent
             (runs all three test suites)
                          ↓
         .claude/context/execution-results.json
                          ↓
             Stage 5: performance-tester agent
                          ↓
         .claude/context/performance-results.json
                          ↓
             Stage 6: bug-reporter agent
                          ↓
         .claude/context/bug-reports.json
```

---

## Agent Responsibilities

### Stages 1a + 1b: Intelligence (run in parallel)

**Stage 1a — api-intelligence** (`agents/api-intelligence-agent.md`)
- Read all controllers in `backend/src/`
- Extract: endpoint, method, auth_type, input_schema, validation_rules, business_logic, error_scenarios, dependencies, risk_level
- Risk levels: CRITICAL / HIGH / MEDIUM / LOW
- Output: structured JSON array — one object per endpoint

**Stage 1b — ui-intelligence** (`agents/ui-intelligence-agent.md`)
- Read all pages in `frontend/src/app/` and components in `frontend/src/components/`
- Extract: route, component_file, auth_requirement, user_flows, form_fields, api_calls, ui_elements, error_states, risk_level
- Also extracts interactive component inventory with interactions and props
- Output: structured JSON object — `{ routes: [...], components: [...] }`

**Unified Application Model**
- Merge both stage outputs before passing to Stage 2
- Cross-reference UI `api_calls` against API model endpoints
- Flag any UI routes that call undocumented or CRITICAL endpoints
- Document guest ↔ auth boundary: which routes require token, which allow `x-session-id`

---

### Stage 2: Test Case Generator (`agents/test-case-generator-agent.md`)
- Input: Unified Application Model (API model + UI model)
- Generate all seven test case types:
  - `positive` — valid inputs, expected happy-path responses
  - `negative` — invalid/missing inputs, auth failures, not-found
  - `api` — raw API contract verification
  - `ui` — page render, navigation, interactive element behavior
  - `integration` — end-to-end flows spanning both API and UI (e.g. signup → login → chat send)
  - `performance` — response time and load expectations
  - `field-validation` — individual field boundary and format tests
- Minimums: 3 test cases per endpoint/route; 5+ for CRITICAL items
- Write to `.claude/context/testcases.json`

---

### Stage 3: Playwright Generator (`agents/playwright-api-automation.md`)
- Input: `testcases.json`
- Convert by test type:
  - `api`, `positive`, `negative`, `field-validation`, `performance` → `tests/api/*.spec.ts` (request context, no browser)
  - `ui` → `tests/ui/*.spec.ts` (browser, use stable role/label selectors)
  - `integration` → `tests/integration/*.spec.ts` (browser + API, full flow)
- One `.spec.ts` file per module (e.g. `auth.spec.ts`, `chat.spec.ts`, `marketplace.spec.ts`)
- No `sleep` or arbitrary waits — use proper awaits and `networkidle`
- Use stable Playwright selectors: role, label, accessible name — no brittle CSS/XPath

---

### Stage 4: Execution Runner (`agents/execution-runner-agent.md`)
- Run all three suites in order:
  1. `npx playwright test tests/api/`
  2. `npx playwright test tests/ui/`
  3. `npx playwright test tests/integration/`
- Capture per test case: status, response_time_ms, actual_result, failure_reason, trace_id
- Keep Playwright traces on failure
- Write all results to `.claude/context/execution-results.json`

---

### Stage 5: Performance Tester (`agents/performance-testing-agent.md`)
- Sequential baseline: one request per API endpoint, measure response time
- Light load: 10 concurrent requests for CRITICAL/HIGH endpoints, measure p95
- Thresholds: P0/P1 ≤ 500ms | P2 ≤ 1000ms | P3 ≤ 2000ms | any > 3000ms = Blocker
- Write to `.claude/context/performance-results.json`
- Skills: `skills/performance-load-testing.md`, `skills/performance-threshold-validation.md`

---

### Stage 6: Bug Reporter (`agents/bug-reporting-agent.md`)
- Read both `execution-results.json` AND `performance-results.json`
- Generate bugs for: all functional failures + Blocker/Critical performance violations
- Include for each bug: repro steps, expected result, actual result, affected route/component, severity, trace_id
- Deduplicate, classify severity, group by root cause
- Write to `.claude/context/bug-reports.json`

---

## Output Artifacts (overwritten each run)
| File | Written By | Contents |
|---|---|---|
| `.claude/context/testcases.json` | Stage 2 | All test cases (all types) |
| `.claude/context/execution-results.json` | Stage 4 | Pass/fail per test case |
| `.claude/context/performance-results.json` | Stage 5 | Response times and violations |
| `.claude/context/bug-reports.json` | Stage 6 | Structured bug reports |
| `tests/api/*.spec.ts` | Stage 3 | API-layer Playwright tests |
| `tests/ui/*.spec.ts` | Stage 3 | Browser UI Playwright tests |
| `tests/integration/*.spec.ts` | Stage 3 | End-to-end Playwright tests |

---

## Quality Gates
- Stages 1a and 1b run in parallel; both must complete before Stage 2 begins
- Each subsequent stage must complete before the next starts; no stage may be skipped
- Stage 5 (performance) may produce all-blocked results if backend is offline — continue to Stage 6
- Stage 6 always runs regardless of prior results
