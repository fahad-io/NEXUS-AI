# AI Integration Spec

- Integration model:
  - Use a provider abstraction for multiple AI labs and models.
- Required data per model:
  - id
  - name
  - provider
  - capabilities
  - pricing
  - rating
  - token limits
- Chat features:
  - Model switching.
  - Capability-aware guidance for voice, file, image, and video tasks.
  - Usage tracking for the right sidebar.
- API expectations:
  - Stable request and response shapes.
  - Clear error states for unsupported capabilities or provider failures.
- Future-safe rule:
  - Adding a new model should not require UI rewrites.

