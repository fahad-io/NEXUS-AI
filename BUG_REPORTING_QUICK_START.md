# Bug Reporting Agent - Quick Start Guide

## What is it?

The Bug Reporting Agent is an automated QA tool that:
1. **Reads** executed test case Excel files
2. **Detects** all failed test cases (Status = Fail)
3. **Assigns** severity (Critical/Major/Minor) to each bug
4. **Generates** a comprehensive Bug Report Excel sheet

---

## Installation (2 minutes)

```bash
# Step 1: Install dependency
npm install xlsx

# Step 2: Verify installation
node -e "console.log(require('xlsx').version)"
```

---

## Basic Usage (1 minute)

### Generate Bug Report
```bash
node bug-reporting-agent.js \
  --test-cases-folder ./excel-test-cases/ \
  --output ./Bug_Report.xlsx
```

That's it! The agent will:
- Read all test case Excel files
- Detect failed test cases
- Assign severity automatically
- Generate `Bug_Report.xlsx` with all bugs
- Create `bug-report-summary.json` with statistics

---

## Update Bug Status

```bash
node bug-reporting-agent.js \
  --action update-status \
  --bug-id BR-001 \
  --new-status "In Progress" \
  --assigned-to "John Doe" \
  --notes "Investigating issue"
```

---

## Output Files

### 1. Bug_Report.xlsx
Contains two sheets:
- **Bug Report**: Detailed list of all bugs with IDs, descriptions, steps, severity, status
- **Summary**: Aggregated statistics by module, severity, and type

### 2. bug-report-summary.json
JSON summary with:
- Total test cases executed
- Pass/Fail/Blocked/Pending counts
- Bugs detected by severity (Critical/Major/Minor)
- Pass rate percentage

---

## Example Output

```
================================================================================
BUG REPORTING AGENT
================================================================================
Test Cases Folder: ./excel-test-cases/
Bug Report Output: ./Bug_Report.xlsx
================================================================================

[STEP 1] Reading executed test cases...
✓ Read 330 test cases from 8 files

[STEP 2] Detecting failed test cases...
✓ Detected 25 failed test cases

[STEP 3] Assigning bug severities...
✓ Assigned severities: Critical: 5, Major: 15, Minor: 5

[STEP 4] Generating bug report Excel...
✓ Bug report generated: ./Bug_Report.xlsx

================================================================================
BUG REPORTING SUMMARY
================================================================================
Test Execution Summary:
  Total Test Cases: 330
  Passed: 298 (90.30%)
  Failed: 25
  Blocked: 7
  Pending: 0

Bug Summary:
  Total Bugs: 25
  Critical: 5
  Major: 15
  Minor: 5

Bug Report: ./Bug_Report.xlsx
================================================================================
```

---

## Bug Report Excel Structure

### Sheet 1: Bug Report
| Bug ID | TestCase ID | Module | Description | Severity | Status | Priority |
|--------|-------------|---------|-------------|----------|--------|----------|
| BR-001 | TC-AUTH-FE-001 | Authentication | User unable to login | Critical | Open | P1 |
| BR-002 | TC-CHAT-FE-023 | Chat | Send button not working | Major | Open | P2 |
| BR-003 | TC-DASH-FE-051 | Dashboard | Chart data incorrect | Minor | Open | P3 |

### Sheet 2: Summary
| Category | Metric | Count |
|----------|--------|-------|
| Total Bugs | Total Count | 25 |
| Critical | Critical Bugs | 5 |
| Major | Major Bugs | 15 |
| Minor | Minor Bugs | 5 |

---

## Severity Classification

### Critical (P1) - System Breaking
- Authentication failures
- Security vulnerabilities
- Application crashes
- Data loss/corruption
- Payment failures

### Major (P2) - Functional Impact
- Validation errors
- Broken buttons/links
- API failures
- Missing/incorrect data
- Timeout issues

### Minor (P3) - Non-Critical
- Boundary test failures
- UI inconsistencies
- Spelling/grammar issues
- Minor performance issues

---

## Programmatic Usage

```javascript
const { generateBugReport, updateBugStatus } = require('./bug-reporting-agent');

// Generate bug report
const result = await generateBugReport(
  './excel-test-cases/',
  './Bug_Report.xlsx'
);

console.log(`Bugs detected: ${result.bugsCount}`);

// Update bug status
updateBugStatus(
  './Bug_Report.xlsx',
  'BR-001',
  'In Progress',
  'John Doe',
  'Investigating issue'
);
```

---

## Integration with Test Execution

```javascript
// In test-execution-agent.js
const { generateBugReport } = require('./bug-reporting-agent');

async function executeTests() {
  // ... execute tests ...

  // Auto-generate bug report
  const bugReport = await generateBugReport(
    './excel-test-cases/',
    './Bug_Report.xlsx'
  );

  return bugReport;
}
```

---

## Help

```bash
# Show all options
node bug-reporting-agent.js --help

# Generate bug report
node bug-reporting-agent.js -f ./excel-test-cases/ -o ./Bug_Report.xlsx

# Update bug status
node bug-reporting-agent.js --action update-status --bug-id BR-001 --new-status "In Progress"
```

---

## Requirements

1. **Test Execution Complete**
   - Test case Excel files must have Status column
   - Status must contain: Pass, Fail, Blocked, or Pending
   - Only "Fail" status becomes a bug

2. **Excel File Structure**
   - Files must be `.xlsx` format
   - Required columns: TestCase ID, Module Name, Type, Page/Component/API, Description, Steps, Expected Result, Actual Result, Status

3. **Node.js Version**
   - Node.js >= 14.0.0

---

## Troubleshooting

### Issue: "Folder not found"
**Solution**: Ensure `--test-cases-folder` path is correct

### Issue: "No bugs detected"
**Solution**: Check if any test cases have Status = Fail

### Issue: "Cannot update bug status"
**Solution**: Close Bug_Report.xlsx in Excel and retry

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Run test execution to populate Status column
3. ✅ Generate bug report
4. ✅ Review bugs with QA team
5. ✅ Assign bugs to developers
6. ✅ Update bug status as fixes are made

---

## Documentation

- **Agent Definition**: [.claude/agents/bug-reporting-agent.md](.claude/agents/bug-reporting-agent.md)
- **Structure Reference**: [BUG_REPORT_STRUCTURE.md](BUG_REPORT_STRUCTURE.md)
- **Complete Usage**: [BUG_REPORTING_AGENT_README.md](BUG_REPORTING_AGENT_README.md)
- **Implementation**: [bug-reporting-agent.js](bug-reporting-agent.js)

---

**Ready to catch bugs! 🐛**
