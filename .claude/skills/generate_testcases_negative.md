---
name: generate_testcases_negative
description: Generates negative test cases for error scenarios
---

# Skill: Generate Negative Test Cases

## Description
Creates comprehensive negative test cases:
- Invalid input data
- Missing required fields
- Authentication failures
- Authorization violations
- Network error scenarios
- Duplicate and conflict scenarios

## Input
- All endpoints and forms discovered
- Validation rules and constraints
- Authentication/authorization patterns

## Output
```typescript
{
  "testCases": [
    {
      "testCaseId": "TC-NEG-001",
      "description": "Verify POST /api/auth/login rejects invalid credentials",
      "preconditions": "User account exists",
      "testSteps": [
        "1. Send POST request to /api/auth/login",
        "2. Include JSON body: { \"email\": \"test@example.com\", \"password\": \"wrongpassword\" }",
        "3. Verify response status code is 401",
        "4. Verify response body contains error message",
        "5. Verify no access_token or refresh_token is returned"
      ],
      "expectedResult": "Authentication fails with appropriate error message",
      "actualResult": ""
    }
  ]
}
```

## Execution Logic
1. For each validation rule, create invalid input test
2. Test missing required fields
3. Test with data exceeding maximum lengths
4. Test with data below minimum lengths
5. Test invalid formats (email, dates, etc.)
6. Test authentication failures
7. Test unauthorized access attempts
8. Test duplicate submissions
9. Test concurrent operations
10. Test network timeout scenarios
