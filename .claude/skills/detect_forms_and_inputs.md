---
name: detect_forms_and_inputs
description: Identifies all forms, input fields, and validation rules
---

# Skill: Detect Forms and Inputs

## Description
Scans frontend pages and backend DTOs to identify:
- All form components and their fields
- Input types (text, email, password, file, etc.)
- Validation rules (required, min/max length, format)
- Error messages and display
- Form submission handlers

## Input
- Project directory path

## Output
```json
{
  "forms": [
    {
      "page": "/auth/login",
      "formName": "LoginForm",
      "fields": [
        {
          "name": "email",
          "type": "email",
          "required": true,
          "validation": "Valid email format",
          "placeholder": "you@example.com"
        },
        {
          "name": "password",
          "type": "password",
          "required": true,
          "validation": "Min 6 characters",
          "placeholder": "••••••••"
        }
      ],
      "submitAction": "POST /api/auth/login",
      "successRedirect": "/dashboard"
    }
  ]
}
```

## Execution Logic
1. Scan frontend pages for <form> elements
2. Extract input fields with their attributes
3. Read backend DTO files for validation decorators
4. Map frontend inputs to backend validation
5. Identify error handling and display mechanisms
