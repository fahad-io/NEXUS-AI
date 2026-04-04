---
name: export_testcases_to_excel
description: Exports all generated test cases to structured Excel format
---

# Skill: Export Test Cases to Excel

## Description
Generates Excel file with all test cases in a structured, QA-ready format:
- Sheet name: "Test Cases"
- Columns: TestCase ID, TestCase Description, Preconditions, Test Steps, Expected Result, Actual Result
- Proper formatting for readability and filtering
- Color coding by test type (UI, API, Negative, Edge, Business)

## Input
- Array of all generated test cases
- Output file path

## Output
- Excel (.xlsx) file at specified path
- File contains single sheet with all test cases
- Headers frozen for scrolling
- Auto-filter enabled on all columns
- Column widths adjusted for readability

## Execution Logic
1. Create Excel workbook with single worksheet
2. Define headers: "TestCase ID", "TestCase Description", "Preconditions", "Test Steps", "Expected Result", "Actual Result"
3. Add all test case rows
4. Apply formatting:
   - Freeze first row
   - Enable auto-filter
   - Set column widths (15, 40, 30, 50, 30, 20)
   - Wrap text in description and steps columns
5. Save as .xlsx file

## Export Format

```
| TestCase ID | TestCase Description | Preconditions | Test Steps | Expected Result | Actual Result |
|-------------|---------------------|----------------|-------------|-----------------|---------------|
| TC-UI-001   | Verify login page... | User is not... | 1. Navigate... | All form... |               |
```

## File Naming Convention
- `NEXUS-AI-TestCases-[YYYY-MM-DD].xlsx`
- Example: `NEXUS-AI-TestCases-2026-04-04.xlsx`
