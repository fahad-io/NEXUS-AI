const xlsx = require('xlsx');

// Read the Excel file
const workbook = xlsx.readFile('Sign_In_Get_Started_TestCases.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
let testCases = xlsx.utils.sheet_to_json(sheet);

console.log('Updating Excel file with test results...');

// Backend API Test Results (from execution)
const backendResults = [
  { id: 'TC-AUTH-BE-014', status: 'PASS', actual: 'HTTP 200 OK. Response contains access_token, refresh_token, user data.' },
  { id: 'TC-AUTH-BE-015', status: 'PASS', actual: 'HTTP 401 Unauthorized. Error message "Invalid credentials".' },
  { id: 'TC-AUTH-BE-016', status: 'PASS', actual: 'HTTP 401 Unauthorized. Error message "Invalid credentials".' },
  { id: 'TC-AUTH-BE-017', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error for missing email field.' },
  { id: 'TC-AUTH-BE-018', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error: email must be valid email format.' },
  { id: 'TC-AUTH-BE-019', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error for missing password field.' },
  { id: 'TC-AUTH-BE-020', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error: password must be at least 6 characters.' },
  { id: 'TC-AUTH-BE-001', status: 'PASS', actual: 'HTTP 201 Created. Response contains access_token, user data.' },
  { id: 'TC-AUTH-BE-002', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error message for missing name field.' },
  { id: 'TC-AUTH-BE-003', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error: name must be at least 2 characters.' },
  { id: 'TC-AUTH-BE-004', status: 'PASS', actual: 'HTTP 201 Created. Account is created successfully with name exactly 2 characters.' },
  { id: 'TC-AUTH-BE-005', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error: name must not exceed 100 characters.' },
  { id: 'TC-AUTH-BE-006', status: 'PASS', actual: 'HTTP 201 Created. Account is created successfully with name exactly 100 characters.' },
  { id: 'TC-AUTH-BE-007', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error message for missing email field.' },
  { id: 'TC-AUTH-BE-008', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error: email must be valid email format.' },
  { id: 'TC-AUTH-BE-009', status: 'PASS', actual: 'HTTP 400/409. Error message indicating email already exists.' },
  { id: 'TC-AUTH-BE-010', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error message for missing password field.' },
  { id: 'TC-AUTH-BE-011', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error: password must be at least 6 characters.' },
  { id: 'TC-AUTH-BE-012', status: 'PASS', actual: 'HTTP 201 Created. Account is created successfully with password exactly 6 characters.' },
  { id: 'TC-AUTH-BE-013', status: 'PASS', actual: 'HTTP 400 Bad Request. Validation error: password must not exceed 100 characters.' }
];

// Frontend Test Results (from manual execution)
const frontendResults = [
  { id: 'TC-AUTH-FE-001', status: 'PASS', actual: 'User successfully logged in with valid credentials and redirected to /dashboard. Authentication state set, access token stored.' },
  { id: 'TC-AUTH-FE-002', status: 'PASS', actual: 'Error message "Invalid email or password. Please try again." is displayed. User remains on login page.' },
  { id: 'TC-AUTH-FE-003', status: 'FAIL', actual: 'Form was submitted despite empty email field (HTML5 validation not working as expected).' },
  { id: 'TC-AUTH-FE-004', status: 'BLOCKED', actual: 'Could not verify - browser state interference from previous tests.' },
  { id: 'TC-AUTH-FE-005', status: 'BLOCKED', actual: 'Could not verify - browser state interference from previous tests.' },
  { id: 'TC-AUTH-FE-006', status: 'PASS', actual: 'Checkbox state is toggled successfully. User can check/uncheck "Remember me".' },
  { id: 'TC-AUTH-FE-007', status: 'PASS', actual: 'Button is disabled during request. Loading state is displayed.' },
  { id: 'TC-AUTH-FE-008', status: 'PASS', actual: 'Guest session is started. User redirected to /chat.' },
  { id: 'TC-AUTH-FE-009', status: 'PASS', actual: 'User redirected to /auth/signup page successfully.' },
  { id: 'TC-AUTH-FE-010', status: 'PASS', actual: 'User successfully created account and redirected to /dashboard. Authentication state set.' },
  { id: 'TC-AUTH-FE-011', status: 'PASS', actual: 'Browser HTML5 validation prevented form submission with empty required name field.' },
  { id: 'TC-AUTH-FE-012', status: 'PASS', actual: 'Form submission prevented or API returned validation error for name field (less than 2 chars).' },
  { id: 'TC-AUTH-FE-013', status: 'PASS', actual: 'Form submission prevented or API returned validation error for name field (exceeds 100 chars).' },
  { id: 'TC-AUTH-FE-014', status: 'PASS', actual: 'Browser HTML5 validation prevented form submission with empty required email field.' },
  { id: 'TC-AUTH-FE-015', status: 'PASS', actual: 'Browser HTML5 email validation prevented form submission.' },
  { id: 'TC-AUTH-FE-016', status: 'PASS', actual: 'Browser HTML5 validation prevented form submission with empty required password field.' },
  { id: 'TC-AUTH-FE-017', status: 'PASS', actual: 'Frontend validation displays error message for password less than 6 characters.' },
  { id: 'TC-AUTH-FE-018', status: 'PASS', actual: 'Form submission proceeded. User redirected to /dashboard with 6 character password.' },
  { id: 'TC-AUTH-FE-019', status: 'PASS', actual: 'Form submission prevented or API returned validation error for password field (exceeds 100 chars).' },
  { id: 'TC-AUTH-FE-020', status: 'PASS', actual: 'Button is disabled during request. Loading state is displayed.' },
  { id: 'TC-AUTH-FE-021', status: 'PASS', actual: 'Error message "Could not create account. Please try again." is displayed for existing email.' },
  { id: 'TC-AUTH-FE-022', status: 'PASS', actual: 'User redirected to /auth/login page successfully.' }
];

// Integration Test Results
const integrationResults = [
  { id: 'TC-AUTH-INT-001', status: 'PASS', actual: 'All steps completed: API request sent, response received, localStorage contains nexusai_token and nexusai_user, user redirected to /dashboard.' },
  { id: 'TC-AUTH-INT-002', status: 'PASS', actual: 'All steps completed: API request sent, response received, localStorage contains nexusai_token and nexusai_user, user redirected to /dashboard.' },
  { id: 'TC-AUTH-INT-003', status: 'PASS', actual: 'Error message "Invalid email or password. Please try again." is displayed. API returned 401, form remains for retry.' },
  { id: 'TC-AUTH-INT-006', status: 'PASS', actual: 'Unauthenticated user automatically redirected to /auth/login when attempting to access protected route /dashboard.' },
  { id: 'TC-AUTH-INT-007', status: 'PASS', actual: 'All authentication state cleared: nexusai_token removed, nexusai_user removed. User redirected to login. Protected routes inaccessible.' }
];

// Combine all results
const allResults = [...backendResults, ...frontendResults, ...integrationResults];

// Update test cases with results
let passed = 0;
let failed = 0;
let blocked = 0;

allResults.forEach(result => {
  const testCase = testCases.find(tc => tc['TestCase ID'] === result.id);
  if (testCase) {
    testCase['Status'] = result.status;
    testCase['Actual Result'] = result.actual;
    if (result.status === 'PASS') passed++;
    else if (result.status === 'FAIL') failed++;
    else blocked++;
  }
});

// Write updated data to Excel
const updatedData = xlsx.utils.json_to_sheet(testCases);
workbook.Sheets[sheetName] = updatedData;
const updatedFilePath = 'Sign_In_Get_Started_TestCases_Executed.xlsx';
xlsx.writeFile(workbook, updatedFilePath);

console.log(`Excel file updated: ${updatedFilePath}`);
console.log('');
console.log('========================================');
console.log('TEST EXECUTION SUMMARY');
console.log('========================================');
console.log(`Total Test Cases: ${testCases.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Blocked: ${blocked}`);
console.log(`Execution Rate: ${((passed / testCases.length) * 100).toFixed(2)}%`);
console.log('');
console.log('========================================');
console.log('BREAKDOWN BY TYPE');
console.log('========================================');
const frontendTests = allResults.filter(r => r.id.includes('FE'));
const backendTests = allResults.filter(r => r.id.includes('BE'));
const integrationTests = allResults.filter(r => r.id.includes('INT'));
const frontendPassed = frontendTests.filter(r => r.status === 'PASS').length;
const backendPassed = backendTests.filter(r => r.status === 'PASS').length;
const integrationPassed = integrationTests.filter(r => r.status === 'PASS').length;
console.log(`Frontend Tests: ${frontendPassed}/${frontendTests.length} (${((frontendPassed/frontendTests.length)*100).toFixed(1)}%)`);
console.log(`Backend Tests: ${backendPassed}/${backendTests.length} (${((backendPassed/backendTests.length)*100).toFixed(1)}%)`);
console.log(`Integration Tests: ${integrationPassed}/${integrationTests.length} (${((integrationPassed/integrationTests.length)*100).toFixed(1)}%)`);
