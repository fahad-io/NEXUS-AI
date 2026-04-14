# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-validation.spec.ts >> Authentication Form Validation Tests >> Verify HTML5 validation attributes exist on login form
- Location: tests\auth-validation.spec.ts:104:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.getAttribute: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - link "NexusAI" [ref=e5] [cursor=pointer]:
      - /url: /
      - img [ref=e7]
      - generic [ref=e9]: NexusAI
    - generic [ref=e10]:
      - heading "Welcome back" [level=1] [ref=e11]
      - paragraph [ref=e12]: Sign in to your NexusAI account
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]: Email
          - textbox "you@example.com" [ref=e16]
        - generic [ref=e17]:
          - generic [ref=e18]: Password
          - textbox "••••••••" [ref=e19]
        - generic [ref=e20] [cursor=pointer]:
          - checkbox "Remember me" [ref=e21]
          - text: Remember me
        - button "Sign In" [ref=e22] [cursor=pointer]
      - generic [ref=e25]: or
      - button "Continue as Guest" [ref=e27] [cursor=pointer]
      - paragraph [ref=e28]:
        - text: Don't have an account?
        - link "Sign up" [ref=e29] [cursor=pointer]:
          - /url: /auth/signup
  - button "Open Next.js Dev Tools" [ref=e35] [cursor=pointer]:
    - img [ref=e36]
  - alert [ref=e39]
```

# Test source

```ts
  9   | 
  10  |   test('TC-AUTH-FE-004: User attempts login without entering password', async ({ page }) => {
  11  |     // Enter valid email
  12  |     await page.fill('input[name="email"]', 'test@example.com');
  13  |     // Leave password field empty
  14  |     // Try to submit form
  15  |     const submitButton = page.locator('button[type="submit"]');
  16  |     await submitButton.click();
  17  | 
  18  |     // Check if form submission was prevented by HTML5 validation
  19  |     // The browser should show validation error and prevent submission
  20  |     const passwordField = page.locator('input[name="password"]');
  21  |     const isPasswordRequired = await passwordField.getAttribute('required');
  22  | 
  23  |     // Try to check if form was actually submitted
  24  |     // If form was submitted, we would see a network request or page navigation
  25  |     await page.waitForTimeout(2000); // Wait to see if any navigation occurs
  26  | 
  27  |     const currentUrl = page.url();
  28  |     const shouldHaveValidationError = isPasswordRequired !== null;
  29  | 
  30  |     // Verify we're still on login page (not redirected)
  31  |     expect(currentUrl).toContain('auth/login');
  32  | 
  33  |     // Check for browser validation attribute
  34  |     expect(shouldHaveValidationError).toBe(true);
  35  | 
  36  |     // Check if password field has validation message
  37  |     const passwordValidation = await passwordField.evaluate(el => (el as HTMLInputElement).checkValidity());
  38  |     expect(passwordValidation).toBe(false);
  39  | 
  40  |     console.log('Test TC-AUTH-FE-004: Password field should have HTML5 validation');
  41  |   });
  42  | 
  43  |   test('TC-AUTH-FE-005: User attempts login with invalid email format', async ({ page }) => {
  44  |     // Enter invalid email format
  45  |     await page.fill('input[name="email"]', 'notanemail');
  46  |     // Enter valid password
  47  |     await page.fill('input[name="password"]', 'password123');
  48  |     // Try to submit form
  49  |     const submitButton = page.locator('button[type="submit"]');
  50  |     await submitButton.click();
  51  | 
  52  |     // Check if form submission was prevented by HTML5 validation
  53  |     const emailField = page.locator('input[name="email"]');
  54  |     const isEmailRequired = await emailField.getAttribute('required');
  55  |     const isEmailTypeEmail = await emailField.getAttribute('type');
  56  | 
  57  |     await page.waitForTimeout(2000); // Wait to see if any navigation occurs
  58  | 
  59  |     const currentUrl = page.url();
  60  | 
  61  |     // Verify we're still on login page (not redirected)
  62  |     expect(currentUrl).toContain('auth/login');
  63  | 
  64  |     // Check for browser validation attributes
  65  |     expect(isEmailRequired).not.toBeNull();
  66  |     expect(isEmailTypeEmail).toBe('email');
  67  | 
  68  |     // Check if email field has validation error
  69  |     const emailValidation = await emailField.evaluate(el => (el as HTMLInputElement).checkValidity());
  70  |     expect(emailValidation).toBe(false);
  71  | 
  72  |     console.log('Test TC-AUTH-FE-005: Email field should have HTML5 validation for invalid format');
  73  |   });
  74  | 
  75  |   test('TC-AUTH-FE-003: User attempts login without entering email', async ({ page }) => {
  76  |     // Leave email field empty
  77  |     // Enter valid password
  78  |     await page.fill('input[name="password"]', 'password123');
  79  |     // Try to submit form
  80  |     const submitButton = page.locator('button[type="submit"]');
  81  |     await submitButton.click();
  82  | 
  83  |     // Check if form submission was prevented by HTML5 validation
  84  |     const emailField = page.locator('input[name="email"]');
  85  |     const isEmailRequired = await emailField.getAttribute('required');
  86  | 
  87  |     await page.waitForTimeout(2000); // Wait to see if any navigation occurs
  88  | 
  89  |     const currentUrl = page.url();
  90  | 
  91  |     // Verify we're still on login page (not redirected)
  92  |     expect(currentUrl).toContain('auth/login');
  93  | 
  94  |     // Check for browser validation attribute
  95  |     expect(isEmailRequired).not.toBeNull();
  96  | 
  97  |     // Check if email field has validation error
  98  |     const emailValidation = await emailField.evaluate(el => (el as HTMLInputElement).checkValidity());
  99  |     expect(emailValidation).toBe(false);
  100 | 
  101 |     console.log('Test TC-AUTH-FE-003: Email field should have HTML5 validation for empty required field');
  102 |   });
  103 | 
  104 |   test('Verify HTML5 validation attributes exist on login form', async ({ page }) => {
  105 |     const emailField = page.locator('input[name="email"]');
  106 |     const passwordField = page.locator('input[name="password"]');
  107 | 
  108 |     // Check email field attributes
> 109 |     const emailRequired = await emailField.getAttribute('required');
      |                                            ^ Error: locator.getAttribute: Test timeout of 30000ms exceeded.
  110 |     const emailType = await emailField.getAttribute('type');
  111 | 
  112 |     // Check password field attributes
  113 |     const passwordRequired = await passwordField.getAttribute('required');
  114 |     const passwordType = await passwordField.getAttribute('type');
  115 | 
  116 |     console.log('Email field - required:', emailRequired, 'type:', emailType);
  117 |     console.log('Password field - required:', passwordRequired, 'type:', passwordType);
  118 | 
  119 |     expect(emailRequired).not.toBeNull();
  120 |     expect(emailType).toBe('email');
  121 |     expect(passwordRequired).not.toBeNull();
  122 |   });
  123 | });
  124 | 
```