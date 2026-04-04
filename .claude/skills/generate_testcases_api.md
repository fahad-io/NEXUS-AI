---
name: generate_testcases_api
description: Generates comprehensive API endpoint test cases
---

# Skill: Generate API Test Cases

## Description
Creates detailed API test cases for all endpoints:
- Request validation and schema
- Response format and status codes
- Authentication and authorization
- Error handling and messages
- Edge cases and boundary values

## Input
- List of API controllers and endpoints
- DTO definitions and validation rules
- Authentication/authorization patterns

## Output
```typescript
{
  "testCases": [
    {
      "testCaseId": "TC-API-001",
      "description": "Verify POST /api/auth/login with valid credentials",
      "preconditions": "User account exists with email: test@example.com, password: password123",
      "testSteps": [
        "1. Send POST request to /api/auth/login",
        "2. Include JSON body: { \"email\": \"test@example.com\", \"password\": \"password123\" }",
        "3. Verify response status code is 200",
        "4. Verify response body contains access_token",
        "5. Verify response body contains user object with id, name, email",
        "6. Verify refresh_token cookie is set in response",
        "7. Verify cookie has httpOnly flag set to true"
      ],
      "expectedResult": "User is successfully authenticated with valid JWT tokens",
      "actualResult": ""
    }
  ]
}
```

## Execution Logic
1. For each endpoint, analyze request DTO validation
2. Create positive test cases with valid data
3. Generate validation test cases for each field constraint
4. Test authentication requirements (public vs protected)
5. Test authorization (access control)
6. Verify error responses with invalid data
7. Test boundary values and edge cases
