# AI Integration Skill

- Goal:
  - Provide stable backend contracts for model metadata and chat.
- Must expose:
  - model catalog data
  - capability flags
  - pricing and token limits
  - chat request and response contracts
  - usage stats for the right panel
- Design rules:
  - Keep providers behind an abstraction layer.
  - Return stable JSON shapes.
  - Avoid placeholder provider responses.
- Communication:
  - Tell frontend which model fields are guaranteed and which capability limits must be surfaced in UI.
