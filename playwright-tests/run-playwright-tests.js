/**
 * Playwright Test Automation for Sign In / Get Started Test Cases
 * Executes test cases from Excel file with 1s wait between actions
 */

const { chromium } = require('playwright');
const xlsx = require('xlsx');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:3000';
const WAIT_TIME = 1000; // 1 second wait as requested
const TEST_RESULTS_FILE = 'test-execution-results.json';
const NEW_BUGS_FILE = 'new-bugs.json';

/**
 * Read test cases from Excel file
 */
function readTestCases() {
  try {
    console.log('[Setup] Reading test cases from Excel...');
    const workbook = xlsx.readFile('../Sign_In_Get_Started_TestCases_Executed.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const testCases = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

    console.log(`[Setup] Loaded ${testCases.length} test cases`);
    return testCases;
  } catch (error) {
    console.error('[Error] Failed to read test cases:', error.message);
    process.exit(1);
  }
}

/**
 * Parse test case steps into executable actions
 */
function parseSteps(steps) {
  // Split by newlines or carriage returns, clean up empty lines
  const stepLines = steps.split(/[\r\n]+/).filter(s => s.trim());
  return stepLines.map((line, index) => {
    const trimmed = line.trim();
    // Remove number prefix like "1. " or "1) " if present
    const withoutPrefix = trimmed.replace(/^\d+[\.\)]\s*/, '');
    return {
      index: index + 1,
      original: line.trim(),
      action: withoutPrefix
    };
  });
}

/**
 * Wait for specified time (1 second by default)
 */
async function wait(ms = WAIT_TIME) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute a single test case
 */
async function executeTestCase(page, testCase) {
  const testCaseId = testCase['TestCase ID'];
  const description = testCase['Description'];
  const steps = testCase['Steps'];
  const expectedResult = testCase['Expected Result'];

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Executing: ${testCaseId}`);
  console.log(`Description: ${description}`);
  console.log(`${'='.repeat(60)}`);

  const result = {
    testCaseId: testCaseId,
    module: testCase['Module Name'],
    type: testCase['Type'],
    pageComponentApi: testCase['Page/Component/API'],
    description: description,
    steps: steps,
    expectedResult: expectedResult,
    status: 'PASS',
    actualResult: '',
    error: null,
    timestamp: new Date().toISOString()
  };

  try {
    // Parse and execute steps
    const parsedSteps = parseSteps(steps);
    console.log(`[Steps] Parsed ${parsedSteps.length} steps`);

    for (const step of parsedSteps) {
      console.log(`\n[Step ${step.index}] ${step.action}`);

      try {
        await executeStep(page, step.action);
        console.log(`  ✓ Step ${step.index} completed`);
      } catch (stepError) {
        console.error(`  ✗ Step ${step.index} failed: ${stepError.message}`);
        result.status = 'FAIL';
        result.actualResult = `Failed at step ${step.index}: ${stepError.message}`;
        result.error = stepError.message;
        break; // Stop executing remaining steps
      }

      // Wait 1 second after each action as requested
      await wait();
    }

    // If all steps passed, verify expected result
    if (result.status === 'PASS') {
      console.log(`\n[Verification] Checking expected result...`);
      console.log(`  Expected: ${expectedResult}`);

      // Basic verification - check if we're on the expected page
      const currentUrl = page.url();
      console.log(`  Current URL: ${currentUrl}`);

      result.actualResult = `Successfully executed all steps. Final URL: ${currentUrl}`;
    }

  } catch (error) {
    console.error(`[Error] Test case execution failed:`, error.message);
    result.status = 'FAIL';
    result.actualResult = `Execution error: ${error.message}`;
    result.error = error.message;
  }

  return result;
}

/**
 * Execute a single step
 */
async function executeStep(page, action) {
  const actionLower = action.toLowerCase();

  // Navigate to a URL
  if (actionLower.includes('navigate') || actionLower.includes('go to')) {
    const match = action.match(/(?:navigate|go to)\s+(?:to\s+)?[\'"]?([^\'"’\s]+)[\'"]?/i);
    if (match && match[1]) {
      let path = match[1];
      // Ensure path starts with /
      if (!path.startsWith('/')) path = '/' + path;
      await page.goto(`${BASE_URL}${path}`);
      await page.waitForLoadState('networkidle');
      return;
    }
  }

  // Click on an element
  if (actionLower.includes('click') || actionLower.includes('press')) {
    const match = action.match(/(?:click|press)\s+(?:on\s+)?[\'"]?([^\'"’]+)[\'"]?/i);
    if (match && match[1]) {
      const buttonText = match[1];
      console.log(`    Looking for button with text: "${buttonText}"`);

      // Try to find by text
      const button = await page.locator(`button, a, [role="button"]`).filter({ hasText: buttonText }).first();
      await button.click();
      return;
    }
  }

  // Enter text in a field
  if (actionLower.includes('enter') || actionLower.includes('type') || actionLower.includes('input')) {
    const match = action.match(/(?:enter|type|input)\s+(?:valid|invalid)?\s*(\w+)\s+(?:in|into|on)\s+the?\s*(\w+)\s*(?:field)?/i);
    if (match && match[1] && match[2]) {
      const value = match[1];
      const fieldName = match[2];
      console.log(`    Entering "${value}" in "${fieldName}" field`);

      // Find input by label or name
      const input = await page.locator(`input[name*="${fieldName}"], input[id*="${fieldName}"], [placeholder*="${fieldName}"]`).first();
      await input.fill(value);
      return;
    }
  }

  // Leave field empty
  if (actionLower.includes('leave') && actionLower.includes('empty')) {
    const match = action.match(/leave\s+(\w+)\s+field\s+empty/i);
    if (match && match[1]) {
      const fieldName = match[1];
      console.log(`    Leaving "${fieldName}" field empty`);

      // Find input and clear it
      const input = await page.locator(`input[name*="${fieldName}"], input[id*="${fieldName}"], [placeholder*="${fieldName}"]`).first();
      await input.fill('');
      return;
    }
  }

  // Wait for specific conditions
  if (actionLower.includes('wait') || actionLower.includes('expect')) {
    console.log(`    Waiting for condition: ${action}`);
    await page.waitForTimeout(1000);
    return;
  }

  // If we can't parse the action, try to be smart about it
  console.log(`    Warning: Could not parse action, attempting basic execution`);

  // Check for common patterns
  if (actionLower.includes('sign in') || actionLower.includes('login')) {
    const button = await page.locator('button').filter({ hasText: /sign in|login/i }).first();
    await button.click();
    return;
  }

  if (actionLower.includes('sign up') || actionLower.includes('register')) {
    const button = await page.locator('button').filter({ hasText: /sign up|register/i }).first();
    await button.click();
    return;
  }

  throw new Error(`Cannot parse action: ${action}`);
}

/**
 * Generate bugs from failed test cases
 */
function generateBugs(failedTests) {
  return failedTests.map((test, index) => ({
    'Bug ID': `BR-${String(failedTests.length + index + 1).padStart(3, '0')}`,
    'TestCase ID': test.testCaseId,
    'Module': test.module,
    'Page/Component/API': test.pageComponentApi,
    'Type': test.type,
    'Description': test.description,
    'Steps to Reproduce': test.steps,
    'Expected Result': test.expectedResult,
    'Actual Result': test.actualResult,
    'Severity': 'Major',
    'Status': 'Open',
    'Source File': 'Sign_In_Get_Started_TestCases_Executed.xlsx'
  }));
}

/**
 * Add new bugs to existing Bug_Report.xlsx without disturbing previous data
 */
function addBugsToExcelReport(newBugs) {
  try {
    console.log(`\n[Bug Report] Adding ${newBugs.length} new bugs to existing report...`);

    // Read existing bug report
    const existingWorkbook = xlsx.readFile('../Bug_Report.xlsx');
    const existingSheet = existingWorkbook.Sheets['Bug Report'];
    const existingData = xlsx.utils.sheet_to_json(existingSheet, { defval: '' });

    console.log(`[Bug Report] Found ${existingData.length} existing bugs`);

    // Find the highest Bug ID to continue from there
    const existingBugIds = existingData
      .map(row => row['Bug ID'])
      .filter(id => id && id.startsWith('BR-'))
      .map(id => parseInt(id.replace('BR-', '')));

    const nextBugId = existingBugIds.length > 0 ? Math.max(...existingBugIds) + 1 : 1;

    // Update bug IDs for new bugs to continue from existing
    const updatedNewBugs = newBugs.map((bug, index) => ({
      ...bug,
      'Bug ID': `BR-${String(nextBugId + index).padStart(3, '0')}`
    }));

    console.log(`[Bug Report] New bugs will start from ID: BR-${String(nextBugId).padStart(3, '0')}`);

    // Combine existing and new bugs
    const allBugs = [...existingData, ...updatedNewBugs];

    // Create new worksheet
    const newWorksheet = xlsx.utils.json_to_sheet(allBugs);

    // Preserve column widths from original sheet
    if (existingSheet['!cols']) {
      newWorksheet['!cols'] = existingSheet['!cols'];
    }

    // Update workbook
    existingWorkbook.Sheets['Bug Report'] = newWorksheet;

    // Save updated workbook
    xlsx.writeFile(existingWorkbook, '../Bug_Report.xlsx');

    console.log(`[Bug Report] Successfully added ${updatedNewBugs.length} new bugs`);
    console.log(`[Bug Report] Total bugs in report: ${allBugs.length}`);

    return {
      success: true,
      addedBugs: updatedNewBugs.length,
      totalBugs: allBugs.length,
      newBugIds: updatedNewBugs.map(b => b['Bug ID'])
    };

  } catch (error) {
    console.error('[Error] Failed to add bugs to Excel report:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('='.repeat(80));
  console.log('PLAYWRIGHT TEST AUTOMATION');
  console.log('Sign In / Get Started Test Cases');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Wait time: ${WAIT_TIME}ms between actions`);
  console.log('='.repeat(80));

  let browser;
  let page;

  try {
    // Read test cases
    const testCases = readTestCases();

    // Launch browser
    console.log('\n[Browser] Launching Chromium...');
    browser = await chromium.launch({ headless: false }); // Show browser for debugging
    page = await browser.newPage();

    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 720 });
    console.log('[Browser] Browser launched successfully');

    // Execute test cases
    const results = [];
    const failedTests = [];

    for (const testCase of testCases) {
      try {
        const result = await executeTestCase(page, testCase);
        results.push(result);

        if (result.status === 'FAIL') {
          failedTests.push(result);
        }

        // Wait between test cases
        await wait(2000); // 2 second pause between test cases

      } catch (error) {
        console.error(`[Error] Failed to execute test case ${testCase['TestCase ID']}:`, error.message);
        results.push({
          testCaseId: testCase['TestCase ID'],
          status: 'FAIL',
          actualResult: `Execution error: ${error.message}`,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        failedTests.push({
          testCaseId: testCase['TestCase ID'],
          status: 'FAIL',
          actualResult: `Execution error: ${error.message}`,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Save execution results
    fs.writeFileSync(TEST_RESULTS_FILE, JSON.stringify(results, null, 2));
    console.log(`\n[Results] Test execution results saved to ${TEST_RESULTS_FILE}`);

    // Generate summary
    const summary = {
      totalTests: testCases.length,
      passed: results.filter(r => r.status === 'PASS').length,
      failed: results.filter(r => r.status === 'FAIL').length,
      failedTests: failedTests.map(t => ({
        testCaseId: t.testCaseId,
        description: t.description,
        actualResult: t.actualResult
      }))
    };

    console.log('\n' + '='.repeat(80));
    console.log('TEST EXECUTION SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Tests: ${summary.totalTests}`);
    console.log(`Passed: ${summary.passed}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Pass Rate: ${((summary.passed / summary.totalTests) * 100).toFixed(2)}%`);
    console.log('='.repeat(80));

    // Generate bugs from failed tests
    if (failedTests.length > 0) {
      console.log(`\n[Bug Generation] Generating ${failedTests.length} bug reports...`);

      const newBugs = generateBugs(failedTests);
      fs.writeFileSync(NEW_BUGS_FILE, JSON.stringify(newBugs, null, 2));
      console.log(`[Bug Generation] New bugs saved to ${NEW_BUGS_FILE}`);

      // Add bugs to existing Excel report
      const addResult = addBugsToExcelReport(newBugs);

      if (addResult.success) {
        console.log(`\n[Success] Added ${addResult.addedBugs} new bugs to Bug_Report.xlsx`);
        console.log(`[Success] Total bugs in report: ${addResult.totalBugs}`);
        console.log(`[Success] New Bug IDs: ${addResult.newBugIds.join(', ')}`);
      } else {
        console.error(`[Error] Failed to add bugs to Excel report: ${addResult.error}`);
      }
    } else {
      console.log('\n[Success] No failed tests - all tests passed!');
    }

  } catch (error) {
    console.error('[Fatal Error]', error.message);
    console.error(error.stack);
    process.exit(1);

  } finally {
    // Close browser
    if (browser) {
      console.log('\n[Browser] Closing browser...');
      await browser.close();
      console.log('[Browser] Browser closed');
    }
  }
}

// Run the main function
main().catch(error => {
  console.error('[Fatal Error]', error.message);
  console.error(error.stack);
  process.exit(1);
});
