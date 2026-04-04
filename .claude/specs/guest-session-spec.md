# Guest Session Spec

- Storage:
  - Store guest chat state in session storage or local storage.
- Expiry:
  - Expire guest session data after 3 hours.
- Scope:
  - Persist selected model, recent prompts, and message history for guest mode.
- Migration:
  - Offer optional migration of guest chat to a new or existing user account after login.
- Cleanup:
  - Remove expired guest data automatically.
  - Avoid mixing guest data across browsers or users.

