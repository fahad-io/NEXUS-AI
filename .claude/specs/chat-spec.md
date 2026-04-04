# Chat Spec

- Layout:
  - 3-column desktop layout.
  - Left sidebar lists 400+ models with search and selection state.
  - Center area contains chat messages, composer, suggested prompts, and prompt guide panel.
  - Right sidebar shows model stats, usage, chart, and quick actions.
- Chat composer:
  - Show active model near the chat box.
  - Support text input plus voice and file entry points.
  - Keep video-related guidance accessible from the chat experience.
- Behavior:
  - Suggested prompts help first-time users start quickly.
  - Prompt guide panel explains how to use the selected model well.
  - Switching models updates visible context without losing the current flow unexpectedly.
- Data:
  - Guest sessions persist locally for the allowed window.
  - Authenticated sessions sync to backend storage.

