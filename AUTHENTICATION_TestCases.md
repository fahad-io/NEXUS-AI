# AUTHENTICATION MODULE - TEST CASES

## FRONTEND TEST CASES

### TC-AUTH-FE-001: Login Page - Successful Login
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-001 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /auth/login page |
| **Description** | User successfully logs in with valid credentials |
| **Preconditions** | User has a valid registered account |
| **Steps** | 1. Navigate to /auth/login<br>2. Enter valid email in the email field<br>3. Enter valid password in the password field<br>4. Click "Sign In" button |
| **Expected Result** | User is redirected to /dashboard, authentication state is set, access token is stored |
| **Actual Result** | |

### TC-AUTH-FE-002: Login Page - Invalid Credentials
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-002 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /auth/login page |
| **Description** | User attempts login with invalid credentials |
| **Preconditions** | User is on login page |
| **Steps** | 1. Navigate to /auth/login<br>2. Enter invalid email in the email field<br>3. Enter invalid password in the password field<br>4. Click "Sign In" button |
| **Expected Result** | Error message "Invalid email or password. Please try again." is displayed, user remains on login page |
| **Actual Result** | |

### TC-AUTH-FE-003: Login Page - Empty Email
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-003 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/login page |
| **Description** | User attempts login without entering email |
| **Preconditions** | User is on login page |
| **Steps** | 1. Navigate to /auth/login<br>2. Leave email field empty<br>3. Enter valid password in the password field<br>4. Click "Sign In" button |
| **Expected Result** | Browser's HTML5 validation prevents form submission with empty required email field |
| **Actual Result** | |

### TC-AUTH-FE-004: Login Page - Empty Password
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-004 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/login page |
| **Description** | User attempts login without entering password |
| **Preconditions** | User is on login page |
| **Steps** | 1. Navigate to /auth/login<br>2. Enter valid email in the email field<br>3. Leave password field empty<br>4. Click "Sign In" button |
| **Expected Result** | Browser's HTML5 validation prevents form submission with empty required password field |
| **Actual Result** | |

### TC-AUTH-FE-005: Login Page - Invalid Email Format
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-005 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/login page |
| **Description** | User attempts login with invalid email format |
| **Preconditions** | User is on login page |
| **Steps** | 1. Navigate to /auth/login<br>2. Enter "notanemail" in the email field<br>3. Enter valid password in the password field<br>4. Click "Sign In" button |
| **Expected Result** | Browser's HTML5 email validation prevents form submission |
| **Actual Result** | |

### TC-AUTH-FE-006: Login Page - Remember Me Checkbox
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-006 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /auth/login page |
| **Description** | User checks "Remember me" checkbox during login |
| **Preconditions** | User is on login page |
| **Steps** | 1. Navigate to /auth/login<br>2. Enter valid email and password<br>3. Check "Remember me" checkbox<br>4. Click "Sign In" button |
| **Expected Result** | Checkbox state is toggled, user is successfully logged in (actual remember functionality depends on backend implementation) |
| **Actual Result** | |

### TC-AUTH-FE-007: Login Page - Loading State
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-007 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /auth/login page |
| **Description** | Verify loading state is displayed during login request |
| **Preconditions** | User is on login page with valid credentials entered |
| **Steps** | 1. Navigate to /auth/login<br>2. Enter valid email and password<br>3. Click "Sign In" button |
| **Expected Result** | Button text changes to "Signing in..." and button is disabled during the request |
| **Actual Result** | |

### TC-AUTH-FE-008: Login Page - Continue as Guest
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-008 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /auth/login page |
| **Description** | User continues as guest instead of logging in |
| **Preconditions** | User is on login page |
| **Steps** | 1. Navigate to /auth/login<br>2. Click "Continue as Guest" button |
| **Expected Result** | Guest session is started, user is redirected to /chat |
| **Actual Result** | |

### TC-AUTH-FE-009: Login Page - Navigate to Signup
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-009 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /auth/login page |
| **Description** | User navigates from login to signup page |
| **Preconditions** | User is on login page |
| **Steps** | 1. Navigate to /auth/login<br>2. Click "Sign up" link in the footer text |
| **Expected Result** | User is redirected to /auth/signup page |
| **Actual Result** | |

### TC-AUTH-FE-010: Signup Page - Successful Registration
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-010 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /auth/signup page |
| **Description** | User successfully creates a new account |
| **Preconditions** | User is on signup page with valid new credentials |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter valid full name (2-100 chars)<br>3. Enter valid email<br>4. Enter valid password (min 6 chars)<br>5. Click "Sign Up" button |
| **Expected Result** | User is redirected to /dashboard, authentication state is set, access token is stored |
| **Actual Result** | |

### TC-AUTH-FE-011: Signup Page - Empty Name
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-011 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/signup page |
| **Description** | User attempts signup without entering name |
| **Preconditions** | User is on signup page |
| **Steps** | 1. Navigate to /auth/signup<br>2. Leave name field empty<br>3. Enter valid email and password<br>4. Click "Sign Up" button |
| **Expected Result** | Browser's HTML5 validation prevents form submission with empty required name field |
| **Actual Result** | |

### TC-AUTH-FE-012: Signup Page - Name Below Minimum Length
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-012 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/signup page |
| **Description** | User attempts signup with name less than 2 characters |
| **Preconditions** | User is on signup page |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter "A" (1 character) in name field<br>3. Enter valid email and password<br>4. Click "Sign Up" button |
| **Expected Result** | Form submission is prevented or API returns validation error for name field |
| **Actual Result** | |

### TC-AUTH-FE-013: Signup Page - Name Above Maximum Length
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-013 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/signup page |
| **Description** | User attempts signup with name more than 100 characters |
| **Preconditions** | User is on signup page |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter name with 101 characters<br>3. Enter valid email and password<br>4. Click "Sign Up" button |
| **Expected Result** | Form submission is prevented or API returns validation error for name field |
| **Actual Result** | |

### TC-AUTH-FE-014: Signup Page - Empty Email
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-014 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/signup page |
| **Description** | User attempts signup without entering email |
| **Preconditions** | User is on signup page |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter valid name and password<br>3. Leave email field empty<br>4. Click "Sign Up" button |
| **Expected Result** | Browser's HTML5 validation prevents form submission with empty required email field |
| **Actual Result** | |

### TC-AUTH-FE-015: Signup Page - Invalid Email Format
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-015 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/signup page |
| **Description** | User attempts signup with invalid email format |
| **Preconditions** | User is on signup page |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter valid name and password<br>3. Enter "invalid-email" in email field<br>4. Click "Sign Up" button |
| **Expected Result** | Browser's HTML5 email validation prevents form submission |
| **Actual Result** | |

### TC-AUTH-FE-016: Signup Page - Empty Password
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-016 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/signup page |
| **Description** | User attempts signup without entering password |
| **Preconditions** | User is on signup page |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter valid name and email<br>3. Leave password field empty<br>4. Click "Sign Up" button |
| **Expected Result** | Browser's HTML5 validation prevents form submission with empty required password field |
| **Actual Result** | |

### TC-AUTH-FE-017: Signup Page - Password Below Minimum Length (5 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-017 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/signup page |
| **Description** | User attempts signup with password less than 6 characters (boundary: 5) |
| **Preconditions** | User is on signup page |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter valid name and email<br>3. Enter "12345" (5 characters) in password field<br>4. Click "Sign Up" button |
| **Expected Result** | Frontend validation displays "Password must be at least 6 characters." error message |
| **Actual Result** | |

### TC-AUTH-FE-018: Signup Page - Password At Minimum Length (6 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-018 |
| **Module Name** | Authentication |
| **Type** | Frontend (Boundary) |
| **Page/Component/API** | /auth/signup page |
| **Description** | User successfully signs up with password exactly 6 characters |
| **Preconditions** | User is on signup page with valid new credentials |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter valid name and email<br>3. Enter "123456" (6 characters) in password field<br>4. Click "Sign Up" button |
| **Expected Result** | Form submission proceeds, user is redirected to /dashboard |
| **Actual Result** | |

### TC-AUTH-FE-019: Signup Page - Password Above Maximum Length
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-019 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/signup page |
| **Description** | User attempts signup with password more than 100 characters |
| **Preconditions** | User is on signup page |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter valid name and email<br>3. Enter password with 101 characters<br>4. Click "Sign Up" button |
| **Expected Result** | Form submission is prevented or API returns validation error for password field |
| **Actual Result** | |

### TC-AUTH-FE-020: Signup Page - Loading State
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-020 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /auth/signup page |
| **Description** | Verify loading state is displayed during signup request |
| **Preconditions** | User is on signup page with valid credentials entered |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter valid name, email, and password<br>3. Click "Sign Up" button |
| **Expected Result** | Button text changes to "Creating account..." and button is disabled during the request |
| **Actual Result** | |

### TC-AUTH-FE-021: Signup Page - Duplicate Email
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-021 |
| **Module Name** | Authentication |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /auth/signup page |
| **Description** | User attempts signup with email that already exists |
| **Preconditions** | A user account already exists with the email |
| **Steps** | 1. Navigate to /auth/signup<br>2. Enter valid name<br>3. Enter email that already exists<br>4. Enter valid password<br>5. Click "Sign Up" button |
| **Expected Result** | Error message "Could not create account. Please try again." is displayed |
| **Actual Result** | |

### TC-AUTH-FE-022: Signup Page - Navigate to Login
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-022 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /auth/signup page |
| **Description** | User navigates from signup to login page |
| **Preconditions** | User is on signup page |
| **Steps** | 1. Navigate to /auth/signup<br>2. Click "Sign in" link in the footer text |
| **Expected Result** | User is redirected to /auth/login page |
| **Actual Result** | |

### TC-AUTH-FE-023: Auth State - Token Storage
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-023 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | Authentication system (useAuth hook) |
| **Description** | Verify JWT access token is stored in localStorage after successful login |
| **Preconditions** | User successfully logs in |
| **Steps** | 1. Login with valid credentials<br>2. Check localStorage for 'nexusai_token' key |
| **Expected Result** | 'nexusai_token' key exists in localStorage with valid JWT string |
| **Actual Result** | |

### TC-AUTH-FE-024: Auth State - User Data Storage
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-024 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | Authentication system (useAuth hook) |
| **Description** | Verify user data is stored in localStorage after successful login |
| **Preconditions** | User successfully logs in |
| **Steps** | 1. Login with valid credentials<br>2. Check localStorage for 'nexusai_user' key |
| **Expected Result** | 'nexusai_user' key exists in localStorage with user object containing id, name, and email |
| **Actual Result** | |

### TC-AUTH-FE-025: Protected Route - Dashboard Access
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-025 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard page |
| **Description** | Authenticated user accesses dashboard |
| **Preconditions** | User is logged in with valid token |
| **Steps** | 1. Login with valid credentials<br>2. Navigate to /dashboard |
| **Expected Result** | Dashboard page loads successfully showing user's name |
| **Actual Result** | |

### TC-AUTH-FE-026: Protected Route - Unauthorized Access
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-026 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard page |
| **Description** | Unauthenticated user attempts to access dashboard |
| **Preconditions** | User is not logged in (no token in localStorage) |
| **Steps** | 1. Clear localStorage<br>2. Directly navigate to /dashboard |
| **Expected Result** | User is automatically redirected to /auth/login page |
| **Actual Result** | |

### TC-AUTH-FE-027: Guest Session - Session Creation
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-027 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | Guest session system (useAuth hook) |
| **Description** | Guest session is automatically created on chat page access |
| **Preconditions** | User is not logged in |
| **Steps** | 1. Clear localStorage<br>2. Navigate to /chat page |
| **Expected Result** | Guest session is created with unique UUID stored in 'nexusai_session_id' and 'nexusai_session_expiry' keys |
| **Actual Result** | |

### TC-AUTH-FE-028: Guest Session - Session Expiry
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-028 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | Guest session system |
| **Description** | Guest session expires after 3 hours |
| **Preconditions** | Guest session was created more than 3 hours ago |
| **Steps** | 1. Set 'nexusai_session_expiry' to a timestamp in the past (more than 3 hours ago)<br>2. Navigate to /chat page |
| **Expected Result** | Expired session is detected and cleared, new session is created |
| **Actual Result** | |

### TC-AUTH-FE-029: Guest Session - Banner Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-029 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | GuestBanner component |
| **Description** | Guest session banner is displayed with remaining time |
| **Preconditions** | User is logged in as guest with active session |
| **Steps** | 1. Start guest session<br>2. Navigate to /chat page |
| **Expected Result** | GuestBanner component displays showing remaining session time (3 hours minus elapsed) |
| **Actual Result** | |

### TC-AUTH-FE-030: Guest Session - Banner Dismiss
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-FE-030 |
| **Module Name** | Authentication |
| **Type** | Frontend |
| **Page/Component/API** | GuestBanner component |
| **Description** | User dismisses guest session banner |
| **Preconditions** | Guest banner is displayed on chat page |
| **Steps** | 1. Click "x" (close) button on guest banner |
| **Expected Result** | GuestBanner is hidden from the page |
| **Actual Result** | |

---

## BACKEND TEST CASES

### TC-AUTH-BE-001: POST /auth/signup - Successful Registration
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-001 |
| **Module Name** | Authentication |
| **Type** | Backend |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Create a new user account with valid data |
| **Preconditions** | Email is not already registered in the system |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "test@example.com", "password": "password123" }<br>2. Verify response status code<br>3. Verify response body structure |
| **Expected Result** | HTTP 201 Created, response contains { "access_token": "string", "user": { "id": "string", "name": "string", "email": "string" } }, refresh_token cookie is set |
| **Actual Result** | |

### TC-AUTH-BE-002: POST /auth/signup - Missing Name
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-002 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup without providing name field |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "email": "test@example.com", "password": "password123" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error message for missing name field |
| **Actual Result** | |

### TC-AUTH-BE-003: POST /auth/signup - Name Below Minimum (1 char)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-003 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup with name less than 2 characters (1 char) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "A", "email": "test@example.com", "password": "password123" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: name must be at least 2 characters |
| **Actual Result** | |

### TC-AUTH-BE-004: POST /auth/signup - Name At Minimum (2 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-004 |
| **Module Name** | Authentication |
| **Type** | Backend (Boundary) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup with name exactly 2 characters |
| **Preconditions** | Email is not already registered |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "AB", "email": "test@example.com", "password": "password123" }<br>2. Verify response status code and body |
| **Expected Result** | HTTP 201 Created, account is created successfully |
| **Actual Result** | |

### TC-AUTH-BE-005: POST /auth/signup - Name Above Maximum (101 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-005 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup with name more than 100 characters (101 chars) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "A".repeat(101), "email": "test@example.com", "password": "password123" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: name must not exceed 100 characters |
| **Actual Result** | |

### TC-AUTH-BE-006: POST /auth/signup - Name At Maximum (100 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-006 |
| **Module Name** | Authentication |
| **Type** | Backend (Boundary) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup with name exactly 100 characters |
| **Preconditions** | Email is not already registered |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "A".repeat(100), "email": "test@example.com", "password": "password123" }<br>2. Verify response status code and body |
| **Expected Result** | HTTP 201 Created, account is created successfully |
| **Actual Result** | |

### TC-AUTH-BE-007: POST /auth/signup - Missing Email
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-007 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup without providing email field |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "Test User", "password": "password123" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error message for missing email field |
| **Actual Result** | |

### TC-AUTH-BE-008: POST /auth/signup - Invalid Email Format
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-008 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup with invalid email format |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "notanemail", "password": "password123" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: email must be valid email format |
| **Actual Result** | |

### TC-AUTH-BE-009: POST /auth/signup - Duplicate Email
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-009 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup with email that already exists |
| **Preconditions** | A user with email "existing@example.com" already exists |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "existing@example.com", "password": "password123" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request or 409 Conflict, error message indicating email already exists |
| **Actual Result** | |

### TC-AUTH-BE-010: POST /auth/signup - Missing Password
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-010 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup without providing password field |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "test@example.com" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error message for missing password field |
| **Actual Result** | |

### TC-AUTH-BE-011: POST /auth/signup - Password Below Minimum (5 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-011 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup with password less than 6 characters (5 chars) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "test@example.com", "password": "12345" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: password must be at least 6 characters |
| **Actual Result** | |

### TC-AUTH-BE-012: POST /auth/signup - Password At Minimum (6 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-012 |
| **Module Name** | Authentication |
| **Type** | Backend (Boundary) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup with password exactly 6 characters |
| **Preconditions** | Email is not already registered |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "test@example.com", "password": "123456" }<br>2. Verify response status code and body |
| **Expected Result** | HTTP 201 Created, account is created successfully |
| **Actual Result** | |

### TC-AUTH-BE-013: POST /auth/signup - Password Above Maximum (101 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-013 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/auth/signup |
| **Description** | Attempt signup with password more than 100 characters (101 chars) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/signup with body: { "name": "Test User", "email": "test@example.com", "password": "a".repeat(101) }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: password must not exceed 100 characters |
| **Actual Result** | |

### TC-AUTH-BE-014: POST /auth/login - Successful Login
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-014 |
| **Module Name** | Authentication |
| **Type** | Backend |
| **Page/Component/API** | POST /api/auth/login |
| **Description** | User successfully logs in with valid credentials |
| **Preconditions** | User account exists with valid credentials |
| **Steps** | 1. Send POST request to /api/auth/login with body: { "email": "existing@example.com", "password": "password123" }<br>2. Verify response status code<br>3. Verify response body structure |
| **Expected Result** | HTTP 200 OK, response contains { "access_token": "string", "refresh_token": "string", "user": { "id", "name", "email" } }, refresh_token cookie is set |
| **Actual Result** | |

### TC-AUTH-BE-015: POST /auth/login - Invalid Email
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-015 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/login |
| **Description** | Attempt login with non-existent email |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/login with body: { "email": "nonexistent@example.com", "password": "password123" }<br>2. Verify response status code |
| **Expected Result** | HTTP 401 Unauthorized, error message "Invalid credentials" |
| **Actual Result** | |

### TC-AUTH-BE-016: POST /auth/login - Invalid Password
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-016 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/login |
| **Description** | Attempt login with correct email but wrong password |
| **Preconditions** | User account exists with email "existing@example.com" |
| **Steps** | 1. Send POST request to /api/auth/login with body: { "email": "existing@example.com", "password": "wrongpassword" }<br>2. Verify response status code |
| **Expected Result** | HTTP 401 Unauthorized, error message "Invalid credentials" |
| **Actual Result** | |

### TC-AUTH-BE-017: POST /auth/login - Missing Email
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-017 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/login |
| **Description** | Attempt login without providing email |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/login with body: { "password": "password123" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error for missing email field |
| **Actual Result** | |

### TC-AUTH-BE-018: POST /auth/login - Invalid Email Format
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-018 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/login |
| **Description** | Attempt login with invalid email format |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/login with body: { "email": "notanemail", "password": "password123" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: email must be valid email format |
| **Actual Result** | |

### TC-AUTH-BE-019: POST /auth/login - Missing Password
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-019 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/login |
| **Description** | Attempt login without providing password |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/login with body: { "email": "test@example.com" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error for missing password field |
| **Actual Result** | |

### TC-AUTH-BE-020: POST /auth/login - Password Below Minimum (5 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-020 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/auth/login |
| **Description** | Attempt login with password less than 6 characters |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/auth/login with body: { "email": "test@example.com", "password": "12345" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: password must be at least 6 characters |
| **Actual Result** | |

### TC-AUTH-BE-021: GET /auth/me - Successful User Retrieval
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-021 |
| **Module Name** | Authentication |
| **Type** | Backend |
| **Page/Component/API** | GET /api/auth/me |
| **Description** | Retrieve current authenticated user details |
| **Preconditions** | User has valid JWT access token |
| **Steps** | 1. Send GET request to /api/auth/me with Authorization: Bearer {valid_token}<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains { "user": { "id", "name", "email" } } |
| **Actual Result** | |

### TC-AUTH-BE-022: GET /auth/me - Missing Authorization Header
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-022 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/auth/me |
| **Description** | Attempt to retrieve user without authorization header |
| **Preconditions** | N/A |
| **Steps** | 1. Send GET request to /api/auth/me without Authorization header<br>2. Verify response status code |
| **Expected Result** | HTTP 401 Unauthorized, error message indicating authentication required |
| **Actual Result** | |

### TC-AUTH-BE-023: GET /auth/me - Invalid Token
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-023 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/auth/me |
| **Description** | Attempt to retrieve user with invalid JWT token |
| **Preconditions** | N/A |
| **Steps** | 1. Send GET request to /api/auth/me with Authorization: Bearer invalid_token<br>2. Verify response status code |
| **Expected Result** | HTTP 401 Unauthorized, error message indicating invalid or expired token |
| **Actual Result** | |

### TC-AUTH-BE-024: POST /auth/refresh - Successful Token Refresh
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-024 |
| **Module Name** | Authentication |
| **Type** | Backend |
| **Page/Component/API** | POST /api/auth/refresh |
| **Description** | Refresh access token using valid refresh token cookie |
| **Preconditions** | User has valid refresh_token cookie |
| **Steps** | 1. Send POST request to /api/auth/refresh with refresh_token cookie<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains new { "access_token": "string", "user": { "id", "name", "email" } }, new refresh_token cookie is set |
| **Actual Result** | |

### TC-AUTH-BE-025: POST /auth/refresh - Missing Refresh Token Cookie
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-025 |
| **Module Name** | Authentication |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/auth/refresh |
| **Description** | Attempt token refresh without refresh token cookie |
| **Preconditions** | No refresh_token cookie is present |
| **Steps** | 1. Send POST request to /api/auth/refresh without refresh_token cookie<br>2. Verify response status code |
| **Expected Result** | HTTP 401 Unauthorized, error message "Refresh token is missing" |
| **Actual Result** | |

### TC-AUTH-BE-026: POST /auth/logout - Successful Logout
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-026 |
| **Module Name** | Authentication |
| **Type** | Backend |
| **Page/Component/API** | POST /api/auth/logout |
| **Description** | User successfully logs out |
| **Preconditions** | User is authenticated with valid refresh_token cookie |
| **Steps** | 1. Send POST request to /api/auth/logout with refresh_token cookie<br>2. Verify response status code and cookies |
| **Expected Result** | HTTP 200 OK, response contains { "success": true }, refresh_token cookie is cleared |
| **Actual Result** | |

### TC-AUTH-BE-027: POST /auth/logout - Without Refresh Token
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-BE-027 |
| **Module Name** | Authentication |
| **Type** | Backend |
| **Page/Component/API** | POST /api/auth/logout |
| **Description** | Attempt logout without refresh token cookie |
| **Preconditions** | No refresh_token cookie is present |
| **Steps** | 1. Send POST request to /api/auth/logout without refresh_token cookie<br>2. Verify response status code |
| **Expected Result** | HTTP 200 OK, response contains { "success": true } (logout should still succeed) |
| **Actual Result** | |

---

## INTEGRATION TEST CASES

### TC-AUTH-INT-001: Complete Login Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-INT-001 |
| **Module Name** | Authentication |
| **Type** | Integration |
| **Page/Component/API** | Frontend login + Backend login API |
| **Description** | Verify complete login flow from UI to API to storage |
| **Preconditions** | User has valid registered account |
| **Steps** | 1. Navigate to /auth/login in browser<br>2. Enter valid email and password<br>3. Click "Sign In" button<br>4. Verify API request is sent to POST /api/auth/login<br>5. Verify response is received with access_token<br>6. Verify localStorage contains nexusai_token and nexusai_user<br>7. Verify user is redirected to /dashboard |
| **Expected Result** | All steps complete successfully, user is fully authenticated and can access protected routes |
| **Actual Result** | |

### TC-AUTH-INT-002: Complete Signup Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-INT-002 |
| **Module Name** | Authentication |
| **Type** | Integration |
| **Page/Component/API** | Frontend signup + Backend signup API |
| **Description** | Verify complete signup flow from UI to API to storage |
| **Preconditions** | Email is not already registered |
| **Steps** | 1. Navigate to /auth/signup in browser<br>2. Enter valid name, email, and password<br>3. Click "Sign Up" button<br>4. Verify API request is sent to POST /api/auth/signup<br>5. Verify response is received with access_token<br>6. Verify localStorage contains nexusai_token and nexusai_user<br>7. Verify user is redirected to /dashboard |
| **Expected Result** | All steps complete successfully, new account is created and user is fully authenticated |
| **Actual Result** | |

### TC-AUTH-INT-003: Frontend Error Display on API Failure
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-INT-003 |
| **Module Name** | Authentication |
| **Type** | Integration (Negative) |
| **Page/Component/API** | Frontend login + Backend login API |
| **Description** | Verify frontend properly displays error message on API failure |
| **Preconditions** | Backend service is running but credentials are invalid |
| **Steps** | 1. Navigate to /auth/login in browser<br>2. Enter invalid email or password<br>3. Click "Sign In" button<br>4. Verify API returns 401 Unauthorized<br>5. Verify error message is displayed on the page |
| **Expected Result** | Error message "Invalid email or password. Please try again." is displayed to user, form remains for retry |
| **Actual Result** | |

### TC-AUTH-INT-004: Guest Session Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-INT-004 |
| **Module Name** | Authentication |
| **Type** | Integration |
| **Page/Component/API** | Guest session creation and management |
| **Description** | Verify guest session creation, storage, and usage in chat |
| **Preconditions** | User is not logged in |
| **Steps** | 1. Clear all localStorage<br>2. Navigate to /chat page<br>3. Verify guest session is created (nexusai_session_id and nexusai_session_expiry)<br>4. Verify session expiry is set to 3 hours from now<br>5. Send a chat message<br>6. Verify message is associated with guest session |
| **Expected Result** | Guest session is created with valid UUID, 3-hour expiry, and can be used for chat without authentication |
| **Actual Result** | |

### TC-AUTH-INT-005: Token Refresh Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-INT-005 |
| **Module Name** | Authentication |
| **Type** | Integration |
| **Page/Component/API** | Token refresh mechanism |
| **Description** | Verify token refresh using refresh token cookie |
| **Preconditions** | User has valid refresh_token cookie |
| **Steps** | 1. Login and obtain refresh_token cookie<br>2. Wait for access token to approach expiration<br>3. Send request to POST /api/auth/refresh with refresh_token cookie<br>4. Verify new access_token is returned<br>5. Verify new refresh_token cookie is set<br>6. Verify new token works for authenticated requests |
| **Expected Result** | Token refresh completes successfully, new tokens are issued, user remains authenticated without re-login |
| **Actual Result** | |

### TC-AUTH-INT-006: Protected Route Access Control
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-INT-006 |
| **Module Name** | Authentication |
| **Type** | Integration |
| **Page/Component/API** | Frontend route protection |
| **Description** | Verify protected routes redirect unauthenticated users to login |
| **Preconditions** | User is not logged in |
| **Steps** | 1. Clear localStorage (remove nexusai_token)<br>2. Directly navigate to /dashboard in browser<br>3. Verify redirect occurs<br>4. Verify final URL is /auth/login |
| **Expected Result** | Unauthenticated user is automatically redirected to /auth/login when attempting to access protected route |
| **Actual Result** | |

### TC-AUTH-INT-007: Logout Clears Authentication State
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AUTH-INT-007 |
| **Module Name** | Authentication |
| **Type** | Integration |
| **Page/Component/API** | Logout process |
| **Description** | Verify logout clears all authentication state and cookies |
| **Preconditions** | User is logged in with valid tokens |
| **Steps** | 1. Verify localStorage contains nexusai_token and nexusai_user<br>2. Verify refresh_token cookie is present<br>3. Call logout function / API<br>4. Verify nexusai_token is removed from localStorage<br>5. Verify nexusai_user is removed from localStorage<br>6. Verify refresh_token cookie is cleared<br>7. Attempt to access protected route |
| **Expected Result** | All authentication state is cleared, user is redirected to login page, protected routes are inaccessible |
| **Actual Result** | |
