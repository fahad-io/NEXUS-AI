# Bug Reporting Agent (Senior QA Automation Agent)

## AGENT PURPOSE

**Agent Name**: Bug Reporting Agent (Senior QA Automation)

**Primary Responsibility**: Read all executed test case Excel files, detect failed test cases, and generate a comprehensive Bug Report Excel sheet with detailed bug information.

**Key Capabilities**:
- Multi-file Excel reading and parsing
- Automated bug detection from failed test cases
- Intelligent severity assignment (Critical/Major/Minor)
- Professional bug report generation
- Bug status tracking and updates
- Integration with existing test execution workflows

---

## INPUT HANDLING

### Required Inputs

1. **Test Case Folder** (provided by user or auto-detected)
   - Folder path containing multiple `.xlsx` test case files
   - Each file represents a module (Authentication, Chat, Marketplace, etc.)
   - Files should contain execution results with Status column

2. **Bug Report Output Path** (optional, default: `./Bug_Report.xlsx`)
   - Path where the bug report Excel will be saved
   - Default: Project root folder

### File Structure

Each Excel file contains executed test cases:
```
| TestCase ID | Module Name | Type | Page/Component/API | Description | Preconditions | Steps | Expected Result | Actual Result | Status |
```

**Status Values**:
- **Pass** - Test executed successfully
- **Fail** - Test failed (becomes a bug)
- **Blocked** - Test could not execute (not a bug)

---

## SKILLS (MANDATORY)

### Skill 1: read_executed_testcases

**Purpose**: Read and parse all executed test case Excel files from the specified folder

**Implementation**:
```javascript
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

async function readExecutedTestcases(folderPath) {
  try {
    console.log(`[BugReportingAgent] Reading test cases from: ${folderPath}`);

    // Validate folder exists
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder not found: ${folderPath}`);
    }

    // Read all Excel files
    const files = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.xlsx') && !file.includes('~$')); // Exclude temporary files

    console.log(`[BugReportingAgent] Found ${files.length} Excel files`);

    const allTestCases = [];
    let totalTestCases = 0;

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      allTestCases.push({
        fileName: file,
        filePath: filePath,
        module: extractModuleName(file),
        testCases: data
      });

      totalTestCases += data.length;
      console.log(`[BugReportingAgent] ${file}: ${data.length} test cases`);
    }

    console.log(`[BugReportingAgent] Total test cases across all files: ${totalTestCases}`);

    return {
      success: true,
      files: allTestCases,
      totalTestCases: totalTestCases
    };

  } catch (error) {
    console.error('[BugReportingAgent] Error reading test cases:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

function extractModuleName(fileName) {
  // Extract module name from filename
  // Example: "AUTHENTICATION_TestCases.xlsx" -> "Authentication"
  const cleanName = fileName
    .replace('_TestCases.xlsx', '')
    .replace('.xlsx', '')
    .replace(/_/g, ' ');
  return cleanName;
}
```

**Output**: Object containing:
- `success` - Boolean indicating operation success
- `files` - Array of file objects with fileName, filePath, module, testCases
- `totalTestCases` - Total number of test cases across all files
- `error` - Error message if failed

---

### Skill 2: detect_failed_testcases

**Purpose**: Filter and collect all test cases with Status = Fail

**Implementation**:
```javascript
async function detectFailedTestcases(executedTestcases) {
  try {
    console.log('[BugReportingAgent] Detecting failed test cases...');

    const failedTestCases = [];
    const summary = {
      total: executedTestcases.totalTestCases,
      passed: 0,
      failed: 0,
      blocked: 0,
      pending: 0
    };

    for (const fileInfo of executedTestcases.files) {
      for (const testCase of fileInfo.testCases) {
        const status = (testCase['Status'] || '').toLowerCase();

        // Update summary
        if (status === 'pass') summary.passed++;
        else if (status === 'fail') summary.failed++;
        else if (status === 'blocked') summary.blocked++;
        else summary.pending++;

        // Collect failed test cases
        if (status === 'fail') {
          failedTestCases.push({
            testCaseId: testCase['TestCase ID'] || 'N/A',
            module: fileInfo.module || testCase['Module Name'] || 'Unknown',
            type: testCase['Type'] || 'Unknown',
            pageComponentApi: testCase['Page/Component/API'] || 'N/A',
            description: testCase['Description'] || 'No description',
            preconditions: testCase['Preconditions'] || 'N/A',
            steps: testCase['Steps'] || 'No steps',
            expectedResult: testCase['Expected Result'] || 'N/A',
            actualResult: testCase['Actual Result'] || 'No actual result',
            executionTimestamp: testCase['Execution Timestamp'] || new Date().toISOString(),
            fileName: fileInfo.fileName
          });
        }
      }
    }

    console.log(`[BugReportingAgent] Detected ${failedTestCases.length} failed test cases`);
    console.log(`[BugReportingAgent] Summary - Total: ${summary.total}, Passed: ${summary.passed}, Failed: ${summary.failed}, Blocked: ${summary.blocked}, Pending: ${summary.pending}`);

    return {
      success: true,
      failedTestCases: failedTestCases,
      summary: summary
    };

  } catch (error) {
    console.error('[BugReportingAgent] Error detecting failed test cases:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
```

**Output**: Object containing:
- `success` - Boolean indicating operation success
- `failedTestCases` - Array of failed test case objects
- `summary` - Summary statistics (total, passed, failed, blocked, pending)
- `error` - Error message if failed

---

### Skill 3: assign_bug_severity

**Purpose**: Automatically assign severity (Critical/Major/Minor) to each failed test case based on failure impact

**Implementation**:
```javascript
async function assignBugSeverity(failedTestCases) {
  try {
    console.log('[BugReportingAgent] Assigning bug severities...');

    const bugs = [];

    for (const failedCase of failedTestCases) {
      const severity = determineSeverity(failedCase);

      const bug = {
        testCaseId: failedCase.testCaseId,
        module: failedCase.module,
        type: failedCase.type,
        pageComponentApi: failedCase.pageComponentApi,
        description: failedCase.description,
        preconditions: failedCase.preconditions,
        steps: failedCase.steps,
        expectedResult: failedCase.expectedResult,
        actualResult: failedCase.actualResult,
        severity: severity.level,
        severityReason: severity.reason,
        executionTimestamp: failedCase.executionTimestamp,
        fileName: failedCase.fileName
      };

      bugs.push(bug);
      console.log(`[BugReportingAgent] ${failedCase.testCaseId}: ${severity.level} - ${severity.reason}`);
    }

    // Generate severity summary
    const severitySummary = {
      Critical: bugs.filter(b => b.severity === 'Critical').length,
      Major: bugs.filter(b => b.severity === 'Major').length,
      Minor: bugs.filter(b => b.severity === 'Minor').length
    };

    console.log(`[BugReportingAgent] Severity Summary - Critical: ${severitySummary.Critical}, Major: ${severitySummary.Major}, Minor: ${severitySummary.Minor}`);

    return {
      success: true,
      bugs: bugs,
      severitySummary: severitySummary
    };

  } catch (error) {
    console.error('[BugReportingAgent] Error assigning bug severity:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

function determineSeverity(testCase) {
  const description = (testCase.description || '').toLowerCase();
  const actualResult = (testCase.actualResult || '').toLowerCase();
  const type = (testCase.type || '').toLowerCase();
  const module = (testCase.module || '').toLowerCase();
  const combinedText = `${description} ${actualResult} ${type}`.toLowerCase();

  // CRITICAL - System-breaking or blocker issues
  const criticalKeywords = [
    'crash', 'system crash', 'application crash',
    'server down', '500 error', 'internal server error',
    'data loss', 'data corruption', 'data deleted',
    'security', 'security breach', 'unauthorized access',
    'authentication failed', 'auth failed',
    'session expired', 'session timeout',
    'blocking', 'blocker', 'cannot proceed',
    'unable to login', 'unable to sign in', 'login broken',
    'signup broken', 'registration broken',
    'database error', 'db error', 'connection failed',
    'payment failed', 'transaction failed',
    'infinite loop', 'freeze', 'hang',
    '401', '403', 'forbidden'
  ];

  // MAJOR - Functional impact or partial failure
  const majorKeywords = [
    'validation error', 'validation failed',
    'button not working', 'button broken',
    'not clickable', 'cannot click',
    'link broken', 'link not working',
    'form not submitting', 'form submission failed',
    'api failed', 'api error', 'api timeout',
    'incorrect response', 'wrong response',
    'missing data', 'data not displayed',
    'incorrect data', 'wrong data',
    'timeout', 'loading failed',
    'not visible', 'element not found',
    'wrong page', 'redirected incorrectly',
    'error message', 'error displayed',
    'negative', 'negative test'
  ];

  // Check for critical severity
  for (const keyword of criticalKeywords) {
    if (combinedText.includes(keyword)) {
      return {
        level: 'Critical',
        reason: `System-breaking issue detected: ${keyword}`
      };
    }
  }

  // Check for major severity
  for (const keyword of majorKeywords) {
    if (combinedText.includes(keyword)) {
      return {
        level: 'Major',
        reason: `Functional impact detected: ${keyword}`
      };
    }
  }

  // Module-based severity rules
  if (module.includes('authentication') || module.includes('auth')) {
    return {
      level: 'Critical',
      reason: 'Authentication-related failure'
    };
  }

  if (module.includes('payment') || module.includes('checkout')) {
    return {
      level: 'Critical',
      reason: 'Payment/checkout-related failure'
    };
  }

  // Type-based severity rules
  if (type.includes('integration')) {
    return {
      level: 'Major',
      reason: 'Integration test failure'
    };
  }

  if (type.includes('boundary')) {
    return {
      level: 'Minor',
      reason: 'Boundary value test failure'
    };
  }

  // Default to Minor for unspecified failures
  return {
    level: 'Minor',
    reason: 'Default severity for unspecified failure'
  };
}
```

**Output**: Object containing:
- `success` - Boolean indicating operation success
- `bugs` - Array of bug objects with severity information
- `severitySummary` - Summary of bugs by severity level
- `error` - Error message if failed

---

### Skill 4: generate_bug_excel

**Purpose**: Generate a comprehensive Bug Report Excel sheet with all detected bugs

**Implementation**:
```javascript
const XLSX = require('xlsx');
const path = require('path');

async function generateBugExcel(bugs, outputPath = './Bug_Report.xlsx') {
  try {
    console.log(`[BugReportingAgent] Generating bug report: ${outputPath}`);

    if (bugs.length === 0) {
      console.log('[BugReportingAgent] No bugs to report');
      return {
        success: true,
        message: 'No bugs found - all tests passed!',
        bugsCount: 0
      };
    }

    // Generate bug IDs
    const bugsWithIds = bugs.map((bug, index) => ({
      ...bug,
      bugId: `BR-${String(index + 1).padStart(3, '0')}`,
      status: 'Open', // Default status for new bugs
      reportedDate: new Date().toISOString(),
      assignedTo: '', // Empty for manual assignment
      priority: mapSeverityToPriority(bug.severity)
    }));

    // Prepare data for Excel
    const bugReportData = bugsWithIds.map(bug => ({
      'Bug ID': bug.bugId,
      'TestCase ID': bug.testCaseId,
      'Module': bug.module,
      'Type': bug.type,
      'Page/Component/API': bug.pageComponentApi,
      'Description': bug.description,
      'Steps to Reproduce': bug.steps,
      'Expected Result': bug.expectedResult,
      'Actual Result': bug.actualResult,
      'Severity': bug.severity,
      'Severity Reason': bug.severityReason,
      'Status': bug.status,
      'Priority': bug.priority,
      'Reported Date': bug.reportedDate.split('T')[0], // Date only
      'Reported By': 'QA Automation',
      'Assigned To': bug.assignedTo,
      'Source File': bug.fileName
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(bugReportData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 10 },  // Bug ID
      { wch: 18 },  // TestCase ID
      { wch: 15 },  // Module
      { wch: 20 },  // Type
      { wch: 30 },  // Page/Component/API
      { wch: 50 },  // Description
      { wch: 80 },  // Steps to Reproduce
      { wch: 60 },  // Expected Result
      { wch: 80 },  // Actual Result
      { wch: 10 },  // Severity
      { wch: 30 },  // Severity Reason
      { wch: 12 },  // Status
      { wch: 10 },  // Priority
      { wch: 12 },  // Reported Date
      { wch: 15 },  // Reported By
      { wch: 15 },  // Assigned To
      { wch: 25 }   // Source File
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bug Report');

    // Create summary sheet
    const summaryData = generateSummarySheetData(bugsWithIds);
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    summaryWorksheet['!cols'] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 20 }
    ];
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Save workbook
    XLSX.writeFile(workbook, outputPath);

    console.log(`[BugReportingAgent] Bug report saved successfully: ${outputPath}`);
    console.log(`[BugReportingAgent] Total bugs reported: ${bugsWithIds.length}`);

    return {
      success: true,
      filePath: outputPath,
      bugsCount: bugsWithIds.length,
      bugs: bugsWithIds,
      message: `Bug report generated with ${bugsWithIds.length} bugs`
    };

  } catch (error) {
    console.error('[BugReportingAgent] Error generating bug Excel:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

function mapSeverityToPriority(severity) {
  const priorityMap = {
    'Critical': 'P1',
    'Major': 'P2',
    'Minor': 'P3'
  };
  return priorityMap[severity] || 'P4';
}

function generateSummarySheetData(bugs) {
  // Count bugs by module
  const moduleCount = {};
  bugs.forEach(bug => {
    moduleCount[bug.module] = (moduleCount[bug.module] || 0) + 1;
  });

  // Count bugs by severity
  const severityCount = {
    'Critical': bugs.filter(b => b.severity === 'Critical').length,
    'Major': bugs.filter(b => b.severity === 'Major').length,
    'Minor': bugs.filter(b => b.severity === 'Minor').length
  };

  // Count bugs by type
  const typeCount = {};
  bugs.forEach(bug => {
    typeCount[bug.type] = (typeCount[bug.type] || 0) + 1;
  });

  // Build summary data
  const summaryData = [
    { Category: 'Bug Report', Metric: 'Value', Count: '' },
    { Category: '----------', Metric: '-----', Count: '' },
    { Category: 'Total Bugs', Metric: 'Total Count', Count: bugs.length },
    { Category: '', Metric: '', Count: '' },
    { Category: 'By Severity', Metric: 'Count', Count: '' },
    { Category: '----------', Metric: '-----', Count: '' },
    { Category: 'Critical', Metric: 'Critical Bugs', Count: severityCount.Critical },
    { Category: 'Major', Metric: 'Major Bugs', Count: severityCount.Major },
    { Category: 'Minor', Metric: 'Minor Bugs', Count: severityCount.Minor },
    { Category: '', Metric: '', Count: '' },
    { Category: 'By Module', Metric: 'Count', Count: '' },
    { Category: '----------', Metric: '-----', Count: '' },
    ...Object.entries(moduleCount).map(([module, count]) => ({
      Category: module,
      Metric: `${module} Bugs`,
      Count: count
    })),
    { Category: '', Metric: '', Count: '' },
    { Category: 'By Type', Metric: 'Count', Count: '' },
    { Category: '----------', Metric: '-----', Count: '' },
    ...Object.entries(typeCount).map(([type, count]) => ({
      Category: type,
      Metric: `${type} Bugs`,
      Count: count
    })),
    { Category: '', Metric: '', Count: '' },
    { Category: 'Report Info', Metric: 'Value', Count: '' },
    { Category: '----------', Metric: '-----', Count: '' },
    { Category: 'Generated Date', Metric: new Date().toISOString().split('T')[0], Count: '' },
    { Category: 'Generated By', Metric: 'QA Automation Agent', Count: '' }
  ];

  return summaryData;
}
```

**Output**: Object containing:
- `success` - Boolean indicating operation success
- `filePath` - Path to the generated bug report
- `bugsCount` - Number of bugs in the report
- `bugs` - Array of bug objects with IDs
- `message` - Success message
- `error` - Error message if failed

---

### Skill 5: update_bug_status

**Purpose**: Update bug status in the bug report (Open → In Progress → Closed)

**Implementation**:
```javascript
async function updateBugStatus(bugReportPath, bugId, newStatus, assignedTo = '', notes = '') {
  try {
    console.log(`[BugReportingAgent] Updating bug ${bugId} status to ${newStatus}`);

    // Validate new status
    const validStatuses = ['Open', 'In Progress', 'In Review', 'Resolved', 'Closed', 'Reopened'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}. Valid statuses: ${validStatuses.join(', ')}`);
    }

    // Read existing bug report
    if (!fs.existsSync(bugReportPath)) {
      throw new Error(`Bug report not found: ${bugReportPath}`);
    }

    const workbook = XLSX.readFile(bugReportPath);
    const worksheet = workbook.Sheets['Bug Report'];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Find and update the bug
    let updated = false;
    let updatedBug = null;

    for (let i = 0; i < data.length; i++) {
      if (data[i]['Bug ID'] === bugId) {
        // Update status
        data[i]['Status'] = newStatus;

        // Update assigned to if provided
        if (assignedTo) {
          data[i]['Assigned To'] = assignedTo;
        }

        // Add notes if provided (append to existing)
        if (notes) {
          const existingNotes = data[i]['Notes'] || '';
          data[i]['Notes'] = existingNotes ? `${existingNotes}\n\n${new Date().toISOString()}: ${notes}` : `${new Date().toISOString()}: ${notes}`;
        }

        // Update last updated timestamp
        data[i]['Last Updated'] = new Date().toISOString().split('T')[0];

        updated = true;
        updatedBug = data[i];
        console.log(`[BugReportingAgent] Updated bug ${bugId}: ${newStatus}`);
        break;
      }
    }

    if (!updated) {
      throw new Error(`Bug ${bugId} not found in bug report`);
    }

    // Write back to Excel
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    newWorksheet['!cols'] = worksheet['!cols']; // Preserve column widths
    workbook.Sheets['Bug Report'] = newWorksheet;
    XLSX.writeFile(workbook, bugReportPath);

    console.log(`[BugReportingAgent] Bug status updated successfully`);

    return {
      success: true,
      bug: updatedBug,
      message: `Bug ${bugId} status updated to ${newStatus}`
    };

  } catch (error) {
    console.error('[BugReportingAgent] Error updating bug status:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
```

**Output**: Object containing:
- `success` - Boolean indicating operation success
- `bug` - Updated bug object
- `message` - Success message
- `error` - Error message if failed

---

## EXECUTION FLOW

### Master Bug Reporting Algorithm

```javascript
async function generateBugReport(testCasesFolder, outputPath = './Bug_Report.xlsx') {
  console.log('='.repeat(80));
  console.log('BUG REPORTING AGENT');
  console.log('='.repeat(80));
  console.log(`Test Cases Folder: ${testCasesFolder}`);
  console.log(`Bug Report Output: ${outputPath}`);
  console.log('='.repeat(80));

  // STEP 1: Read all executed test cases
  console.log('\n[STEP 1] Reading executed test cases...');
  const readResult = await readExecutedTestcases(testCasesFolder);

  if (!readResult.success) {
    console.error(`[ERROR] Failed to read test cases: ${readResult.error}`);
    return {
      success: false,
      error: readResult.error
    };
  }

  console.log(`✓ Read ${readResult.totalTestCases} test cases from ${readResult.files.length} files`);

  // STEP 2: Detect failed test cases
  console.log('\n[STEP 2] Detecting failed test cases...');
  const detectResult = await detectFailedTestcases(readResult);

  if (!detectResult.success) {
    console.error(`[ERROR] Failed to detect failed test cases: ${detectResult.error}`);
    return {
      success: false,
      error: detectResult.error
    };
  }

  console.log(`✓ Detected ${detectResult.failedTestCases.length} failed test cases`);

  if (detectResult.failedTestCases.length === 0) {
    console.log('\n[SUCCESS] No bugs found - all tests passed!');
    return {
      success: true,
      message: 'No bugs found - all tests passed!',
      bugsCount: 0
    };
  }

  // STEP 3: Assign bug severity
  console.log('\n[STEP 3] Assigning bug severities...');
  const severityResult = await assignBugSeverity(detectResult.failedTestCases);

  if (!severityResult.success) {
    console.error(`[ERROR] Failed to assign bug severity: ${severityResult.error}`);
    return {
      success: false,
      error: severityResult.error
    };
  }

  console.log(`✓ Assigned severities: Critical: ${severityResult.severitySummary.Critical}, Major: ${severityResult.severitySummary.Major}, Minor: ${severityResult.severitySummary.Minor}`);

  // STEP 4: Generate bug report Excel
  console.log('\n[STEP 4] Generating bug report Excel...');
  const excelResult = await generateBugExcel(severityResult.bugs, outputPath);

  if (!excelResult.success) {
    console.error(`[ERROR] Failed to generate bug Excel: ${excelResult.error}`);
    return {
      success: false,
      error: excelResult.error
    };
  }

  console.log(`✓ Bug report generated: ${excelResult.filePath}`);

  // STEP 5: Generate summary
  console.log('\n[STEP 5] Generating execution summary...');
  const summary = {
    executionDate: new Date().toISOString(),
    testCasesFolder: testCasesFolder,
    bugReportPath: excelResult.filePath,
    totalTestCases: detectResult.summary.total,
    passedTests: detectResult.summary.passed,
    failedTests: detectResult.summary.failed,
    blockedTests: detectResult.summary.blocked,
    pendingTests: detectResult.summary.pending,
    bugsDetected: excelResult.bugsCount,
    criticalBugs: severityResult.severitySummary.Critical,
    majorBugs: severityResult.severitySummary.Major,
    minorBugs: severityResult.severitySummary.Minor,
    passRate: ((detectResult.summary.passed / detectResult.summary.total) * 100).toFixed(2) + '%'
  };

  console.log('\n' + '='.repeat(80));
  console.log('BUG REPORTING SUMMARY');
  console.log('='.repeat(80));
  console.log(`Test Execution Summary:`);
  console.log(`  Total Test Cases: ${summary.totalTestCases}`);
  console.log(`  Passed: ${summary.passedTests} (${summary.passRate})`);
  console.log(`  Failed: ${summary.failedTests}`);
  console.log(`  Blocked: ${summary.blockedTests}`);
  console.log(`  Pending: ${summary.pendingTests}`);
  console.log(`\nBug Summary:`);
  console.log(`  Total Bugs: ${summary.bugsDetected}`);
  console.log(`  Critical: ${summary.criticalBugs}`);
  console.log(`  Major: ${summary.majorBugs}`);
  console.log(`  Minor: ${summary.minorBugs}`);
  console.log(`\nBug Report: ${excelResult.filePath}`);
  console.log('='.repeat(80));

  // Save summary to file
  const fs = require('fs');
  const summaryPath = path.join(path.dirname(outputPath), 'bug-report-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\nSummary saved to: ${summaryPath}`);

  return {
    success: true,
    bugsCount: excelResult.bugsCount,
    bugReportPath: excelResult.filePath,
    summaryPath: summaryPath,
    summary: summary,
    message: `Bug report generated successfully with ${excelResult.bugsCount} bugs`
  };
}
```

---

## BUG REPORT EXCEL STRUCTURE

### Sheet 1: Bug Report

| Column | Description | Example |
|--------|-------------|---------|
| **Bug ID** | Unique bug identifier | BR-001, BR-002... |
| **TestCase ID** | Reference to failed test case | TC-AUTH-FE-001 |
| **Module** | Module where bug was found | Authentication, Chat, Marketplace |
| **Type** | Test case type | Frontend, Backend, API, Integration |
| **Page/Component/API** | Affected page, component or API | /auth/login, POST /api/auth/login |
| **Description** | Bug description | User unable to login with valid credentials |
| **Steps to Reproduce** | Steps to reproduce bug | 1. Navigate to /auth/login<br>2. Enter valid email... |
| **Expected Result** | Expected behavior | User should be redirected to dashboard |
| **Actual Result** | Actual behavior (failure) | Error message displayed instead |
| **Severity** | Bug severity | Critical, Major, Minor |
| **Severity Reason** | Reason for severity assignment | Authentication-related failure |
| **Status** | Bug status | Open, In Progress, In Review, Resolved, Closed, Reopened |
| **Priority** | Bug priority | P1, P2, P3, P4 |
| **Reported Date** | Date bug was reported | 2026-04-04 |
| **Reported By** | Who reported the bug | QA Automation |
| **Assigned To** | Developer assigned to fix (optional) | John Doe |
| **Source File** | Test case file where bug was found | AUTHENTICATION_TestCases.xlsx |

### Sheet 2: Summary

| Category | Metric | Count |
|----------|--------|-------|
| Total Bugs | Total Count | 25 |
| Critical | Critical Bugs | 5 |
| Major | Major Bugs | 15 |
| Minor | Minor Bugs | 5 |
| Authentication | Authentication Bugs | 8 |
| Chat | Chat Bugs | 6 |
| Marketplace | Marketplace Bugs | 7 |
| Dashboard | Dashboard Bugs | 4 |
| Frontend | Frontend Bugs | 12 |
| Backend | Backend Bugs | 8 |
| API | API Bugs | 3 |
| Integration | Integration Bugs | 2 |

---

## RULES

### Rule 1: Only failed test cases become bugs
**Why**: Only actual failures should be reported as bugs.
**How to apply**: Filter test cases with `Status = 'Fail'` only. Ignore 'Pass', 'Blocked', and 'Pending' statuses.

### Rule 2: Each bug must reference its TestCase ID
**Why**: Developers need to know which test case failed to understand the bug.
**How to apply**: Always include the original `TestCase ID` in the bug report for traceability.

### Rule 3: Severity must be assigned correctly
**Why**: Proper severity assignment helps prioritize bug fixes.
**How to apply**: Use the severity assignment algorithm that considers:
- Keywords in description and actual result
- Module type (Authentication = Critical, etc.)
- Test type (Integration = Major, Boundary = Minor)
- Default to Minor for unspecified failures

### Rule 4: Excel sheet must be professional and clear
**Why**: The bug report will be used by QA and Dev teams for bug tracking.
**How to apply**:
- Use clear column headers
- Set appropriate column widths
- Include multiple sheets (Bug Report, Summary)
- Add Bug IDs for easy reference
- Include status and priority for tracking
- Format dates consistently (YYYY-MM-DD)

### Rule 5: Agent must be reusable for future test case files
**Why**: Test execution will be run multiple times, and bugs need to be tracked over time.
**How to apply**:
- Use flexible file path inputs
- Support reading multiple Excel files
- Generate bug reports with sequential IDs (BR-001, BR-002...)
- Include update_bug_status skill for tracking bug lifecycle
- Save summary metadata for historical reference

### Rule 6: No bugs when all tests pass
**Why**: Don't create empty bug reports.
**How to apply**: If no failed test cases are found, log success message and return with `bugsCount: 0`.

---

## DEPENDENCIES

```json
{
  "name": "bug-reporting-agent",
  "version": "1.0.0",
  "description": "Senior QA Automation Agent for Bug Reporting",
  "main": "bug-reporting-agent.js",
  "dependencies": {
    "xlsx": "^0.18.5"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

---

## INSTALLATION

```bash
# Install dependencies
npm install xlsx

# Run bug reporting agent
node bug-reporting-agent.js --test-cases-folder ./excel-test-cases/ --output ./Bug_Report.xlsx
```

---

## CONFIGURATION

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

---

## USAGE EXAMPLES

### Example 1: Generate bug report from test execution results

```javascript
const { generateBugReport } = require('./bug-reporting-agent');

async function main() {
  const result = await generateBugReport(
    './excel-test-cases/',
    './Bug_Report.xlsx'
  );

  if (result.success) {
    console.log(`Bug report generated: ${result.bugReportPath}`);
    console.log(`Total bugs: ${result.bugsCount}`);
  } else {
    console.error(`Failed to generate bug report: ${result.error}`);
  }
}

main();
```

### Example 2: Update bug status

```javascript
const { updateBugStatus } = require('./bug-reporting-agent');

async function updateBug() {
  const result = await updateBugStatus(
    './Bug_Report.xlsx',
    'BR-001',
    'In Progress',
    'John Doe',
    'Investigating authentication issue'
  );

  if (result.success) {
    console.log(`Bug status updated: ${result.message}`);
  }
}

updateBug();
```

### Example 3: CLI usage

```bash
# Generate bug report
node bug-reporting-agent.js \
  --test-cases-folder ./excel-test-cases/ \
  --output ./Bug_Report.xlsx

# Update bug status
node bug-reporting-agent.js \
  --action update-status \
  --bug-id BR-001 \
  --new-status In Progress \
  --assigned-to "John Doe" \
  --notes "Investigating the issue"

# View bug summary
node bug-reporting-agent.js \
  --action summary \
  --bug-report ./Bug_Report.xlsx
```

---

## INTEGRATION WITH TEST EXECUTION AGENT

The Bug Reporting Agent can be automatically called after test execution:

```javascript
// In TestCase Execution Agent
const { generateBugReport } = require('../bug-reporting-agent');

async function executeAllTestCases(testCasesFolder, frontendUrl, options = {}) {
  // ... execute tests ...

  // After all tests are executed, generate bug report
  console.log('\n[TEST EXECUTION COMPLETE] Generating bug report...');
  const bugReportResult = await generateBugReport(
    testCasesFolder,
    './Bug_Report.xlsx'
  );

  if (bugReportResult.success) {
    console.log(`Bug report generated: ${bugReportResult.bugReportPath}`);
  }

  return bugReportResult;
}
```

---

## OUTPUT SAMPLE

### Bug Report Excel Content

```
| Bug ID   | TestCase ID   | Module          | Type      | Page/Component/API      | Description                                | Steps to Reproduce                                                                 | Expected Result                  | Actual Result                                     | Severity | Status | Priority | Reported Date |
|----------|---------------|-----------------|-----------|-------------------------|--------------------------------------------|------------------------------------------------------------------------------------|----------------------------------|---------------------------------------------------|----------|--------|----------|---------------|
| BR-001   | TC-AUTH-FE-001 | Authentication  | Frontend  | /auth/login             | User unable to login with valid credentials | 1. Navigate to /auth/login<br>2. Enter valid email "test@example.com"<br>3. Enter valid password<br>4. Click "Sign In" button | User should be redirected to dashboard | Error message "Invalid credentials" displayed       | Critical | Open   | P1       | 2026-04-04    |
| BR-002   | TC-AUTH-BE-015 | Authentication  | Backend   | POST /api/auth/login    | API returns 500 error for valid credentials | 1. Send POST request to /api/auth/login with valid credentials                      | API should return 200 OK with token | API returns 500 Internal Server Error             | Critical | Open   | P1       | 2026-04-04    |
| BR-003   | TC-CHAT-FE-023 | Chat            | Frontend  | /chat                   | Send message button not working            | 1. Navigate to /chat<br>2. Type message in input field<br>3. Click "Send" button | Message should be sent and displayed | Button is unresponsive, message not sent          | Major    | Open   | P2       | 2026-04-04    |
| BR-004   | TC-MKT-API-042 | Marketplace     | API       | GET /api/models         | API timeout when fetching models          | 1. Send GET request to /api/models                                            | API should return models list       | Request timeout after 10 seconds                 | Major    | Open   | P2       | 2026-04-04    |
| BR-005   | TC-DASH-FE-051 | Dashboard       | Frontend  | /dashboard              | Chart data not displaying correctly         | 1. Navigate to /dashboard<br>2. View stats charts                            | Charts should display data         | Charts show incorrect data points                 | Minor    | Open   | P3       | 2026-04-04    |
```

---

## NOTES

- This agent reads executed test case Excel files automatically
- It detects only failed test cases (Status = Fail)
- It assigns severity intelligently based on failure impact
- It generates professional Excel reports with multiple sheets
- It supports bug status updates throughout the lifecycle
- It integrates seamlessly with the Test Execution Agent
- Bug IDs are sequential (BR-001, BR-002...) for easy tracking
- Summary statistics help QA managers understand test health
- The agent is reusable for future test execution cycles

---

**Bug Reporting Agent Ready for Production!**
