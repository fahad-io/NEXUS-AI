---
name: detect_stepper_forms
description: Identifies multi-step forms and wizard flows
---

# Skill: Detect Stepper Forms

## Description
Finds and analyzes multi-step forms and wizard workflows:
- Forms with step indicators or progress bars
- Sequential form sections
- Navigation between steps (next/previous)
- State preservation between steps
- Final submission handling

## Input
- Project directory path
- List of forms discovered

## Output
```json
{
  "stepperForms": [
    {
      "name": "Agent Creation Wizard",
      "steps": [
        {
          "stepNumber": 1,
          "name": "Basic Info",
          "fields": ["agentName", "description"],
          "navigation": "Next →"
        },
        {
          "stepNumber": 2,
          "name": "Configuration",
          "fields": ["modelId", "systemPrompt"],
          "navigation": "Next → / Back ←"
        },
        {
          "stepNumber": 3,
          "name": "Review",
          "fields": [],
          "navigation": "Create Agent"
        }
      ],
      "totalSteps": 3,
      "submissionEndpoint": "POST /api/agents"
    }
  ]
}
```

## Execution Logic
1. Search for step indicators, progress bars, tab wizards
2. Identify form sections separated by navigation
3. Map state management between steps
4. Document step validation and requirements
5. Identify final submission and success handling
