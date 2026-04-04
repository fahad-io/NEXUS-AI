---
name: qa-rules
description: Strict QA rules and validation criteria for test case generation
type: feedback
---

# QA Test Case Generation Rules

## Coverage Requirements

**Rule 1**: Always test positive, negative, and edge cases for every module.
- **Why**: Incomplete testing misses critical bugs in error handling and boundary conditions.
- **How to apply**: For each form, endpoint, or flow, create at least:
  - 1 positive test (happy path)
  - 2+ negative tests (invalid inputs, failures)
  - 2+ edge case tests (boundary values, special scenarios)

**Rule 2**: Detect and test all forms with complete field validation.
- **Why**: Frontend forms often skip validation or have mismatched backend validation.
- **How to apply**: For every form, test:
  - Each required field with empty/missing value
  - Each field below minimum length
  - Each field above maximum length
  - Each field with invalid format (email, password)
  - Form submission with partial data

**Rule 3**: Identify and test stepper/multi-step forms separately.
- **Why**: Multi-step forms have unique state management and navigation issues.
- **How to apply**: For stepper forms, test:
  - Navigation between all steps (next/previous)
  - State preservation when going back
  - Validation at each step
  - Skipping required steps
  - Aborting mid-flow and returning later

**Rule 4**: Validate API request/response structure and status codes.
- **Why**: API contract mismatches cause integration failures.
- **How to apply**: For each endpoint, test:
  - Request body schema validation
  - Response body structure verification
  - Correct HTTP status codes (200, 201, 400, 401, 404, 500)
  - Response headers (authentication, content-type)
  - Error message format and clarity

**Rule 5**: Test authentication and authorization for all protected routes.
- **Why**: Security gaps in auth can expose sensitive data.
- **How to apply**: For every protected endpoint:
  - Test without authentication header
  - Test with expired/invalid token
  - Test with valid but insufficient permissions
  - Verify only owner can access their data
  - Test session token rotation

**Rule 6**: Include boundary value analysis for all numeric and length constraints.
- **Why**: Off-by-one errors are common at boundaries.
- **How to apply**: For every numeric/length constraint, test:
  - Value = minimum - 1 (should fail)
  - Value = minimum (should pass)
  - Value = maximum (should pass)
  - Value = maximum + 1 (should fail)
  - Value = 0 or null (where applicable)

**Rule 7**: Avoid duplicate test cases across modules.
- **Why**: Duplicate tests waste execution time and maintenance effort.
- **How to apply**: Before creating a test:
  - Check if scenario already exists
  - If similar, combine into one test with multiple data variations
  - Use data-driven testing approach instead of multiple similar tests

**Rule 8**: Follow proper naming conventions for test case IDs.
- **Why**: Clear naming improves test organization and reporting.
- **How to apply**: Use format: `TC-{CATEGORY}-{NUMBER}` where:
  - CATEGORY: UI, API, NEG (negative), EDGE (edge), BIZ (business)
  - NUMBER: Sequential 001, 002, 003...
  - Example: TC-API-001, TC-UI-001, TC-NEG-001

## Content Standards

**Rule 9**: Every test case must reference actual components, endpoints, or flows.
- **Why**: Generic tests don't validate real system behavior.
- **How to apply**: Use actual values from code:
  - Real page paths (/auth/login, not "login page")
  - Real API endpoints (POST /api/auth/login, not "login API")
  - Real field names (email, password, not "username")
  - Real validation messages from DTOs

**Rule 10**: Test steps must be numbered, specific, and actionable.
- **Why**: Vague steps lead to inconsistent test execution.
- **How to apply**: Each step should:
  - Start with action verb (Navigate, Click, Verify, Enter)
  - Specify exact values or selectors
  - Be independent (can be executed in sequence)
  - Include expected observations

**Rule 11**: Expected results must be specific and measurable.
- **Why**: Vague expectations make test verification impossible.
- **How to apply**: Each expected result should:
  - Describe exact observable outcome
  - Include specific values, text, or UI states
  - Be verifiable by a human or automated check
  - Use "Verify..." for assertions

**Rule 12**: Preconditions must be clear and complete.
- **Why**: Incomplete preconditions lead to test execution failures.
- **How to apply**: Each precondition should:
  - List all required state before test starts
  - Include data setup (test user, test data)
  - Specify authentication status (logged in/out)
  - Mention any configuration or environment settings

## Module-Specific Requirements

**Rule 13**: Authentication module tests must cover session lifecycle.
- **Why**: Session bugs cause security vulnerabilities and user frustration.
- **How to apply**: Test:
  - Login flow with valid/invalid credentials
  - Signup flow with validation
  - Token refresh rotation
  - Session expiration and logout
  - Guest session creation and lifecycle
  - Guest-to-authenticated migration

**Rule 14**: Chat module tests must cover message flow and persistence.
- **Why**: Chat is the core feature with complex state management.
- **How to apply**: Test:
  - Message sending with text, voice, and attachments
  - Session creation and retrieval
  - Chat history pagination
  - Real-time message display
  - Error handling when API fails
  - Local caching for offline scenarios

**Rule 15**: Upload module tests must validate file constraints.
- **Why**: File uploads are common security vulnerabilities.
- **How to apply**: Test:
  - Allowed file types and mime validation
  - Maximum file size (50MB limit)
  - File name generation (UUID)
  - Unauthorized file type rejection
  - Large file at exact limit
  - Empty file handling

**Rule 16**: Dashboard module tests must verify data accuracy.
- **Why**: Dashboard aggregates data from multiple sources.
- **How to apply**: Test:
  - Stats calculation accuracy
  - Chart data rendering
  - Filtering and sorting
  - Data refresh on navigation
  - Empty state display
  - Historical data trends

**Rule 17**: Marketplace module tests must validate filtering and search.
- **Why**: Marketplace has complex filtering logic.
- **How to apply**: Test:
  - Search by model name and description
  - Filter by type (language, vision, code, etc.)
  - Filter by provider/lab
  - Filter by rating threshold
  - Filter by pricing
  - Clear all filters
  - No results found state

## Quality Assurance

**Rule 18**: Review all generated test cases for completeness before export.
- **Why**: Missing test cases reduce coverage and confidence.
- **How to apply**: Before final export, verify:
  - All modules have tests (Auth, Chat, Dashboard, Marketplace, Upload, Forms)
  - All pages have UI tests
  - All API endpoints have tests
  - All forms have validation tests
  - All user flows have integration tests

**Rule 19**: Verify test cases are realistic and mirror actual usage.
- **Why**: Unrealistic tests don't catch real-world bugs.
- **How to apply**: Ask:
  - Would a real user perform this action?
  - Is this a common use case?
  - Are the inputs realistic?
  - Is the test scenario probable?

**Rule 20**: Ensure test case document is maintainable and updateable.
- **Why**: Tests need to evolve with the application.
- **How to apply**:
  - Use clear, descriptive test names
  - Avoid hardcoded test data that changes
  - Reference components and endpoints by name, not position
  - Document assumptions and dependencies
