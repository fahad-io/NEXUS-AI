# FORMS MODULE - TEST CASES

## FRONTEND TEST CASES

### TC-FORM-FE-001: Contact Form - Page Load
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-001 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend |
| **Page/Component/API** | Contact form page |
| **Description** | Verify contact form page loads and displays all fields |
| **Preconditions** | N/A |
| **Steps** | 1. Navigate to contact form page<br>2. Verify form is visible<br>3. Verify name field exists<br>4. Verify email field exists<br>5. Verify message textarea exists<br>6. Verify submit button exists |
| **Expected Result** | Contact form loads with all required fields: name, email, message, and submit button |
| **Actual Result** | |

### TC-FORM-FE-002: Contact Form - Valid Submission
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-002 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend |
| **Page/Component/API** | Contact form |
| **Description** | User submits contact form with valid data |
| **Preconditions** | User is on contact form page |
| **Steps** | 1. Enter valid name (2-100 chars)<br>2. Enter valid email<br>3. Enter valid message (10-2000 chars)<br>4. Click submit button<br>5. Verify success message appears |
| **Expected Result** | Form submits successfully, success message "Thank you for contacting us! We will get back to you shortly." is displayed |
| **Actual Result** | |

### TC-FORM-FE-003: Contact Form - Empty Name
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-003 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | Contact form |
| **Description** | User attempts to submit contact form without name |
| **Preconditions** | User is on contact form page |
| **Steps** | 1. Leave name field empty<br>2. Enter valid email and message<br>3. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns validation error for missing name field |
| **Actual Result** | |

### TC-FORM-FE-004: Contact Form - Name Below Minimum (1 char)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-004 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Negative/Boundary) |
| **Page/Component/API** | Contact form |
| **Description** | User attempts to submit with name less than 2 characters (1 char) |
| **Preconditions** | User is on contact form page |
| **Steps** | 1. Enter "A" (1 character) in name field<br>2. Enter valid email and message<br>3. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns error: name must be at least 2 characters |
| **Actual Result** | |

### TC-FORM-FE-005: Contact Form - Name At Minimum (2 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-005 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Boundary) |
| **Page/Component/API** | Contact form |
| **Description** | User submits contact form with name exactly 2 characters |
| **Preconditions** | User is on contact form page with valid data |
| **Steps** | 1. Enter "AB" (2 characters) in name field<br>2. Enter valid email and message<br>3. Click submit button |
| **Expected Result** | Form submits successfully, 2-character name is accepted |
| **Actual Result** | |

### TC-FORM-FE-006: Contact Form - Name Above Maximum (101 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-006 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Negative/Boundary) |
| **Page/Component/API** | Contact form |
| **Description** | User attempts to submit with name more than 100 characters (101 chars) |
| **Preconditions** | User is on contact form page |
| **Steps** | 1. Enter name with 101 characters<br>2. Enter valid email and message<br>3. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns error: name must not exceed 100 characters |
| **Actual Result** | |

### TC-FORM-FE-007: Contact Form - Name At Maximum (100 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-007 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Boundary) |
| **Page/Component/API** | Contact form |
| **Description** | User submits contact form with name exactly 100 characters |
| **Preconditions** | User is on contact form page with valid data |
| **Steps** | 1. Enter name with 100 characters<br>2. Enter valid email and message<br>3. Click submit button |
| **Expected Result** | Form submits successfully, 100-character name is accepted |
| **Actual Result** | |

### TC-FORM-FE-008: Contact Form - Empty Email
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-008 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | Contact form |
| **Description** | User attempts to submit contact form without email |
| **Preconditions** | User is on contact form page |
| **Steps** | 1. Leave email field empty<br>2. Enter valid name and message<br>3. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns validation error for missing email field |
| **Actual Result** | |

### TC-FORM-FE-009: Contact Form - Invalid Email Format
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-009 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | Contact form |
| **Description** | User attempts to submit with invalid email format |
| **Preconditions** | User is on contact form page |
| **Steps** | 1. Enter "notanemail" in email field<br>2. Enter valid name and message<br>3. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns error: email must be valid format |
| **Actual Result** | |

### TC-FORM-FE-010: Contact Form - Empty Message
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-010 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | Contact form |
| **Description** | User attempts to submit contact form without message |
| **Preconditions** | User is on contact form page |
| **Steps** | 1. Leave message field empty<br>2. Enter valid name and email<br>3. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns validation error for missing message field |
| **Actual Result** | |

### TC-FORM-FE-011: Contact Form - Message Below Minimum (9 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-011 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Negative/Boundary) |
| **Page/Component/API** | Contact form |
| **Description** | User attempts to submit with message less than 10 characters (9 chars) |
| **Preconditions** | User is on contact form page |
| **Steps** | 1. Enter "123456789" (9 characters) in message field<br>2. Enter valid name and email<br>3. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns error: message must be at least 10 characters |
| **Actual Result** | |

### TC-FORM-FE-012: Contact Form - Message At Minimum (10 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-012 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Boundary) |
| **Page/Component/API** | Contact form |
| **Description** | User submits contact form with message exactly 10 characters |
| **Preconditions** | User is on contact form page with valid data |
| **Steps** | 1. Enter "1234567890" (10 characters) in message field<br>2. Enter valid name and email<br>3. Click submit button |
| **Expected Result** | Form submits successfully, 10-character message is accepted |
| **Actual Result** | |

### TC-FORM-FE-013: Contact Form - Message Above Maximum (2001 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-013 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Negative/Boundary) |
| **Page/Component/API** | Contact form |
| **Description** | User attempts to submit with message more than 2000 characters (2001 chars) |
| **Preconditions** | User is on contact form page |
| **Steps** | 1. Enter message with 2001 characters<br>2. Enter valid name and email<br>3. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns error: message must not exceed 2000 characters |
| **Actual Result** | |

### TC-FORM-FE-014: Contact Form - Message At Maximum (2000 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-014 |
| **Module Name** | Forms - Contact |
| **Type** | Frontend (Boundary) |
| **Page/Component/API** | Contact form |
| **Description** | User submits contact form with message exactly 2000 characters |
| **Preconditions** | User is on contact form page with valid data |
| **Steps** | 1. Enter message with 2000 characters<br>2. Enter valid name and email<br>3. Click submit button |
| **Expected Result** | Form submits successfully, 2000-character message is accepted |
| **Actual Result** | |

### TC-FORM-FE-015: Feedback Form - Page Load
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-015 |
| **Module Name** | Forms - Feedback |
| **Type** | Frontend |
| **Page/Component/API** | Feedback form page |
| **Description** | Verify feedback form page loads and displays all fields |
| **Preconditions** | N/A |
| **Steps** | 1. Navigate to feedback form page<br>2. Verify form is visible<br>3. Verify rating field exists (1-5 stars)<br>4. Verify message textarea exists<br>5. Verify optional page field exists<br>6. Verify submit button exists |
| **Expected Result** | Feedback form loads with fields: rating (1-5), message, optional page field, and submit button |
| **Actual Result** | |

### TC-FORM-FE-016: Feedback Form - Valid Submission
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-016 |
| **Module Name** | Forms - Feedback |
| **Type** | Frontend |
| **Page/Component/API** | Feedback form |
| **Description** | User submits feedback form with valid data |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Select rating (e.g., 5 stars)<br>2. Enter message text<br>3. Optionally enter page<br>4. Click submit button<br>5. Verify success message appears |
| **Expected Result** | Form submits successfully, success message "Thank you for your feedback!" is displayed |
| **Actual Result** | |

### TC-FORM-FE-017: Feedback Form - Empty Message
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-017 |
| **Module Name** | Forms - Feedback |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | Feedback form |
| **Description** | User attempts to submit feedback form without message |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Select a rating<br>2. Leave message field empty<br>3. Click submit button |
| **Expected Result** | Form submits successfully (message may be optional per DTO) or validation error if required |
| **Actual Result** | |

### TC-FORM-FE-018: Feedback Form - Rating Below Minimum (0)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-018 |
| **Module Name** | Forms - Feedback |
| **Type** | Frontend (Negative/Boundary) |
| **Page/Component/API** | Feedback form |
| **Description** | User attempts to submit with rating below minimum (0) |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Select rating of 0 (if allowed) or do not select rating<br>2. Enter message<br>3. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns error: rating must be at least 1 |
| **Actual Result** | |

### TC-FORM-FE-019: Feedback Form - Rating At Minimum (1)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-019 |
| **Module Name** | Forms - Feedback |
| **Type** | Frontend (Boundary) |
| **Page/Component/API** | Feedback form |
| **Description** | User submits feedback form with rating exactly 1 |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Select rating of 1 star<br>2. Enter message<br>3. Click submit button |
| **Expected Result** | Form submits successfully, rating of 1 is accepted |
| **Actual Result** | |

### TC-FORM-FE-020: Feedback Form - Rating At Maximum (5)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-020 |
| **Module Name** | Forms - Feedback |
| **Type** | Frontend (Boundary) |
| **Page/Component/API** | Feedback form |
| **Description** | User submits feedback form with rating exactly 5 |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Select rating of 5 stars<br>2. Enter message<br>3. Click submit button |
| **Expected Result** | Form submits successfully, rating of 5 is accepted |
| **Actual Result** | |

### TC-FORM-FE-021: Feedback Form - Rating Above Maximum (6)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-021 |
| **Module Name** | Forms - Feedback |
| **Type** | Frontend (Negative/Boundary) |
| **Page/Component/API** | Feedback form |
| **Description** | User attempts to submit with rating above maximum (6) |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Attempt to select rating of 6 (if UI allows)<br>2. Enter message<br>3. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns error: rating must not exceed 5 |
| **Actual Result** | |

### TC-FORM-FE-022: Feedback Form - Page Field Above Maximum (201 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-022 |
| **Module Name** | Forms - Feedback |
| **Type** | Frontend (Negative/Boundary) |
| **Page/Component/API** | Feedback form |
| **Description** | User enters page field with more than 200 characters (201 chars) |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Select rating<br>2. Enter message<br>3. Enter page with 201 characters<br>4. Click submit button |
| **Expected Result** | Browser validation prevents submission or API returns error: page must not exceed 200 characters |
| **Actual Result** | |

### TC-FORM-FE-023: Feedback Form - Page Field At Maximum (200 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-023 |
| **Module Name** | Forms - Feedback |
| **Type** | Frontend (Boundary) |
| **Page/Component/API** | Feedback form |
| **Description** | User submits feedback form with page field exactly 200 characters |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Select rating<br>2. Enter message<br>3. Enter page with 200 characters<br>4. Click submit button |
| **Expected Result** | Form submits successfully, 200-character page is accepted |
| **Actual Result** | |

### TC-FORM-FE-024: Feedback Form - Optional Page Field
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-FE-024 |
| **Module Name** | Forms - Feedback |
| **Type** | Frontend |
| **Page/Component/API** | Feedback form |
| **Description** | User submits feedback form without page field |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Select rating<br>2. Enter message<br>3. Leave page field empty<br>4. Click submit button |
| **Expected Result** | Form submits successfully, page is not required (optional field) |
| **Actual Result** | |

---

## BACKEND TEST CASES

### TC-FORM-BE-001: POST /forms/contact - Successful Submission
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-001 |
| **Module Name** | Forms - Contact |
| **Type** | Backend |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Submit contact form with valid data |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "name": "Test User", "email": "test@example.com", "message": "This is a test message with sufficient length." }<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains { "success": true, "message": "Thank you for contacting us! We will get back to you shortly." } |
| **Actual Result** | |

### TC-FORM-BE-002: POST /forms/contact - Missing Name
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-002 |
| **Module Name** | Forms - Contact |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Attempt to submit contact form without name |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "email": "test@example.com", "message": "Test message" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: name is required |
| **Actual Result** | |

### TC-FORM-BE-003: POST /forms/contact - Name Below Minimum (1 char)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-003 |
| **Module Name** | Forms - Contact |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Attempt to submit with name less than 2 characters (1 char) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "name": "A", "email": "test@example.com", "message": "Test message" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: name must be at least 2 characters |
| **Actual Result** | |

### TC-FORM-BE-004: POST /forms/contact - Name At Minimum (2 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-004 |
| **Module Name** | Forms - Contact |
| **Type** | Backend (Boundary) |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Submit contact form with name exactly 2 characters |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "name": "AB", "email": "test@example.com", "message": "Test message" }<br>2. Verify response status code |
| **Expected Result** | HTTP 200 OK, form submits successfully |
| **Actual Result** | |

### TC-FORM-BE-005: POST /forms/contact - Name Above Maximum (101 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-005 |
| **Module Name** | Forms - Contact |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Attempt to submit with name more than 100 characters (101 chars) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "name": "A".repeat(101), "email": "test@example.com", "message": "Test" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: name must not exceed 100 characters |
| **Actual Result** | |

### TC-FORM-BE-006: POST /forms/contact - Missing Email
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-006 |
| **Module Name** | Forms - Contact |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Attempt to submit contact form without email |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "name": "Test User", "message": "Test message" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: email is required |
| **Actual Result** | |

### TC-FORM-BE-007: POST /forms/contact - Invalid Email Format
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-007 |
| **Module Name** | Forms - Contact |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Attempt to submit with invalid email format |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "name": "Test User", "email": "notanemail", "message": "Test message" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: email must be valid email format |
| **Actual Result** | |

### TC-FORM-BE-008: POST /forms/contact - Missing Message
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-008 |
| **Module Name** | Forms - Contact |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Attempt to submit contact form without message |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "name": "Test User", "email": "test@example.com" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: message is required |
| **Actual Result** | |

### TC-FORM-BE-009: POST /forms/contact - Message Below Minimum (9 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-009 |
| **Module Name** | Forms - Contact |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Attempt to submit with message less than 10 characters (9 chars) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "name": "Test User", "email": "test@example.com", "message": "123456789" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: message must be at least 10 characters |
| **Actual Result** | |

### TC-FORM-BE-010: POST /forms/contact - Message At Minimum (10 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-010 |
| **Module Name** | Forms - Contact |
| **Type** | Backend (Boundary) |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Submit contact form with message exactly 10 characters |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "name": "Test User", "email": "test@example.com", "message": "1234567890" }<br>2. Verify response status code |
| **Expected Result** | HTTP 200 OK, form submits successfully |
| **Actual Result** | |

### TC-FORM-BE-011: POST /forms/contact - Message Above Maximum (2001 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-011 |
| **Module Name** | Forms - Contact |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/forms/contact |
| **Description** | Attempt to submit with message more than 2000 characters (2001 chars) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/contact with body: { "name": "Test User", "email": "test@example.com", "message": "A".repeat(2001) }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: message must not exceed 2000 characters |
| **Actual Result** | |

### TC-FORM-BE-012: POST /forms/feedback - Successful Submission
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-012 |
| **Module Name** | Forms - Feedback |
| **Type** | Backend |
| **Page/Component/API** | POST /api/forms/feedback |
| **Description** | Submit feedback form with valid data |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/feedback with body: { "rating": 5, "message": "Great experience!", "page": "/dashboard" }<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains { "success": true, "message": "Thank you for your feedback!" } |
| **Actual Result** | |

### TC-FORM-BE-013: POST /forms/feedback - Missing Rating
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-013 |
| **Module Name** | Forms - Feedback |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/forms/feedback |
| **Description** | Attempt to submit feedback form without rating |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/feedback with body: { "message": "Test feedback" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: rating is required |
| **Actual Result** | |

### TC-FORM-BE-014: POST /forms/feedback - Rating Below Minimum (0)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-014 |
| **Module Name** | Forms - Feedback |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/forms/feedback |
| **Description** | Attempt to submit with rating below minimum (0) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/feedback with body: { "rating": 0, "message": "Test" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: rating must be at least 1 |
| **Actual Result** | |

### TC-FORM-BE-015: POST /forms/feedback - Rating At Minimum (1)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-015 |
| **Module Name** | Forms - Feedback |
| **Type** | Backend (Boundary) |
| **Page/Component/API** | POST /api/forms/feedback |
| **Description** | Submit feedback form with rating exactly 1 |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/feedback with body: { "rating": 1, "message": "Test" }<br>2. Verify response status code |
| **Expected Result** | HTTP 200 OK, form submits successfully |
| **Actual Result** | |

### TC-FORM-BE-016: POST /forms/feedback - Rating Above Maximum (6)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-016 |
| **Module Name** | Forms - Feedback |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/forms/feedback |
| **Description** | Attempt to submit with rating above maximum (6) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/feedback with body: { "rating": 6, "message": "Test" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: rating must not exceed 5 |
| **Actual Result** | |

### TC-FORM-BE-017: POST /forms/feedback - Page Above Maximum (201 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-017 |
| **Module Name** | Forms - Feedback |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/forms/feedback |
| **Description** | Attempt to submit with page field more than 200 characters (201 chars) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/feedback with body: { "rating": 5, "message": "Test", "page": "A".repeat(201) }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: page must not exceed 200 characters |
| **Actual Result** | |

### TC-FORM-BE-018: POST /forms/feedback - Page At Maximum (200 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-018 |
| **Module Name** | Forms - Feedback |
| **Type** | Backend (Boundary) |
| **Page/Component/API** | POST /api/forms/feedback |
| **Description** | Submit feedback form with page field exactly 200 characters |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/feedback with body: { "rating": 5, "message": "Test", "page": "A".repeat(200) }<br>2. Verify response status code |
| **Expected Result** | HTTP 200 OK, form submits successfully |
| **Actual Result** | |

### TC-FORM-BE-019: POST /forms/feedback - Without Page Field
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-BE-019 |
| **Module Name** | Forms - Feedback |
| **Type** | Backend |
| **Page/Component/API** | POST /api/forms/feedback |
| **Description** | Submit feedback form without optional page field |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/forms/feedback with body: { "rating": 5, "message": "Test feedback" }<br>2. Verify response status code |
| **Expected Result** | HTTP 200 OK, form submits successfully without page field |
| **Actual Result** | |

---

## INTEGRATION TEST CASES

### TC-FORM-INT-001: Complete Contact Form Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-INT-001 |
| **Module Name** | Forms - Contact |
| **Type** | Integration |
| **Page/Component/API** | Frontend contact form + Backend contact API |
| **Description** | Verify complete contact form submission flow |
| **Preconditions** | User is on contact form page |
| **Steps** | 1. Fill in all fields with valid data<br>2. Click submit button<br>3. Verify API request to POST /api/forms/contact<br>4. Verify success response<br>5. Verify success message displays in UI |
| **Expected Result** | Contact form data is sent to API, success response received, success message displayed |
| **Actual Result** | |

### TC-FORM-INT-002: Complete Feedback Form Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-INT-002 |
| **Module Name** | Forms - Feedback |
| **Type** | Integration |
| **Page/Component/API** | Frontend feedback form + Backend feedback API |
| **Description** | Verify complete feedback form submission flow |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Select rating (e.g., 4 stars)<br>2. Fill in message field<br>3. Optionally fill in page field<br>4. Click submit button<br>5. Verify API request to POST /api/forms/feedback<br>6. Verify success response<br>7. Verify success message displays in UI |
| **Expected Result** | Feedback form data is sent to API, success response received, success message displayed |
| **Actual Result** | |

### TC-FORM-INT-003: Form Validation Error Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-INT-003 |
| **Module Name** | Forms |
| **Type** | Integration (Negative) |
| **Page/Component/API** | Frontend form + Backend validation error |
| **Description** | Verify frontend displays validation errors from backend |
| **Preconditions** | User is on contact or feedback form page |
| **Steps** | 1. Submit form with invalid data (e.g., name: "A")<br>2. Verify API returns validation error<br>3. Verify error message displays in UI |
| **Expected Result** | Backend validation error is displayed to user in the UI |
| **Actual Result** | |

### TC-FORM-INT-004: Form Submission Without Page (Feedback)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-FORM-INT-004 |
| **Module Name** | Forms - Feedback |
| **Type** | Integration |
| **Page/Component/API** | Feedback form without page |
| **Description** | Verify feedback can be submitted without optional page field |
| **Preconditions** | User is on feedback form page |
| **Steps** | 1. Select rating<br>2. Enter message<br>3. Leave page field empty<br>4. Click submit button<br>5. Verify API request includes only rating and message |
| **Expected Result** | Feedback submits successfully without page field, API accepts the partial data |
| **Actual Result** | |
