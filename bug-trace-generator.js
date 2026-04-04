const { chromium } = require('@playwright/test');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read bugs from Bug_Report.xlsx
console.log('==================================================');
console.log('BUG REPORTING AGENT - TRACE GENERATOR');
console.log('==================================================');

const bugReportPath = './Bug_Report.xlsx';
const workbook = XLSX.readFile(bugReportPath);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const bugs = XLSX.utils.sheet_to_json(worksheet);

console.log(`Found ${bugs.length} bugs to generate traces for`);
console.log('==================================================\n');

// Ensure traces directory exists
const tracesDir = './bug-traces';
if (!fs.existsSync(tracesDir)) {
  fs.mkdirSync(tracesDir, { recursive: true });
  console.log(`Created traces directory: ${tracesDir}`);
}

// Function to parse steps from bug report
function parseSteps(stepsText) {
  if (!stepsText) return [];
  return stepsText.split('\r\r\n')
    .map(step => step.trim())
    .filter(step => step.length > 0)
    .map(step => step.replace(/^\d+\.\s*/, '').trim());
}

// Function to generate trace for a bug
async function generateTraceForBug(bug) {
  const { 'Bug ID': bugId, 'Description': description, 'Steps to Reproduce': stepsText, 'Status': status, 'Module': module } = bug;
  const traceFileName = `${bugId}_Trace.zip`;
  const traceFilePath = path.join(tracesDir, traceFileName);

  console.log(`--------------------------------------------------`);
  console.log(`Generating trace for ${bugId}`);
  console.log(`Description: ${description}`);
  console.log(`Status: ${status}`);
  console.log(`Module: ${module}`);
  console.log(`--------------------------------------------------`);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  // Enable tracing
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  const page = await context.newPage();

  // Collect network requests
  const networkRequests = [];
  const networkResponses = [];

  page.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      postData: request.postData(),
      timestamp: Date.now()
    });
  });

  page.on('response', response => {
    networkResponses.push({
      url: response.url(),
      status: response.status(),
      headers: response.headers(),
      timestamp: Date.now()
    });
  });

  // Collect console messages
  const consoleMessages = [];

  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      timestamp: Date.now()
    });
  });

  // Execute the steps to reproduce
  const steps = parseSteps(stepsText);
  console.log(`Executing ${steps.length} steps to reproduce...`);

  let traceDetails = {
    bugId: bugId,
    description: description,
    status: status,
    steps: [],
    networkRequests: [],
    networkResponses: [],
    consoleMessages: [],
    screenshots: [],
    timestamp: new Date().toISOString(),
    executionResult: ''
  };

  try {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      console.log(`  Step ${i + 1}: ${step.substring(0, 50)}...`);

      const stepResult = await executeStep(page, step);
      traceDetails.steps.push({
        stepNumber: i + 1,
        description: step,
        result: stepResult.success ? 'SUCCESS' : 'FAILED',
        error: stepResult.error,
        timestamp: new Date().toISOString()
      });

      if (!stepResult.success) {
        traceDetails.executionResult = `FAILED at step ${i + 1}: ${stepResult.error}`;
        break;
      }

      // Take screenshot after each step
      const screenshotPath = path.join(tracesDir, `${bugId}_step_${i + 1}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      traceDetails.screenshots.push(screenshotPath);

      // Wait for network idle
      await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    }

    traceDetails.executionResult = traceDetails.executionResult || 'COMPLETED';
    traceDetails.networkRequests = networkRequests;
    traceDetails.networkResponses = networkResponses;
    traceDetails.consoleMessages = consoleMessages;

  } catch (error) {
    traceDetails.executionResult = `ERROR: ${error.message}`;
    console.error(`Error generating trace for ${bugId}:`, error);
  }

  // Stop tracing and save trace
  await context.tracing.stop({ path: traceFilePath.replace('.zip', '.zip') });

  // Save detailed trace JSON
  const jsonTracePath = path.join(tracesDir, `${bugId}_Trace.json`);
  fs.writeFileSync(jsonTracePath, JSON.stringify(traceDetails, null, 2));

  await context.close();
  await browser.close();

  console.log(`✓ Trace generated for ${bugId}`);
  console.log(`  Trace file: ${traceFilePath}`);
  console.log(`  JSON details: ${jsonTracePath}`);
  console.log(`\n`);

  return {
    bugId: bugId,
    traceFile: traceFilePath,
    jsonTrace: jsonTracePath,
    success: true
  };
}

// Function to execute individual steps
async function executeStep(page, step) {
  const stepLower = step.toLowerCase();

  try {
    // Navigation steps
    if (stepLower.includes('navigate') || stepLower.includes('go to')) {
      const urlMatch = step.match(/to\s+\/?(\w+)/i);
      if (urlMatch) {
        const path = urlMatch[1];
        await page.goto(`http://localhost:3000/${path}`, { waitUntil: 'networkidle' });
        return { success: true };
      }
    }

    // Click actions
    else if (stepLower.includes('click')) {
      const button = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Sign Up")');
      await button.click();
      return { success: true };
    }

    // Enter text actions
    else if (stepLower.includes('enter') || stepLower.includes('leave empty')) {
      // Handle email field
      if (stepLower.includes('email')) {
        const emailField = page.locator('input[type="email"]');
        if (stepLower.includes('leave') && stepLower.includes('empty')) {
          await emailField.fill('');
        } else {
          const emailMatch = step.match(/["']([^"']+)["']/);
          if (emailMatch) {
            await emailField.fill(emailMatch[1]);
          }
        }
        return { success: true };
      }

      // Handle password field
      if (stepLower.includes('password')) {
        const passwordField = page.locator('input[type="password"]');
        if (stepLower.includes('leave') && stepLower.includes('empty')) {
          await passwordField.fill('');
        } else {
          const passwordMatch = step.match(/["']([^"']+)["']/);
          if (passwordMatch) {
            await passwordField.fill(passwordMatch[1]);
          }
        }
        return { success: true };
      }
    }

    // Wait steps
    else if (stepLower.includes('wait')) {
      await page.waitForTimeout(1000);
      return { success: true };
    }

    return { success: true };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Main execution function
async function generateAllTraces() {
  const results = [];

  for (const bug of bugs) {
    try {
      const result = await generateTraceForBug(bug);
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate trace for ${bug['Bug ID']}:`, error);
      results.push({
        bugId: bug['Bug ID'],
        success: false,
        error: error.message
      });
    }
  }

  // Generate summary
  console.log('==================================================');
  console.log('TRACE GENERATION SUMMARY');
  console.log('==================================================');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total bugs processed: ${results.length}`);
  console.log(`Successful traces: ${successful}`);
  console.log(`Failed traces: ${failed}`);
  console.log(`\nTrace files saved to: ${tracesDir}`);

  // Create mapping file
  const mapping = results.map(r => ({
    'Bug ID': r.bugId,
    'Trace File': r.traceFile,
    'JSON Trace': r.jsonTrace,
    'Status': r.success ? 'Generated' : 'Failed'
  }));

  const mappingPath = path.join(tracesDir, 'bug-trace-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));

  console.log(`Bug trace mapping saved to: ${mappingPath}`);
  console.log('==================================================\n');

  return results;
}

// Execute trace generation
generateAllTraces()
  .then(results => {
    console.log('Trace generation complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during trace generation:', error);
    process.exit(1);
  });
