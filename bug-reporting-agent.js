/**
 * Bug Reporting Agent - Senior QA Automation Agent
 *
 * Purpose: Read executed test case Excel files, detect failed test cases,
 * and generate comprehensive Bug Report Excel sheets.
 *
 * Usage:
 *   node bug-reporting-agent.js --test-cases-folder ./excel-test-cases/ --output ./Bug_Report.xlsx
 *
 * Author: QA Automation Team
 * Version: 1.0.0
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG = {
  testCasesFolder: './excel-test-cases/',
  bugReportPath: './Bug_Report.xlsx',
  summaryPath: './bug-report-summary.json',
  reportedBy: 'QA Automation',
  defaultSeverity: 'Minor',
  defaultStatus: 'Open'
};

// Severity rules for bug classification
const SEVERITY_RULES = {
  criticalKeywords: [
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
  ],
  majorKeywords: [
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
  ],
  criticalModules: [
    'authentication', 'auth', 'payment', 'checkout'
  ]
};

// ============================================================================
// SKILL 1: READ EXECUTED TESTCASES
// ============================================================================

/**
 * Read and parse all executed test case Excel files from the specified folder
 * @param {string} folderPath - Path to folder containing test case Excel files
 * @returns {Object} Object containing success status, files array, and total count
 */
function readExecutedTestcases(folderPath) {
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

/**
 * Extract module name from filename
 * @param {string} fileName - Excel filename
 * @returns {string} Clean module name
 */
function extractModuleName(fileName) {
  // Example: "AUTHENTICATION_TestCases.xlsx" -> "Authentication"
  const cleanName = fileName
    .replace('_TestCases.xlsx', '')
    .replace('.xlsx', '')
    .replace(/_/g, ' ');
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
}

// ============================================================================
// SKILL 2: DETECT FAILED TESTCASES
// ============================================================================

/**
 * Filter and collect all test cases with Status = Fail
 * @param {Object} executedTestcases - Object from readExecutedTestcases
 * @returns {Object} Object containing success status, failed test cases array, and summary
 */
function detectFailedTestcases(executedTestcases) {
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

// ============================================================================
// SKILL 3: ASSIGN BUG SEVERITY
// ============================================================================

/**
 * Automatically assign severity (Critical/Major/Minor) to each failed test case
 * @param {Array} failedTestCases - Array of failed test case objects
 * @returns {Object} Object containing success status, bugs array, and severity summary
 */
function assignBugSeverity(failedTestCases) {
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

/**
 * Determine bug severity based on test case details
 * @param {Object} testCase - Failed test case object
 * @returns {Object} Object containing severity level and reason
 */
function determineSeverity(testCase) {
  const description = (testCase.description || '').toLowerCase();
  const actualResult = (testCase.actualResult || '').toLowerCase();
  const type = (testCase.type || '').toLowerCase();
  const module = (testCase.module || '').toLowerCase();
  const combinedText = `${description} ${actualResult} ${type}`.toLowerCase();

  // CRITICAL - System-breaking or blocker issues
  for (const keyword of SEVERITY_RULES.criticalKeywords) {
    if (combinedText.includes(keyword)) {
      return {
        level: 'Critical',
        reason: `System-breaking issue detected: ${keyword}`
      };
    }
  }

  // MAJOR - Functional impact or partial failure
  for (const keyword of SEVERITY_RULES.majorKeywords) {
    if (combinedText.includes(keyword)) {
      return {
        level: 'Major',
        reason: `Functional impact detected: ${keyword}`
      };
    }
  }

  // Module-based severity rules
  for (const criticalModule of SEVERITY_RULES.criticalModules) {
    if (module.includes(criticalModule)) {
      return {
        level: 'Critical',
        reason: `${criticalModule}-related failure`
      };
    }
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

// ============================================================================
// SKILL 4: GENERATE BUG EXCEL
// ============================================================================

/**
 * Generate a comprehensive Bug Report Excel sheet with all detected bugs
 * @param {Array} bugs - Array of bug objects with severity information
 * @param {string} outputPath - Path where the bug report Excel will be saved
 * @returns {Object} Object containing success status, file path, and bug count
 */
function generateBugExcel(bugs, outputPath = './Bug_Report.xlsx') {
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
      status: DEFAULT_CONFIG.defaultStatus, // Default status for new bugs
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
      'Reported By': DEFAULT_CONFIG.reportedBy,
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

/**
 * Map severity to priority level
 * @param {string} severity - Bug severity (Critical, Major, Minor)
 * @returns {string} Priority level (P1, P2, P3, P4)
 */
function mapSeverityToPriority(severity) {
  const priorityMap = {
    'Critical': 'P1',
    'Major': 'P2',
    'Minor': 'P3'
  };
  return priorityMap[severity] || 'P4';
}

/**
 * Generate summary sheet data for Excel
 * @param {Array} bugs - Array of bug objects
 * @returns {Array} Array of objects for summary sheet
 */
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

// ============================================================================
// SKILL 5: UPDATE BUG STATUS
// ============================================================================

/**
 * Update bug status in bug report (Open → In Progress → Closed)
 * @param {string} bugReportPath - Path to bug report Excel file
 * @param {string} bugId - Bug ID to update (e.g., BR-001)
 * @param {string} newStatus - New status (Open, In Progress, In Review, Resolved, Closed, Reopened)
 * @param {string} assignedTo - Developer assigned to fix (optional)
 * @param {string} notes - Additional notes for the bug update (optional)
 * @returns {Object} Object containing success status and updated bug info
 */
function updateBugStatus(bugReportPath, bugId, newStatus, assignedTo = '', notes = '') {
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

    // Find and update bug
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
          data[i]['Notes'] = existingNotes
            ? `${existingNotes}\n\n${new Date().toISOString()}: ${notes}`
            : `${new Date().toISOString()}: ${notes}`;
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

// ============================================================================
// MASTER EXECUTION FLOW
// ============================================================================

/**
 * Master function to generate bug report from test execution results
 * @param {string} testCasesFolder - Path to folder containing test case Excel files
 * @param {string} outputPath - Path where bug report Excel will be saved
 * @returns {Object} Object containing success status and report details
 */
async function generateBugReport(testCasesFolder, outputPath = './Bug_Report.xlsx') {
  console.log('='.repeat(80));
  console.log('BUG REPORTING AGENT');
  console.log('='.repeat(80));
  console.log(`Test Cases Folder: ${testCasesFolder}`);
  console.log(`Bug Report Output: ${outputPath}`);
  console.log('='.repeat(80));

  // STEP 1: Read all executed test cases
  console.log('\n[STEP 1] Reading executed test cases...');
  const readResult = readExecutedTestcases(testCasesFolder);

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
  const detectResult = detectFailedTestcases(readResult);

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
  const severityResult = assignBugSeverity(detectResult.failedTestCases);

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
  const excelResult = generateBugExcel(severityResult.bugs, outputPath);

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

// ============================================================================
// CLI INTERFACE
// ============================================================================

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--test-cases-folder' || args[i] === '-f') {
      parsed.testCasesFolder = args[i + 1];
    } else if (args[i] === '--output' || args[i] === '-o') {
      parsed.outputPath = args[i + 1];
    } else if (args[i] === '--action') {
      parsed.action = args[i + 1];
    } else if (args[i] === '--bug-id') {
      parsed.bugId = args[i + 1];
    } else if (args[i] === '--new-status') {
      parsed.newStatus = args[i + 1];
    } else if (args[i] === '--assigned-to') {
      parsed.assignedTo = args[i + 1];
    } else if (args[i] === '--notes') {
      parsed.notes = args[i + 1];
    } else if (args[i] === '--help' || args[i] === '-h') {
      parsed.help = true;
    }
  }

  return parsed;
}

/**
 * Display help message
 */
function showHelp() {
  console.log('\nBug Reporting Agent - Senior QA Automation Agent\n');
  console.log('Usage:\n');
  console.log('  Generate bug report:');
  console.log('    node bug-reporting-agent.js --test-cases-folder <path> --output <path>');
  console.log('    node bug-reporting-agent.js -f <path> -o <path>\n');
  console.log('  Update bug status:');
  console.log('    node bug-reporting-agent.js --action update-status --bug-id <id> --new-status <status>');
  console.log('    node bug-reporting-agent.js --action update-status --bug-id <id> --new-status <status> --assigned-to <name> --notes <notes>\n');
  console.log('Options:\n');
  console.log('  -f, --test-cases-folder <path>  Folder containing test case Excel files');
  console.log('  -o, --output <path>               Output path for bug report Excel (default: ./Bug_Report.xlsx)');
  console.log('  --action <action>                  Action to perform (generate-report, update-status)');
  console.log('  --bug-id <id>                      Bug ID to update (e.g., BR-001)');
  console.log('  --new-status <status>              New status (Open, In Progress, In Review, Resolved, Closed, Reopened)');
  console.log('  --assigned-to <name>               Developer assigned to fix (optional)');
  console.log('  --notes <notes>                    Additional notes for bug update (optional)');
  console.log('  -h, --help                        Show this help message\n');
  console.log('Examples:\n');
  console.log('  Generate bug report:');
  console.log('    node bug-reporting-agent.js --test-cases-folder ./excel-test-cases/ --output ./Bug_Report.xlsx\n');
  console.log('  Update bug status:');
  console.log('    node bug-reporting-agent.js --action update-status --bug-id BR-001 --new-status "In Progress" --assigned-to "John Doe" --notes "Investigating issue"\n');
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

async function main() {
  const args = parseArgs();

  // Show help if requested
  if (args.help) {
    showHelp();
    process.exit(0);
  }

  // Execute based on action
  if (args.action === 'update-status') {
    // Update bug status
    if (!args.bugId || !args.newStatus) {
      console.error('[ERROR] --bug-id and --new-status are required for update-status action');
      showHelp();
      process.exit(1);
    }

    const updateResult = updateBugStatus(
      args.outputPath || './Bug_Report.xlsx',
      args.bugId,
      args.newStatus,
      args.assignedTo || '',
      args.notes || ''
    );

    if (updateResult.success) {
      console.log(`\n${updateResult.message}`);
      console.log(`Bug Details:`, JSON.stringify(updateResult.bug, null, 2));
      process.exit(0);
    } else {
      console.error(`\n[ERROR] ${updateResult.error}`);
      process.exit(1);
    }
  } else {
    // Generate bug report (default action)
    if (!args.testCasesFolder) {
      console.error('[ERROR] --test-cases-folder is required');
      showHelp();
      process.exit(1);
    }

    const result = await generateBugReport(
      args.testCasesFolder,
      args.outputPath || DEFAULT_CONFIG.bugReportPath
    );

    if (result.success) {
      console.log(`\n${result.message}`);
      console.log(`Bug Report: ${result.bugReportPath}`);
      console.log(`Summary: ${result.summaryPath}`);
      process.exit(0);
    } else {
      console.error(`\n[ERROR] ${result.error}`);
      process.exit(1);
    }
  }
}

// Run main function if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('[FATAL ERROR]', error.message);
    console.error(error.stack);
    process.exit(1);
  });
}

// Export functions for use as a module
module.exports = {
  generateBugReport,
  readExecutedTestcases,
  detectFailedTestcases,
  assignBugSeverity,
  generateBugExcel,
  updateBugStatus,
  determineSeverity,
  mapSeverityToPriority
};
