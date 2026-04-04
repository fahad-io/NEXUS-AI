---
name: generate_testcases_ui
description: Generates comprehensive UI test cases for all components and pages
---

# Skill: Generate UI Test Cases

## Description
Creates detailed UI test cases covering:
- Component rendering and display
- User interactions (clicks, input, navigation)
- Responsive design and layout
- Form validation feedback
- Loading and error states
- Accessibility features

## Input
- List of pages and components
- Form and input definitions
- User flow mappings

## Output
```typescript
{
  "testCases": [
    {
      "testCaseId": "TC-UI-001",
      "description": "Verify login page renders with all required elements",
      "preconditions": "User is not authenticated. Application is loaded.",
      "testSteps": [
        "1. Navigate to /auth/login",
        "2. Verify NexusAI logo is displayed",
        "3. Verify 'Welcome back' heading is visible",
        "4. Verify email input field is present with placeholder 'you@example.com'",
        "5. Verify password input field is present with type 'password'",
        "6. Verify 'Sign In' button is enabled when inputs are filled",
        "7. Verify 'Continue as Guest' button is displayed",
        "8. Verify 'Sign up' link navigates to /auth/signup"
      ],
      "expectedResult": "All form elements are correctly rendered and visible",
      "actualResult": ""
    }
  ]
}
```

## Execution Logic
1. For each page, identify all components
2. Create test cases for rendering and visibility
3. Generate interaction tests for each button, link, input
4. Add validation feedback test cases
5. Include responsive design tests (mobile, tablet, desktop)
6. Test loading states and error displays
