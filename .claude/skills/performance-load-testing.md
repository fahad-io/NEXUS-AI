---
name: performance-load-testing
description: Patterns and strategies for load testing API endpoints — concurrent request simulation, throughput measurement, and stress boundary detection in a development environment.
---

# Performance Load Testing Skill

## Purpose
Guide performance test execution for API endpoints. Covers concurrent request patterns, throughput measurement, and identifying stress boundaries without hammering production systems.

---

## Load Testing Patterns

### Sequential Baseline
Send one request per endpoint, record response time. This is the minimum performance signal — establishes a baseline before any concurrency.

```bash
# Bash: time a single request
START=$(date +%s%N)
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/models
END=$(date +%s%N)
echo "Response time: $(( (END - START) / 1000000 ))ms"
```

### Light Concurrent Load (10 workers)
Simulate 10 simultaneous users. Safe for development environments.

```bash
# Run 10 concurrent curl requests, collect times
for i in {1..10}; do
  curl -s -o /dev/null -w "%{time_total}\n" http://localhost:8080/api/models &
done
wait
```

### Node.js Concurrent Fetch Pattern
```js
const requests = Array.from({ length: 10 }, () =>
  fetch('http://localhost:8080/api/models').then(r => ({
    status: r.status,
    ms: performance.now()
  }))
);
const results = await Promise.all(requests);
```

---

## Threshold Definitions

| Priority | Endpoint Type | Max Response Time | p95 Target |
|---|---|---|---|
| P0 | Auth, critical writes | 500ms | 400ms |
| P1 | High-risk reads/writes | 500ms | 800ms |
| P2 | Standard API calls | 1000ms | 1500ms |
| P3 | Low-priority, static data | 2000ms | 2500ms |
| Any | Hard blocker | 3000ms | — |

---

## Statistics to Collect

For any endpoint under load:
- **min** — fastest response in the batch
- **max** — slowest response
- **avg** — arithmetic mean
- **p95** — 95th percentile (sort times, take 95th value)

p95 matters more than avg — it represents the experience of the slowest 1 in 20 users.

---

## What NOT to Do
- Do not run more than 10 concurrent requests in development
- Do not run load tests against auth endpoints with real credentials at volume
- Do not use `sleep` between requests to simulate pacing — measure actual response times
- Do not mark a test as "passing" if the backend returned an error (even if fast)

---

## Red Flags
- Any endpoint consistently at 80%+ of its threshold is a warning — flag for monitoring
- Response time variance > 500ms across sequential requests = instability, not just slowness
- p95 > 2× average = outlier spikes — likely GC pause or DB connection contention
