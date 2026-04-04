---
name: generate_testcases_edge_cases
description: Generates boundary and edge condition test cases
---

# Skill: Generate Edge Cases Test Cases

## Description
Creates edge case test scenarios:
- Boundary values (min, max, thresholds)
- Empty and null values
- Special characters and encoding
- Large data volumes
- Concurrent operations
- State transitions
- Time-based scenarios (session expiry)

## Input
- Validation constraints and limits
- Pagination and rate limiting
- Session management rules
- File upload limits

## Output
```typescript
{
  "testCases": [
    {
      "testCaseId": "TC-EDGE-001",
      "description": "Verify chat message handles exactly 10,000 characters (max length)",
      "preconditions": "User is authenticated with valid session",
      "testSteps": [
        "1. Create a message with exactly 10,000 characters",
        "2. Send POST request to /api/chat/send with the message",
        "3. Verify response status code is 200",
        "4. Verify message is stored and returned correctly"
      ],
      "expectedResult": "Message at max length is accepted and processed correctly",
      "actualResult": ""
    }
  ]
}
```

## Execution Logic
1. Test exact minimum values
2. Test exact maximum values
3. Test values just below minimum
4. Test values just above maximum
5. Test empty strings and null values
6. Test special characters (unicode, emojis, SQL injection attempts)
7. Test large file uploads (at limit)
8. Test pagination at boundaries (first page, last page, empty page)
9. Test session expiry scenarios
10. Test concurrent requests from same user
