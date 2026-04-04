# Release Workflow

- Pre-release:
  - Confirm shared specs are still current.
  - Review QA and analyzer results.
- Verification:
  - Install dependencies cleanly.
  - Run lint, tests, and builds.
  - Verify environment variables and secrets handling.
- Checklist:
  - Frontend build passes.
  - Backend build passes.
  - Critical routes work.
  - Auth and guest flows work.
  - No placeholder API calls remain.
  - Light theme is preserved.
  - Release notes include known gaps.
- Decision:
  - Release only if critical and high issues are cleared.

