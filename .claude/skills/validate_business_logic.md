---
name: validate_business_logic
description: Validates business rules and workflow logic
---

# Skill: Validate Business Logic

## Description
Creates test cases to verify business rules:
- Session management (guest vs authenticated)
- Chat history persistence
- Model usage tracking
- Guest session migration to authenticated
- Rate limiting and quotas
- Data consistency across flows

## Input
- User flow mappings
- Service layer logic
- Business requirements
- State management patterns

## Output
```typescript
{
  "testCases": [
    {
      "testCaseId": "TC-BIZ-001",
      "description": "Verify guest session data migrates to authenticated user on login",
      "preconditions": "User has active guest session with chat history",
      "testSteps": [
        "1. Start as guest and create 3 chat messages",
        "2. Verify guest session ID and messages are stored locally",
        "3. Navigate to /auth/login",
        "4. Login with existing account credentials",
        "5. After login, navigate to /chat",
        "6. Verify previous guest chat messages are accessible",
        "7. Verify messages are now associated with authenticated user"
      ],
      "expectedResult": "Guest session history is preserved and migrated to authenticated user",
      "actualResult": ""
    }
  ]
}
```

## Execution Logic
1. Identify key business rules from services
2. Create tests for session state transitions
3. Verify data persistence across authentication
4. Test quota and limit enforcement
5. Validate concurrent operation handling
6. Test data consistency across modules
7. Verify audit trail and logging
