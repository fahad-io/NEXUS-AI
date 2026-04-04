const XLSX = require('xlsx');
const fs = require('fs');

// Test cases for Sign In and Get Started (Signup) functionality
const testCases = [
  // FRONTEND - SIGN IN
  {
    testCaseId: 'TC-AUTH-FE-001',
    moduleName: 'Authentication',
    type: 'Frontend',
    pageComponentApi: '/auth/login page',
    description: 'User successfully logs in with valid credentials',
    preconditions: 'User has a valid registered account',
    steps: '1. Navigate to /auth/login\n2. Enter valid email in email field\n3. Enter valid password in password field\n4. Click "Sign In" button',
    expectedResult: 'User is redirected to /dashboard, authentication state is set, access token is stored',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-002',
    moduleName: 'Authentication',
    type: 'Frontend',
    pageComponentApi: '/auth/login page',
    description: 'User attempts login with invalid credentials',
    preconditions: 'User is on login page',
    steps: '1. Navigate to /auth/login\n2. Enter invalid email in email field\n3. Enter invalid password in password field\n4. Click "Sign In" button',
    expectedResult: 'Error message "Invalid email or password. Please try again." is displayed, user remains on login page',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-003',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/login page',
    description: 'User attempts login without entering email',
    preconditions: 'User is on login page',
    steps: '1. Navigate to /auth/login\n2. Leave email field empty\n3. Enter valid password in password field\n4. Click "Sign In" button',
    expectedResult: 'Browser\'s HTML5 validation prevents form submission with empty required email field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-004',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/login page',
    description: 'User attempts login without entering password',
    preconditions: 'User is on login page',
    steps: '1. Navigate to /auth/login\n2. Enter valid email in email field\n3. Leave password field empty\n4. Click "Sign In" button',
    expectedResult: 'Browser\'s HTML5 validation prevents form submission with empty required password field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-005',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/login page',
    description: 'User attempts login with invalid email format',
    preconditions: 'User is on login page',
    steps: '1. Navigate to /auth/login\n2. Enter "notanemail" in email field\n3. Enter valid password in password field\n4. Click "Sign In" button',
    expectedResult: 'Browser\'s HTML5 email validation prevents form submission',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-006',
    moduleName: 'Authentication',
    type: 'Frontend',
    pageComponentApi: '/auth/login page',
    description: 'User checks "Remember me" checkbox during login',
    preconditions: 'User is on login page',
    steps: '1. Navigate to /auth/login\n2. Enter valid email and password\n3. Check "Remember me" checkbox\n4. Click "Sign In" button',
    expectedResult: 'Checkbox state is toggled, user is successfully logged in (actual remember functionality depends on backend implementation)',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-007',
    moduleName: 'Authentication',
    type: 'Frontend',
    pageComponentApi: '/auth/login page',
    description: 'Verify loading state is displayed during login request',
    preconditions: 'User is on login page with valid credentials entered',
    steps: '1. Navigate to /auth/login\n2. Enter valid email and password\n3. Click "Sign In" button',
    expectedResult: 'Button text changes to "Signing in..." and button is disabled during request',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-008',
    moduleName: 'Authentication',
    type: 'Frontend',
    pageComponentApi: '/auth/login page',
    description: 'User continues as guest instead of logging in',
    preconditions: 'User is on login page',
    steps: '1. Navigate to /auth/login\n2. Click "Continue as Guest" button',
    expectedResult: 'Guest session is started, user is redirected to /chat',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-009',
    moduleName: 'Authentication',
    type: 'Frontend',
    pageComponentApi: '/auth/login page',
    description: 'User navigates from login to signup page',
    preconditions: 'User is on login page',
    steps: '1. Navigate to /auth/login\n2. Click "Sign up" link in footer text',
    expectedResult: 'User is redirected to /auth/signup page',
    actualResult: ''
  },
  // FRONTEND - GET STARTED (SIGNUP)
  {
    testCaseId: 'TC-AUTH-FE-010',
    moduleName: 'Authentication',
    type: 'Frontend',
    pageComponentApi: '/auth/signup page',
    description: 'User successfully creates a new account',
    preconditions: 'User is on signup page with valid new credentials',
    steps: '1. Navigate to /auth/signup\n2. Enter valid full name (2-100 chars)\n3. Enter valid email\n4. Enter valid password (min 6 chars)\n5. Click "Sign Up" button',
    expectedResult: 'User is redirected to /dashboard, authentication state is set, access token is stored',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-011',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/signup page',
    description: 'User attempts signup without entering name',
    preconditions: 'User is on signup page',
    steps: '1. Navigate to /auth/signup\n2. Leave name field empty\n3. Enter valid email and password\n4. Click "Sign Up" button',
    expectedResult: 'Browser\'s HTML5 validation prevents form submission with empty required name field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-012',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/signup page',
    description: 'User attempts signup with name less than 2 characters',
    preconditions: 'User is on signup page',
    steps: '1. Navigate to /auth/signup\n2. Enter "A" (1 character) in name field\n3. Enter valid email and password\n4. Click "Sign Up" button',
    expectedResult: 'Form submission is prevented or API returns validation error for name field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-013',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/signup page',
    description: 'User attempts signup with name more than 100 characters',
    preconditions: 'User is on signup page',
    steps: '1. Navigate to /auth/signup\n2. Enter name with 101 characters\n3. Enter valid email and password\n4. Click "Sign Up" button',
    expectedResult: 'Form submission is prevented or API returns validation error for name field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-014',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/signup page',
    description: 'User attempts signup without entering email',
    preconditions: 'User is on signup page',
    steps: '1. Navigate to /auth/signup\n2. Enter valid name and password\n3. Leave email field empty\n4. Click "Sign Up" button',
    expectedResult: 'Browser\'s HTML5 validation prevents form submission with empty required email field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-015',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/signup page',
    description: 'User attempts signup with invalid email format',
    preconditions: 'User is on signup page',
    steps: '1. Navigate to /auth/signup\n2. Enter valid name and password\n3. Enter "invalid-email" in email field\n4. Click "Sign Up" button',
    expectedResult: 'Browser\'s HTML5 email validation prevents form submission',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-016',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/signup page',
    description: 'User attempts signup without entering password',
    preconditions: 'User is on signup page',
    steps: '1. Navigate to /auth/signup\n2. Enter valid name and email\n3. Leave password field empty\n4. Click "Sign Up" button',
    expectedResult: 'Browser\'s HTML5 validation prevents form submission with empty required password field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-017',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/signup page',
    description: 'User attempts signup with password less than 6 characters (boundary: 5)',
    preconditions: 'User is on signup page',
    steps: '1. Navigate to /auth/signup\n2. Enter valid name and email\n3. Enter "12345" (5 characters) in password field\n4. Click "Sign Up" button',
    expectedResult: 'Frontend validation displays "Password must be at least 6 characters." error message',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-018',
    moduleName: 'Authentication',
    type: 'Frontend (Boundary)',
    pageComponentApi: '/auth/signup page',
    description: 'User successfully signs up with password exactly 6 characters',
    preconditions: 'User is on signup page with valid new credentials',
    steps: '1. Navigate to /auth/signup\n2. Enter valid name and email\n3. Enter "123456" (6 characters) in password field\n4. Click "Sign Up" button',
    expectedResult: 'Form submission proceeds, user is redirected to /dashboard',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-019',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/signup page',
    description: 'User attempts signup with password more than 100 characters',
    preconditions: 'User is on signup page',
    steps: '1. Navigate to /auth/signup\n2. Enter valid name and email\n3. Enter password with 101 characters\n4. Click "Sign Up" button',
    expectedResult: 'Form submission is prevented or API returns validation error for password field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-020',
    moduleName: 'Authentication',
    type: 'Frontend',
    pageComponentApi: '/auth/signup page',
    description: 'Verify loading state is displayed during signup request',
    preconditions: 'User is on signup page with valid credentials entered',
    steps: '1. Navigate to /auth/signup\n2. Enter valid name, email, and password\n3. Click "Sign Up" button',
    expectedResult: 'Button text changes to "Creating account..." and button is disabled during request',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-021',
    moduleName: 'Authentication',
    type: 'Frontend (Negative)',
    pageComponentApi: '/auth/signup page',
    description: 'User attempts signup with email that already exists',
    preconditions: 'A user account already exists with email',
    steps: '1. Navigate to /auth/signup\n2. Enter valid name\n3. Enter email that already exists\n4. Enter valid password\n5. Click "Sign Up" button',
    expectedResult: 'Error message "Could not create account. Please try again." is displayed',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-FE-022',
    moduleName: 'Authentication',
    type: 'Frontend',
    pageComponentApi: '/auth/signup page',
    description: 'User navigates from signup to login page',
    preconditions: 'User is on signup page',
    steps: '1. Navigate to /auth/signup\n2. Click "Sign in" link in footer text',
    expectedResult: 'User is redirected to /auth/login page',
    actualResult: ''
  },
  // BACKEND - SIGN IN
  {
    testCaseId: 'TC-AUTH-BE-014',
    moduleName: 'Authentication',
    type: 'Backend',
    pageComponentApi: 'POST /api/auth/login',
    description: 'User successfully logs in with valid credentials',
    preconditions: 'User account exists with valid credentials',
    steps: '1. Send POST request to /api/auth/login with body: { "email": "existing@example.com", "password": "password123" }\n2. Verify response status code\n3. Verify response body structure',
    expectedResult: 'HTTP 200 OK, response contains { "access_token": "string", "refresh_token": "string", "user": { "id", "name", "email" } }, refresh_token cookie is set',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-015',
    moduleName: 'Authentication',
    type: 'Backend (Negative)',
    pageComponentApi: 'POST /api/auth/login',
    description: 'Attempt login with non-existent email',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/login with body: { "email": "nonexistent@example.com", "password": "password123" }\n2. Verify response status code',
    expectedResult: 'HTTP 401 Unauthorized, error message "Invalid credentials"',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-016',
    moduleName: 'Authentication',
    type: 'Backend (Negative)',
    pageComponentApi: 'POST /api/auth/login',
    description: 'Attempt login with correct email but wrong password',
    preconditions: 'User account exists with email "existing@example.com"',
    steps: '1. Send POST request to /api/auth/login with body: { "email": "existing@example.com", "password": "wrongpassword" }\n2. Verify response status code',
    expectedResult: 'HTTP 401 Unauthorized, error message "Invalid credentials"',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-017',
    moduleName: 'Authentication',
    type: 'Backend (Negative)',
    pageComponentApi: 'POST /api/auth/login',
    description: 'Attempt login without providing email',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/login with body: { "password": "password123" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error for missing email field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-018',
    moduleName: 'Authentication',
    type: 'Backend (Negative)',
    pageComponentApi: 'POST /api/auth/login',
    description: 'Attempt login with invalid email format',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/login with body: { "email": "notanemail", "password": "password123" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error: email must be valid email format',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-019',
    moduleName: 'Authentication',
    type: 'Backend (Negative)',
    pageComponentApi: 'POST /api/auth/login',
    description: 'Attempt login without providing password',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/login with body: { "email": "test@example.com" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error for missing password field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-020',
    moduleName: 'Authentication',
    type: 'Backend (Negative/Boundary)',
    pageComponentApi: 'POST /api/auth/login',
    description: 'Attempt login with password less than 6 characters',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/login with body: { "email": "test@example.com", "password": "12345" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error: password must be at least 6 characters',
    actualResult: ''
  },
  // BACKEND - GET STARTED (SIGNUP)
  {
    testCaseId: 'TC-AUTH-BE-001',
    moduleName: 'Authentication',
    type: 'Backend',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Create a new user account with valid data',
    preconditions: 'Email is not already registered in system',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "test@example.com", "password": "password123" }\n2. Verify response status code\n3. Verify response body structure',
    expectedResult: 'HTTP 201 Created, response contains { "access_token": "string", "user": { "id": "string", "name": "string", "email": "string" } }, refresh_token cookie is set',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-002',
    moduleName: 'Authentication',
    type: 'Backend (Negative)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup without providing name field',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/signup with body: { "email": "test@example.com", "password": "password123" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error message for missing name field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-003',
    moduleName: 'Authentication',
    type: 'Backend (Negative/Boundary)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup with name less than 2 characters (1 char)',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "A", "email": "test@example.com", "password": "password123" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error: name must be at least 2 characters',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-004',
    moduleName: 'Authentication',
    type: 'Backend (Boundary)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup with name exactly 2 characters',
    preconditions: 'Email is not already registered',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "AB", "email": "test@example.com", "password": "password123" }\n2. Verify response status code and body',
    expectedResult: 'HTTP 201 Created, account is created successfully',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-005',
    moduleName: 'Authentication',
    type: 'Backend (Negative/Boundary)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup with name more than 100 characters (101 chars)',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "A".repeat(101), "email": "test@example.com", "password": "password123" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error: name must not exceed 100 characters',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-006',
    moduleName: 'Authentication',
    type: 'Backend (Boundary)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup with name exactly 100 characters',
    preconditions: 'Email is not already registered',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "A".repeat(100), "email": "test@example.com", "password": "password123" }\n2. Verify response status code and body',
    expectedResult: 'HTTP 201 Created, account is created successfully',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-007',
    moduleName: 'Authentication',
    type: 'Backend (Negative)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup without providing email field',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "Test User", "password": "password123" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error message for missing email field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-008',
    moduleName: 'Authentication',
    type: 'Backend (Negative)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup with invalid email format',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "notanemail", "password": "password123" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error: email must be valid email format',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-009',
    moduleName: 'Authentication',
    type: 'Backend (Negative)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup with email that already exists',
    preconditions: 'A user with email "existing@example.com" already exists',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "existing@example.com", "password": "password123" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request or 409 Conflict, error message indicating email already exists',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-010',
    moduleName: 'Authentication',
    type: 'Backend (Negative)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup without providing password field',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "test@example.com" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error message for missing password field',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-011',
    moduleName: 'Authentication',
    type: 'Backend (Negative/Boundary)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup with password less than 6 characters (5 chars)',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "test@example.com", "password": "12345" }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error: password must be at least 6 characters',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-012',
    moduleName: 'Authentication',
    type: 'Backend (Boundary)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup with password exactly 6 characters',
    preconditions: 'Email is not already registered',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "test@example.com", "password": "123456" }\n2. Verify response status code and body',
    expectedResult: 'HTTP 201 Created, account is created successfully',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-BE-013',
    moduleName: 'Authentication',
    type: 'Backend (Negative/Boundary)',
    pageComponentApi: 'POST /api/auth/signup',
    description: 'Attempt signup with password more than 100 characters (101 chars)',
    preconditions: 'N/A',
    steps: '1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "test@example.com", "password": "a".repeat(101) }\n2. Verify response status code',
    expectedResult: 'HTTP 400 Bad Request, validation error: password must not exceed 100 characters',
    actualResult: ''
  },
  // INTEGRATION TESTS
  {
    testCaseId: 'TC-AUTH-INT-001',
    moduleName: 'Authentication',
    type: 'Integration',
    pageComponentApi: 'Frontend login + Backend login API',
    description: 'Verify complete login flow from UI to API to storage',
    preconditions: 'User has valid registered account',
    steps: '1. Navigate to /auth/login in browser\n2. Enter valid email and password\n3. Click "Sign In" button\n4. Verify API request is sent to POST /api/auth/login\n5. Verify response is received with access_token\n6. Verify localStorage contains nexusai_token and nexusai_user\n7. Verify user is redirected to /dashboard',
    expectedResult: 'All steps complete successfully, user is fully authenticated and can access protected routes',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-INT-002',
    moduleName: 'Authentication',
    type: 'Integration',
    pageComponentApi: 'Frontend signup + Backend signup API',
    description: 'Verify complete signup flow from UI to API to storage',
    preconditions: 'Email is not already registered',
    steps: '1. Navigate to /auth/signup in browser\n2. Enter valid name, email, and password\n3. Click "Sign Up" button\n4. Verify API request is sent to POST /api/auth/signup\n5. Verify response is received with access_token\n6. Verify localStorage contains nexusai_token and nexusai_user\n7. Verify user is redirected to /dashboard',
    expectedResult: 'All steps complete successfully, new account is created and user is fully authenticated',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-INT-003',
    moduleName: 'Authentication',
    type: 'Integration (Negative)',
    pageComponentApi: 'Frontend login + Backend login API',
    description: 'Verify frontend properly displays error message on API failure',
    preconditions: 'Backend service is running but credentials are invalid',
    steps: '1. Navigate to /auth/login in browser\n2. Enter invalid email or password\n3. Click "Sign In" button\n4. Verify API returns 401 Unauthorized\n5. Verify error message is displayed on page',
    expectedResult: 'Error message "Invalid email or password. Please try again." is displayed to user, form remains for retry',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-INT-006',
    moduleName: 'Authentication',
    type: 'Integration',
    pageComponentApi: 'Frontend route protection',
    description: 'Verify protected routes redirect unauthenticated users to login',
    preconditions: 'User is not logged in',
    steps: '1. Clear localStorage (remove nexusai_token)\n2. Directly navigate to /dashboard in browser\n3. Verify redirect occurs\n4. Verify final URL is /auth/login',
    expectedResult: 'Unauthenticated user is automatically redirected to /auth/login when attempting to access protected route',
    actualResult: ''
  },
  {
    testCaseId: 'TC-AUTH-INT-007',
    moduleName: 'Authentication',
    type: 'Integration',
    pageComponentApi: 'Logout process',
    description: 'Verify logout clears all authentication state and cookies',
    preconditions: 'User is logged in with valid tokens',
    steps: '1. Verify localStorage contains nexusai_token and nexusai_user\n2. Verify refresh_token cookie is present\n3. Call logout function / API\n4. Verify nexusai_token is removed from localStorage\n5. Verify nexusai_user is removed from localStorage\n6. Verify refresh_token cookie is cleared\n7. Attempt to access protected route',
    expectedResult: 'All authentication state is cleared, user is redirected to login page, protected routes are inaccessible',
    actualResult: ''
  }
];

// Create Excel file
function createExcelFile() {
  const worksheetData = [
    ['TestCase ID', 'Module Name', 'Type', 'Page/Component/API', 'Description', 'Preconditions', 'Steps', 'Expected Result', 'Actual Result']
  ];

  // Add test cases as rows
  testCases.forEach(tc => {
    worksheetData.push([
      tc.testCaseId,
      tc.moduleName,
      tc.type,
      tc.pageComponentApi,
      tc.description,
      tc.preconditions,
      tc.steps,
      tc.expectedResult,
      tc.actualResult
    ]);
  });

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sign In & Get Started');

  // Set column widths
  const colWidths = [
    { wch: 18 }, // TestCase ID
    { wch: 15 }, // Module Name
    { wch: 22 }, // Type
    { wch: 30 }, // Page/Component/API
    { wch: 50 }, // Description
    { wch: 40 }, // Preconditions
    { wch: 60 }, // Steps
    { wch: 60 }, // Expected Result
    { wch: 15 }  // Actual Result
  ];
  worksheet['!cols'] = colWidths;

  // Add styles for header row
  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: '4F81BD' } }
  };

  // Write file
  const outputPath = './Sign_In_Get_Started_TestCases.xlsx';
  XLSX.writeFile(workbook, outputPath);
  console.log(`Created: ${outputPath}`);
  console.log(`Total test cases: ${testCases.length}`);
  console.log(`- Frontend (Sign In): 9`);
  console.log(`- Frontend (Get Started/Signup): 13`);
  console.log(`- Backend (Sign In): 7`);
  console.log(`- Backend (Signup): 13`);
  console.log(`- Integration: 4`);
}

createExcelFile();
