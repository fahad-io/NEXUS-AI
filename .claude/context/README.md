# QA Pipeline Context

Current pipeline artifacts for the QA testing pipeline. Each run overwrites these files so this folder always reflects the most recent execution.

## Files

### `testcases.json`
Produced by the `test-case-generator` agent (Stage 2). One object per test case, covering all apps and test types.

Required fields per object:
- `id` — unique test case ID (e.g. `TC-001`)
- `app` — `frontend`, `backend`, or `fullstack` (for integration cases)
- `suite` — `api`, `ui`, or `integration` (maps to Playwright test directory)
- `module` — feature or module under test (e.g. `auth`, `chat`, `marketplace`)
- `endpoint_or_route` — API endpoint (e.g. `POST /api/auth/login`) or UI route (e.g. `/chat`)
- `type` — one of: `positive`, `negative`, `api`, `ui`, `integration`, `performance`, `field-validation`
- `title` — short test case name
- `preconditions` — setup state required
- `steps` — array of numbered reproduction steps
- `test_data` — object of inputs used
- `expected_result` — expected outcome as string
- `priority` — `P0` / `P1` / `P2` / `P3`
- `author_agent` — which agent wrote it (e.g. `test-case-generator`)

**Type → Suite mapping (used by Playwright generator):**
| type | suite (directory) |
|---|---|
| `api`, `positive`, `negative`, `field-validation`, `performance` | `tests/api/` |
| `ui` | `tests/ui/` |
| `integration` | `tests/integration/` |

---

### `execution-results.json`
Produced by the `execution-runner` agent (Stage 4) after all three test suites have been run.

Required fields per object:
- `id` — matches `id` in `testcases.json`
- `title` — copied from testcases
- `type` — copied from testcases
- `suite` — `api`, `ui`, or `integration`
- `status` — `pass` / `fail` / `blocked` / `skipped`
- `response_time_ms` — for API/performance cases (number, ms); null for UI-only cases
- `actual_result` — what actually happened (string)
- `failure_reason` — populated only on `fail` / `blocked` (string or null)
- `trace_id` — Playwright trace reference on failure (string or null)
- `executed_at` — ISO 8601 timestamp
- `run_id` — pipeline run identifier (e.g. `RUN-20260414-001`)

---

### `performance-results.json`
Produced by the `performance-tester` agent (Stage 5).

Structure:
```json
{
  "run_id": "RUN-YYYYMMDD-NNN",
  "executed_at": "ISO timestamp",
  "base_url": "http://localhost:8080",
  "summary": { "total_endpoints_tested": 0, "passed": 0, "failed": 0, "blocked": 0 },
  "results": [
    {
      "id": "PERF-001",
      "test_case_id": "TC-045",
      "endpoint": "POST /api/auth/login",
      "method": "POST",
      "priority": "P0",
      "threshold_ms": 500,
      "response_time_ms": 143,
      "p95_ms": null,
      "concurrent_requests": 1,
      "status": "pass",
      "violation": null
    }
  ],
  "violations": []
}
```

Violation severity: `Blocker` (>3000ms or auth >500ms) / `Critical` (>2× threshold) / `Major` (1.5×–2×) / `Minor` (<1.5×).

---

### `bug-reports.json`
Produced by the `bug-reporter` agent (Stage 6).

Structure:
```json
{
  "run_id": "RUN-YYYYMMDD-NNN",
  "generated_at": "ISO timestamp",
  "total_failures": 0,
  "bugs": [
    {
      "id": "BUG-001",
      "title": "",
      "source": "functional | performance",
      "test_case_id": "TC-001",
      "severity": "blocker | critical | major | minor | trivial",
      "affected_route_or_component": "",
      "repro_steps": [],
      "expected_result": "",
      "actual_result": "",
      "failure_reason": "",
      "trace_id": null,
      "root_cause_group": ""
    }
  ],
  "triage_summary": { "by_severity": {}, "by_root_cause": {} }
}
```

---

## Rules
- Do not hand-edit these files — they are pipeline outputs.
- All four files are overwritten on each pipeline run.
- Field names must match exactly so downstream consumers (bug-reporter, dashboards) can parse them.
- Archive prior runs elsewhere if retention is needed.
- The `suite` field in `testcases.json` and `execution-results.json` determines which Playwright directory is used — it must be consistent between the two files.
