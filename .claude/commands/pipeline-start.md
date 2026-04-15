---
name: pipeline-start
description: Run the full 6-stage QA API testing pipeline — analyze backend code, generate test cases, create Playwright scripts, execute tests, run performance tests, and report bugs. All output written to .claude/context/.
---

# Pipeline Start

Run the full QA API testing pipeline end-to-end.

## Instructions

Use the Agent tool to invoke the `qa-orchestrator` agent with the following prompt:

> "Execute the full QA API testing pipeline for the NexusAI project.
>
> Backend source is in `backend/src/`. Pipeline definition is in `.claude/pipelines/qa-api-testing-pipeline.md`. Artifact schema is in `.claude/context/README.md`.
>
> Run all 6 stages in strict order:
> 1. Analyze all backend API routes via the `api-intelligence` agent
> 2. Generate test cases via the `test-case-generator` agent → write to `.claude/context/testcases.json`
> 3. Generate Playwright scripts via the `playwright-api-automation` agent → write to `tests/api/`
> 4. Execute tests and capture traces via the `execution-runner` agent → write to `.claude/context/execution-results.json`
> 5. Run performance tests via the `performance-tester` agent → write to `.claude/context/performance-results.json`
> 6. Generate bug reports via the `bug-reporter` agent (using both execution + performance results) → write to `.claude/context/bug-reports.json`
>
> Apply quality gates: each stage must succeed before proceeding. Report any pipeline halt with the stage name and reason."

## After Pipeline Completes

Report a summary:
- Endpoints analyzed: N
- Test cases generated: N (breakdown by type)
- Tests passed / failed / blocked / skipped
- Performance: N passed / N violations (by severity)
- Bugs reported: N (breakdown by severity)
- Output files:
  - `.claude/context/testcases.json`
  - `.claude/context/execution-results.json`
  - `.claude/context/performance-results.json`
  - `.claude/context/bug-reports.json`
