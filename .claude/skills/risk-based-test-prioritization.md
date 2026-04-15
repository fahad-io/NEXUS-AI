---
name: risk-based-test-prioritization
description: Prioritize test cases by system risk — rank auth, data mutation, and security-sensitive endpoints as Critical/High/Medium/Low with business impact rationale.
---

# Risk-Based Test Prioritization Skill

## Purpose
Prioritize test cases based on system risk and failure impact.

---

## Responsibilities
- Identify high-risk API areas (payments, auth, data mutation)
- Rank test cases by severity impact
- Classify:
  - Critical
  - High
  - Medium
  - Low

---

## Risk Factors
- Security-sensitive endpoints
- Financial transactions
- Data deletion/update APIs
- External integrations
- Authentication bypass risks

---

## Output Format
Each test case must include:
- priority_level
- risk_reason
- business_impact