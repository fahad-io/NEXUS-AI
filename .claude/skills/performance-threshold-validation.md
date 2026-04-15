---
name: performance-threshold-validation
description: Validate API response times against defined thresholds — classify violations by severity, map to test cases, and generate actionable performance findings.
---

# Performance Threshold Validation Skill

## Purpose
After collecting response time measurements, this skill guides how to classify violations, assign severity, and produce structured findings for the bug reporter.

---

## Threshold Violation Classification

### Step 1: Determine Endpoint Priority
Pull `priority` from the test case in `testcases.json`:
- P0 → threshold 500ms
- P1 → threshold 500ms
- P2 → threshold 1000ms
- P3 → threshold 2000ms
- Hard blocker (any priority) → 3000ms

### Step 2: Calculate Violation Ratio
```
ratio = actual_response_ms / threshold_ms
```

### Step 3: Assign Severity

| Ratio | Severity | Action |
|---|---|---|
| ≤ 1.0 | Pass | None |
| 1.0 – 1.5 | Minor | Log, monitor |
| 1.5 – 2.0 | Major | Raise to engineering |
| > 2.0 | Critical | Block release if P0/P1 |
| any endpoint > 3000ms | Blocker | Must fix before release |

Special rule: auth endpoints (login, refresh, signup) at P0 exceeding 500ms are **always Critical** regardless of ratio, because auth latency directly impacts every user session.

---

## Reporting Format

Each violation entry should include:

```json
{
  "endpoint": "POST /api/models",
  "method": "POST",
  "priority": "P2",
  "threshold_ms": 1000,
  "actual_ms": 1720,
  "p95_ms": 1950,
  "ratio": 1.72,
  "severity": "Major",
  "violation": "Response time 1720ms exceeds P2 threshold 1000ms (×1.72)",
  "recommendation": "Check MongoDB query for models — likely missing index on provider or category field"
}
```

---

## Common Root Causes & Recommendations

| Symptom | Likely Cause | Recommendation |
|---|---|---|
| Auth endpoints slow | JWT signing overhead or bcrypt rounds too high | Reduce bcrypt cost factor in dev; check JWT secret length |
| Models endpoint slow | Full collection scan | Add index on `category`, `provider`, `isActive` fields |
| Chat send slow | AI provider call latency | Check MOCK_AI=true in dev; measure provider separately |
| Dashboard stats slow | Aggregation pipeline without index | Add compound index on userId + createdAt |
| Any endpoint p95 spikes | DB connection pool exhausted | Check Mongoose `maxPoolSize` setting |

---

## When to Fail vs Warn

**Fail (block pipeline):**
- Any P0/P1 endpoint > 2× threshold
- Any endpoint > 3000ms
- Auth endpoints > 1000ms

**Warn (log but continue):**
- P2/P3 endpoints between 1×–1.5× threshold
- Intermittent spikes (1 of 10 requests slow) without consistent pattern

---

## Integration with Bug Reporter
Performance violations classified as Blocker or Critical must be forwarded to the bug-reporter agent as bugs. Include:
- `bug_title`: "Performance: {endpoint} exceeds threshold by {ratio}×"
- `severity`: map from violation severity
- `steps_to_reproduce`: the curl or fetch command that reproduced the slow response
- `expected_result`: "Response in < {threshold}ms"
- `actual_result`: "Response in {actual}ms (p95: {p95}ms)"
