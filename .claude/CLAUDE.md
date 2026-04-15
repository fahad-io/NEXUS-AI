# Root Claude Guide

<<<<<<< HEAD
- Scope:
  - Shared coordination layer for the monorepo.
  - Owns shared rules, specs, workflows, commands, prompts, and cross-app agents.
- Read first:
  - `rules/global-rules.md`
  - `rules/communication-rules.md`
  - `rules/token-rules.md`
  - `specs/product-spec.md`
  - `workflows/workflow-main.md`
- Use this folder for:
  - Shared decisions across frontend and backend.
  - QA and analyzer reviews.
  - Release and coordination flow.
- Communication:
  - Frontend and backend handoffs must follow `rules/communication-rules.md`.
  - Root rules override app-specific guidance on conflicts.
- Main references:
  - `agents/qa-agent.md`
  - `agents/analyzer-agent.md`
  - `skills/coordination-skill.md`
  - `prompts/system-prompt.txt`
  - `prompts/lean-output-prompt.txt`
- Expected handoff fields:
  - source
  - target
  - scope
  - changed or planned files
  - blockers
  - requested next action
  - done definition
=======
## Scope
Shared coordination layer for the monorepo. Owns shared rules, specs, workflows, commands, prompts, agents, skills, and the QA pipeline.

---

## Read First
- `rules/global-rules.md`
- `rules/communication-rules.md`
- `rules/token-rules.md`
- `specs/product-spec.md`
- `workflows/workflow-main.md`

---

## Rules
| File | Purpose |
|---|---|
| `rules/global-rules.md` | Non-negotiable project-wide constraints |
| `rules/communication-rules.md` | Handoff format between frontend, backend, QA, analyzer |
| `rules/token-rules.md` | Output density and response efficiency |
| `rules/backend-rules.md` | Backend-specific architecture rules |
| `rules/ui-rules.md` | UI structure and theme rules |
| `rules/security-rules.md` | Auth, secrets, CORS, input validation |
| `rules/performance-rules.md` | Fetching, caching, bundle rules |
| `rules/qa-rules.md` | QA lifecycle, bug severity, Playwright standards |

Root rules override app-specific guidance on any conflict.

---

## Specs
| File | Purpose |
|---|---|
| `specs/product-spec.md` | Overall product definition |
| `specs/auth-spec.md` | Auth flows and token contracts |
| `specs/guest-session-spec.md` | Guest session lifecycle and migration |
| `specs/chat-spec.md` | Chat contracts and session model |
| `specs/marketplace-spec.md` | Marketplace filters and model card behavior |
| `specs/ai-integration-spec.md` | AI provider integration boundaries |
| `specs/routes-spec.md` | Route list and protection requirements |

---

## Workflows
| File | Purpose |
|---|---|
| `workflows/workflow-main.md` | Primary development coordination flow |
| `workflows/workflow-qa.md` | QA execution checklist and handoff |
| `workflows/workflow-analyzer.md` | UI analyzer review checklist |
| `workflows/workflow-release.md` | Pre-release verification and go/no-go |

---

## Agents

### QA Pipeline Agents (ordered)
| Agent Name | File | Role |
|---|---|---|
| `qa-orchestrator` | `agents/qa-orchestrator-agent.md` | Master controller — sequences all pipeline stages in strict order |
| `api-intelligence` | `agents/api-intelligence-agent.md` | Stage 1a (parallel) — analyzes backend routes, extracts structure, classifies risk |
| `ui-intelligence` | `agents/ui-intelligence-agent.md` | Stage 1b (parallel) — analyzes frontend pages/components, extracts flows, classifies risk |
| `test-case-generator` | `agents/test-case-generator-agent.md` | Stage 2 — generates all 7 test case types from unified model, writes `testcases.json` |
| `playwright-api-automation` | `agents/playwright-api-automation.md` | Stage 3 — converts test cases into Playwright scripts across tests/api/, tests/ui/, tests/integration/ |
| `execution-runner` | `agents/execution-runner-agent.md` | Stage 4 — runs all three test suites, captures traces, writes `execution-results.json` |
| `performance-tester` | `agents/performance-testing-agent.md` | Stage 5 — response time tests, load tests, threshold violations, writes `performance-results.json` |
| `bug-reporter` | `agents/bug-reporting-agent.md` | Stage 6 — generates and triages bug reports from functional + performance failures |

### Coordination / Review Agents
| Agent Name | File | Role |
|---|---|---|
| `qa-agent` | `agents/qa-agent-dev.md` | Manual QA — feature verification and bug lifecycle |
| `analyzer-agent` | `agents/analyzer-agent-dev.md` | UI analysis — parity checks against HTML reference |

---

## Skills

### Coordination
| File | Purpose |
|---|---|
| `skills/coordination-skill-dev.md` | Cross-scope handoff coordination |
| `skills/qa-orchestration-master.md` | Master QA orchestration sequences |

### Test Case Generation
| File | Purpose |
|---|---|
| `skills/positive-test-case.md` | Positive (happy path) test case generation |
| `skills/negative-test-case.md` | Negative / invalid input test case generation |
| `skills/edge-case.md` | Boundary and edge case generation |
| `skills/test-structure-organization.md` | Test suite structure and naming |
| `skills/risk-based-test-prioritization.md` | Prioritize tests by risk and impact |

### API Analysis & Validation
| File | Purpose |
|---|---|
| `skills/api-analysis.md` | Route and contract analysis |
| `skills/advanced-api-intelligence.md` | Deep API pattern and risk analysis |
| `skills/api-request-builder.md` | Build valid API request payloads |
| `skills/response-validation.md` | Validate API response shapes |
| `skills/response-validation-mapping.md` | Map expected vs actual response fields |
| `skills/assertion-engine.md` | Assertion strategy and failure messaging |

### Security & Authentication
| File | Purpose |
|---|---|
| `skills/authentication-security.md` | Auth flow testing and token validation |
| `skills/security-validation.md` | Input sanitization and injection checks |
| `skills/security-penetration-api.md` | API penetration test patterns |

### Error Handling & Stability
| File | Purpose |
|---|---|
| `skills/error-handling.md` | Error case identification and response |
| `skills/self-healing-test-engine.md` | Retry and recovery for flaky tests |
| `skills/smart-bug-detection-classification.md` | Bug detection patterns and classification |

### Performance Testing
| File | Purpose |
|---|---|
| `skills/performance-load-testing.md` | Load testing patterns — concurrent requests, throughput, baseline measurement |
| `skills/performance-threshold-validation.md` | Threshold violation classification, severity assignment, root cause hints |

### Playwright Automation
| File | Purpose |
|---|---|
| `skills/playwright-master-orchestrator.md` | Top-level Playwright orchestration |
| `skills/playwright-code-generation.md` | Playwright script generation from test cases |
| `skills/playwright-api-execution-mapping.md` | Map API test cases to Playwright calls |
| `skills/playwright-trace-generation.md` | Trace capture and attachment |
| `skills/playwright-execution-stability.md` | Await strategies, no-sleep rules |

### Developer Skills
| File | Purpose |
|---|---|
| `skills/qa-skill-dev.md` | QA developer skill set |
| `skills/analyzer-skill-dev.md` | Analyzer developer skill set |

---

## Commands
| File | Slash Command | Purpose |
|---|---|---|
| `commands/pipeline-start.md` | `/pipeline-start` | Run full 6-stage QA pipeline (API + UI + integration) end-to-end |
| `commands/plan.md` | `/plan` | Inspect repo state before making changes |
| `commands/implement.md` | `/implement` | Execute scoped code changes |
| `commands/fix.md` | `/fix` | Fix a verified bug |
| `commands/test.md` | `/test` | Run lint, tests, and builds |
| `commands/release.md` | `/release` | Prepare repo for deployment |

---

## Prompts
| File | Purpose |
|---|---|
| `prompts/system-prompt.txt` | Base system context |
| `prompts/lean-output-prompt.txt` | Token-efficient response guidance |
| `prompts/qa-checklist.txt` | QA review checklist prompt |
| `prompts/analyzer-checklist.txt` | Analyzer review checklist prompt |

---

## Pipeline

### QA Testing Pipeline (Full-Stack)
**Entry:** `/pipeline-start` slash command → invokes `qa-orchestrator` agent

```
Backend Source (backend/src/)      Frontend Source (frontend/src/)
          ↓                                    ↓
[Stage 1a: api-intelligence]       [Stage 1b: ui-intelligence]
          (run in parallel — both must complete before Stage 2)
          ↓                                    ↓
    API Model                           UI Model
          ↓                                    ↓
          ──── Unified Application Model ────
                          ↓
          [Stage 2: test-case-generator]   → .claude/context/testcases.json
                          ↓
          [Stage 3: playwright-generator]  → tests/api/ + tests/ui/ + tests/integration/
                          ↓
          [Stage 4: execution-runner]      → .claude/context/execution-results.json
                          ↓
          [Stage 5: performance-tester]    → .claude/context/performance-results.json
                          ↓
          [Stage 6: bug-reporter]          → .claude/context/bug-reports.json
```

**Test case types → Playwright suite:**
| types | directory |
|---|---|
| `api`, `positive`, `negative`, `field-validation`, `performance` | `tests/api/` |
| `ui` | `tests/ui/` |
| `integration` | `tests/integration/` |

**Artifacts (overwritten each run):**
- `.claude/context/testcases.json` — schema defined in `context/README.md`
- `.claude/context/execution-results.json` — pass/fail per test case (all suites)
- `.claude/context/performance-results.json` — response times and threshold violations
- `.claude/context/bug-reports.json` — structured bug reports (functional + performance)

**Quality gates:** Stages 1a + 1b run in parallel; every subsequent stage must complete before the next starts; no stage may be skipped.

---

## Communication
All handoffs must follow `rules/communication-rules.md`. Required fields:
- source
- target
- scope
- changed or planned files
- blockers
- requested next action
- done definition

---

## Pipeline Command
`/pipeline-start` — Full automated pipeline: parallel API + UI analysis → unified model → test generation (7 types) → Playwright (api/ + ui/ + integration/) → execution → performance → bug report
>>>>>>> rajanouman
