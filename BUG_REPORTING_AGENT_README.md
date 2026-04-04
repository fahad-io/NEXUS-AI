# Bug Reporting Agent - Complete Usage Guide

## Overview

The Bug Reporting Agent is a Senior QA Automation Agent that reads executed test case Excel files, detects failed test cases, and generates comprehensive Bug Report Excel sheets for tracking and resolution.

---

## Quick Start

### Installation

```bash
# Install dependencies
npm install xlsx

# Verify installation
node -e "console.log(require('xlsx').version)"
```

### Basic Usage

```bash
# Generate bug report from test execution results
node bug-reporting-agent.js \
  --test-cases-folder ./excel-test-cases/ \
  --output ./Bug_Report.xlsx
```

### Update Bug Status

```bash
# Update bug status to In Progress
node bug-reporting-agent.js \
  --action update-status \
  --bug-id BR-001 \
  --new-status "In Progress" \
  --assigned-to "John Doe" \
  --notes "Investigating authentication issue"
```

---

## Prerequisites

1. **Test Execution Complete**
   - All test cases must be executed by TestCase Execution Agent
   - Test case Excel files must have Status column populated (Pass/Fail/Blocked)
   - Test cases with Status = Fail will be detected as bugs

2. **Excel Files Structure**
   - Files must be in `.xlsx` format
   - Files must contain columns: TestCase ID, Module Name, Type, Page/Component/API, Description, Steps, Expected Result, Actual Result, Status
   - Status column must contain: Pass, Fail, Blocked, or Pending

3. **File Naming Convention**
   - Use format: `{MODULE}_TestCases.xlsx`
   - Example: `AUTHENTICATION_TestCases.xlsx`, `CHAT_TestCases.xlsx`

---

## Detailed Usage

### 1. Generate Bug Report

#### Command
```bash
node bug-reporting-agent.js --test-cases-folder <path> --output <path>
```

#### Parameters

| Parameter | Short | Required | Default | Description |
|-----------|-------|----------|----------|-------------|
| `--test-cases-folder` | `-f` | Yes | N/A | Folder containing test case Excel files |
| `--output` | `-o` | No | `./Bug_Report.xlsx` | Path where bug report Excel will be saved |

#### Example
```bash
node bug-reporting-agent.js \
  --test-cases-folder ./excel-test-cases/ \
  --output ./reports/Bug_Report_2026-04-04.xlsx
```

#### Output
The agent generates:
- **Bug_Report.xlsx** - Main bug report with two sheets (Bug Report, Summary)
- **bug-report-summary.json** - JSON summary with statistics

#### Execution Log
```
================================================================================
BUG REPORTING AGENT
================================================================================
Test Cases Folder: ./excel-test-cases/
Bug Report Output: ./Bug_Report.xlsx
================================================================================

[STEP 1] Reading executed test cases...
[BugReportingAgent] Reading test cases from: ./excel-test-cases/
[BugReportingAgent] Found 8 Excel files
[BugReportingAgent] AUTHENTICATION_TestCases.xlsx: 64 test cases
[BugReportingAgent] CHAT_TestCases.xlsx: 48 test cases
[BugReportingAgent] MARKETPLACE_TestCases.xlsx: 72 test cases
[BugReportingAgent] DASHBOARD_TestCases.xlsx: 36 test cases
[BugReportingAgent] UPLOAD_TestCases.xlsx: 24 test cases
[BugReportingAgent] FORMS_TestCases.xlsx: 32 test cases
[BugReportingAgent] INTEGRATION_TestCases.xlsx: 40 test cases
[BugReportingAgent] NEGATIVE_TestCase.xlsx: 14 test cases
[BugReportingAgent] Total test cases across all files: 330
✓ Read 330 test cases from 8 files

[STEP 2] Detecting failed test cases...
[BugReportingAgent] Detecting failed test cases...
[BugReportingAgent] Detected 25 failed test cases
[BugReportingAgent] Summary - Total: 330, Passed: 298, Failed: 25, Blocked: 7, Pending: 0
✓ Detected 25 failed test cases

[STEP 3] Assigning bug severities...
[BugReportingAgent] Assigning bug severities...
[BugReportingAgent] TC-AUTH-FE-001: Critical - Authentication-related failure
[BugReportingAgent] TC-AUTH-FE-005: Critical - System-breaking issue detected: 401
[BugReportingAgent] TC-CHAT-FE-023: Major - Functional impact detected: button not working
[BugReportingAgent] TC-MKT-API-042: Major - Functional impact detected: api timeout
[BugReportingAgent] TC-DASH-FE-051: Minor - Default severity for unspecified failure
[BugReportingAgent] Severity Summary - Critical: 5, Major: 15, Minor: 5
✓ Assigned severities: Critical: 5, Major: 15, Minor: 5

[STEP 4] Generating bug report Excel...
[BugReportingAgent] Generating bug report: ./Bug_Report.xlsx
[BugReportingAgent] Bug report saved successfully: ./Bug_Report.xlsx
[BugReportingAgent] Total bugs reported: 25
✓ Bug report generated: ./Bug_Report.xlsx

[STEP 5] Generating execution summary...
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

Summary saved to: ./bug-report-summary.json
```

---

### 2. Update Bug Status

#### Command
```bash
node bug-reporting-agent.js \
  --action update-status \
  --bug-id <id> \
  --new-status <status> \
  [--assigned-to <name>] \
  [--notes <notes>]
```

#### Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `--action` | Yes | Action to perform (update-status) | update-status |
| `--bug-id` | Yes | Bug ID to update | BR-001 |
| `--new-status` | Yes | New status for the bug | In Progress |
| `--assigned-to` | No | Developer assigned to fix | John Doe |
| `--notes` | No | Additional notes | Investigating the issue |

#### Valid Status Values

- `Open` - Bug reported but not started
- `In Progress` - Developer is working on fix
- `In Review` - Fix ready for review
- `Resolved` - Fix implemented and passed review
- `Closed` - Fix verified in production
- `Reopened` - Bug reappeared after closure

#### Examples

**Example 1: Update to In Progress**
```bash
node bug-reporting-agent.js \
  --action update-status \
  --bug-id BR-001 \
  --new-status "In Progress" \
  --assigned-to "John Doe" \
  --notes "Investigating authentication flow"
```

**Example 2: Update to In Review**
```bash
node bug-reporting-agent.js \
  --action update-status \
  --bug-id BR-001 \
  --new-status "In Review" \
  --assigned-to "Jane Smith" \
  --notes "Fix implemented, ready for QA review"
```

**Example 3: Update to Closed**
```bash
node bug-reporting-agent.js \
  --action update-status \
  --bug-id BR-001 \
  --new-status "Closed" \
  --notes "Fix verified in production build v1.2.3"
```

#### Output
```
[BugReportingAgent] Updating bug BR-001 status to In Progress
[BugReportingAgent] Updated bug BR-001: In Progress
[BugReportingAgent] Bug status updated successfully

Bug BR-001 status updated to In Progress
Bug Details: {
  "Bug ID": "BR-001",
  "Status": "In Progress",
  "Assigned To": "John Doe",
  "Notes": "2026-04-04T10:30:00.000Z: Investigating authentication flow",
  "Last Updated": "2026-04-04"
}
```

---

### 3. Programmatic Usage

#### Import as Module

```javascript
const {
  generateBugReport,
  updateBugStatus,
  readExecutedTestcases,
  detectFailedTestcases
} = require('./bug-reporting-agent');

// Generate bug report
async function runBugReporting() {
  const result = await generateBugReport(
    './excel-test-cases/',
    './Bug_Report.xlsx'
  );

  if (result.success) {
    console.log(`Bug report generated: ${result.bugReportPath}`);
    console.log(`Total bugs: ${result.bugsCount}`);

    // Access summary
    console.log(`Critical: ${result.summary.criticalBugs}`);
    console.log(`Major: ${result.summary.majorBugs}`);
    console.log(`Minor: ${result.summary.minorBugs}`);
  } else {
    console.error(`Failed: ${result.error}`);
  }
}

// Update bug status
function updateBug() {
  const result = updateBugStatus(
    './Bug_Report.xlsx',
    'BR-001',
    'In Progress',
    'John Doe',
    'Investigating issue'
  );

  if (result.success) {
    console.log(result.message);
  }
}

runBugReporting();
```

#### Custom Severity Rules

```javascript
const { assignBugSeverity, generateBugExcel } = require('./bug-reporting-agent');

// Override severity rules
const customSeverityRules = {
  criticalKeywords: ['crash', 'security', 'authentication failed'],
  majorKeywords: ['validation error', 'button not working'],
  criticalModules: ['Authentication', 'Payment']
};

// Custom severity assignment
function customSeverityAssignment(failedTestCases) {
  // Your custom logic here
  // ...
}
```

---

## Integration with Test Execution Agent

### Automatic Bug Report Generation

After test execution, automatically generate bug report:

```javascript
// In test-execution-agent.js
const { generateBugReport } = require('./bug-reporting-agent');

async function executeAllTestCases(testCasesFolder, frontendUrl, options = {}) {
  // ... execute tests ...

  // Generate bug report after all tests complete
  console.log('\n[TEST EXECUTION COMPLETE] Generating bug report...');
  const bugReportResult = await generateBugReport(
    testCasesFolder,
    './Bug_Report.xlsx'
  );

  if (bugReportResult.success) {
    console.log(`Bug report generated: ${bugReportResult.bugReportPath}`);
    console.log(`Bugs detected: ${bugReportResult.bugsCount}`);
  }

  return bugReportResult;
}
```

### CI/CD Integration

```bash
# In CI/CD pipeline (e.g., GitHub Actions, Jenkins)

#!/bin/bash

# Step 1: Run test execution
npm run test:execute

# Step 2: Generate bug report
node bug-reporting-agent.js \
  --test-cases-folder ./excel-test-cases/ \
  --output ./Bug_Report.xlsx

# Step 3: Fail pipeline if critical bugs found
BUG_COUNT=$(node -e "
  const fs = require('fs');
  const XLSX = require('xlsx');
  const wb = XLSX.readFile('./Bug_Report.xlsx');
  const data = XLSX.utils.sheet_to_json(wb.Sheets['Bug Report']);
  const critical = data.filter(b => b.Severity === 'Critical').length;
  console.log(critical);
")

if [ "$BUG_COUNT" -gt 0 ]; then
  echo "❌ CI/CD Failed: $BUG_COUNT critical bugs detected"
  exit 1
else
  echo "✅ CI/CD Passed: No critical bugs"
  exit 0
fi
```

---

## Configuration

### Configuration File

Create `bug-reporting-config.json`:

```json
{
  "testCasesFolder": "./excel-test-cases/",
  "bugReportPath": "./Bug_Report.xlsx",
  "summaryPath": "./bug-report-summary.json",
  "reportedBy": "QA Automation",
  "defaultSeverity": "Minor",
  "defaultStatus": "Open",
  "severityRules": {
    "criticalKeywords": [
      "crash", "system crash", "server down", "500 error",
      "data loss", "security", "authentication failed", "401", "403"
    ],
    "majorKeywords": [
      "validation error", "button not working", "api failed",
      "missing data", "incorrect data", "timeout"
    ],
    "criticalModules": [
      "Authentication", "Payment", "Checkout"
    ]
  }
}
```

### Load Configuration

```javascript
const fs = require('fs');

function loadConfig() {
  const configPath = './bug-reporting-config.json';
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return { ...DEFAULT_CONFIG, ...config };
  }
  return DEFAULT_CONFIG;
}

const config = loadConfig();
```

---

## Troubleshooting

### Issue: No bugs detected

**Cause**: All tests passed or no failed test cases found.

**Solution**:
```bash
# Check test case files for Status column
node -e "
  const XLSX = require('xlsx');
  const fs = require('fs');
  const files = fs.readdirSync('./excel-test-cases/').filter(f => f.endsWith('.xlsx'));

  files.forEach(file => {
    const wb = XLSX.readFile(\`./excel-test-cases/\${file}\`);
    const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    const failed = data.filter(r => (r.Status || '').toLowerCase() === 'fail');
    console.log(\`\${file}: \${failed.length} failed\`);
  });
"
```

### Issue: Bug ID not sequential

**Cause**: Existing Bug_Report.xlsx with previous bug IDs.

**Solution**:
```bash
# Delete existing bug report and regenerate
rm Bug_Report.xlsx
node bug-reporting-agent.js --test-cases-folder ./excel-test-cases/
```

### Issue: Severity classification seems incorrect

**Cause**: Default severity rules may not match project needs.

**Solution**: Customize severity rules in configuration file.

### Issue: Cannot update bug status

**Cause**: Bug report file is open in another application.

**Solution**: Close Bug_Report.xlsx in Excel/other application and retry.

### Issue: Module names are incorrect

**Cause**: File naming convention not matching expected format.

**Solution**: Ensure files use `{MODULE}_TestCases.xlsx` format.

---

## Best Practices

### 1. Regular Bug Reporting
- Generate bug report after each test execution cycle
- Review bug report with QA team
- Archive old reports monthly

### 2. Bug Status Management
- Update bug status regularly (daily or as progress is made)
- Assign bugs to specific developers
- Add detailed notes for each status change

### 3. Severity Classification
- Review severity assignments regularly
- Adjust severity rules as needed
- Ensure critical bugs are prioritized

### 4. Integration with Development
- Share bug report with development team
- Use bug IDs in commit messages (e.g., "Fixes BR-001")
- Close bugs only after verified in production

### 5. Metrics and Trends
- Track bug trends over time
- Identify modules with recurring bugs
- Measure bug resolution time

---

## Advanced Usage

### Export to Different Formats

```javascript
const XLSX = require('xlsx');

function exportToCSV(bugReportPath, csvPath) {
  const workbook = XLSX.readFile(bugReportPath);
  const worksheet = workbook.Sheets['Bug Report'];
  const data = XLSX.utils.sheet_to_json(worksheet);

  const csv = XLSX.utils.sheet_to_csv(worksheet);
  fs.writeFileSync(csvPath, csv);
  console.log(`Exported to CSV: ${csvPath}`);
}

exportToCSV('./Bug_Report.xlsx', './Bug_Report.csv');
```

### Generate HTML Report

```javascript
function generateHTMLReport(bugReportPath, htmlPath) {
  const workbook = XLSX.readFile(bugReportPath);
  const data = XLSX.utils.sheet_to_json(workbook.Sheets['Bug Report']);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bug Report</title>
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .Critical { background-color: #ffcccc; }
        .Major { background-color: #ffffcc; }
        .Minor { background-color: #ccffcc; }
      </style>
    </head>
    <body>
      <h1>Bug Report</h1>
      <table>
        <tr>
          <th>Bug ID</th>
          <th>Module</th>
          <th>Description</th>
          <th>Severity</th>
          <th>Status</th>
        </tr>
        ${data.map(bug => `
          <tr class="${bug.Severity}">
            <td>${bug['Bug ID']}</td>
            <td>${bug.Module}</td>
            <td>${bug.Description}</td>
            <td>${bug.Severity}</td>
            <td>${bug.Status}</td>
          </tr>
        `).join('')}
      </table>
    </body>
    </html>
  `;

  fs.writeFileSync(htmlPath, html);
  console.log(`HTML report generated: ${htmlPath}`);
}
```

### Email Bug Report

```javascript
const nodemailer = require('nodemailer');

function emailBugReport(bugReportPath, summary) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password'
    }
  });

  const mailOptions = {
    from: 'qa-automation@company.com',
    to: 'dev-team@company.com',
    subject: 'Bug Report - New Bugs Detected',
    text: `
      Bug Report Generated

      Total Bugs: ${summary.bugsDetected}
      Critical: ${summary.criticalBugs}
      Major: ${summary.majorBugs}
      Minor: ${summary.minorBugs}

      Please review the attached bug report.
    `,
    attachments: [
      {
        path: bugReportPath
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}
```

---

## Support and Documentation

- **Agent Definition**: `.claude/agents/bug-reporting-agent.md`
- **Structure Reference**: `BUG_REPORT_STRUCTURE.md`
- **Usage Guide**: `BUG_REPORTING_AGENT_README.md` (this file)

---

## Version History

- **v1.0.0** (2026-04-04)
  - Initial release
  - Bug detection from failed test cases
  - Automatic severity assignment
  - Excel report generation
  - Bug status update functionality

---

**Happy Bug Reporting! 🐛**
