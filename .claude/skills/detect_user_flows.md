---
name: detect_user_flows
description: Maps end-to-end user journeys and workflows through the application
---

# Skill: Detect User Flows

## Description
Analyzes application code to identify complete user journeys:
- Registration and onboarding flows
- Login and authentication flows
- Chat interaction flows (guest and authenticated)
- Model selection and marketplace browsing
- Dashboard navigation and analytics viewing
- Settings and profile management

## Input
- Project directory path
- List of discovered pages and endpoints

## Output
```json
{
  "userFlows": [
    {
      "name": "User Registration",
      "entryPoint": "/auth/signup",
      "steps": [
        "Navigate to signup page",
        "Enter full name (2-100 chars)",
        "Enter email (valid email format)",
        "Enter password (min 6 chars)",
        "Submit form",
        "Redirect to /dashboard"
      ],
      "successCriteria": "User is authenticated and redirected to dashboard",
      "errorScenarios": ["Invalid email format", "Password too short", "Email already exists"]
    }
  ]
}
```

## Execution Logic
1. Trace navigation links between pages
2. Identify form submissions and redirects
3. Map API calls triggered by user actions
4. Identify conditional flows (auth vs guest)
5. Document success and failure paths
