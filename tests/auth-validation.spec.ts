import { test, expect } from '@playwright/test';

test.describe('Authentication Form Validation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and cookies before each test
    await page.context().clearCookies();
    await page.goto('http://localhost:3000/auth/login');
  });

  test('TC-AUTH-FE-004: User attempts login without entering password', async ({ page }) => {
    // Enter valid email
    await page.fill('input[name="email"]', 'test@example.com');
    // Leave password field empty
    // Try to submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check if form submission was prevented by HTML5 validation
    // The browser should show validation error and prevent submission
    const passwordField = page.locator('input[name="password"]');
    const isPasswordRequired = await passwordField.getAttribute('required');

    // Try to check if form was actually submitted
    // If form was submitted, we would see a network request or page navigation
    await page.waitForTimeout(2000); // Wait to see if any navigation occurs

    const currentUrl = page.url();
    const shouldHaveValidationError = isPasswordRequired !== null;

    // Verify we're still on login page (not redirected)
    expect(currentUrl).toContain('auth/login');

    // Check for browser validation attribute
    expect(shouldHaveValidationError).toBe(true);

    // Check if password field has validation message
    const passwordValidation = await passwordField.evaluate(el => (el as HTMLInputElement).checkValidity());
    expect(passwordValidation).toBe(false);

    console.log('Test TC-AUTH-FE-004: Password field should have HTML5 validation');
  });

  test('TC-AUTH-FE-005: User attempts login with invalid email format', async ({ page }) => {
    // Enter invalid email format
    await page.fill('input[name="email"]', 'notanemail');
    // Enter valid password
    await page.fill('input[name="password"]', 'password123');
    // Try to submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check if form submission was prevented by HTML5 validation
    const emailField = page.locator('input[name="email"]');
    const isEmailRequired = await emailField.getAttribute('required');
    const isEmailTypeEmail = await emailField.getAttribute('type');

    await page.waitForTimeout(2000); // Wait to see if any navigation occurs

    const currentUrl = page.url();

    // Verify we're still on login page (not redirected)
    expect(currentUrl).toContain('auth/login');

    // Check for browser validation attributes
    expect(isEmailRequired).not.toBeNull();
    expect(isEmailTypeEmail).toBe('email');

    // Check if email field has validation error
    const emailValidation = await emailField.evaluate(el => (el as HTMLInputElement).checkValidity());
    expect(emailValidation).toBe(false);

    console.log('Test TC-AUTH-FE-005: Email field should have HTML5 validation for invalid format');
  });

  test('TC-AUTH-FE-003: User attempts login without entering email', async ({ page }) => {
    // Leave email field empty
    // Enter valid password
    await page.fill('input[name="password"]', 'password123');
    // Try to submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check if form submission was prevented by HTML5 validation
    const emailField = page.locator('input[name="email"]');
    const isEmailRequired = await emailField.getAttribute('required');

    await page.waitForTimeout(2000); // Wait to see if any navigation occurs

    const currentUrl = page.url();

    // Verify we're still on login page (not redirected)
    expect(currentUrl).toContain('auth/login');

    // Check for browser validation attribute
    expect(isEmailRequired).not.toBeNull();

    // Check if email field has validation error
    const emailValidation = await emailField.evaluate(el => (el as HTMLInputElement).checkValidity());
    expect(emailValidation).toBe(false);

    console.log('Test TC-AUTH-FE-003: Email field should have HTML5 validation for empty required field');
  });

  test('Verify HTML5 validation attributes exist on login form', async ({ page }) => {
    const emailField = page.locator('input[name="email"]');
    const passwordField = page.locator('input[name="password"]');

    // Check email field attributes
    const emailRequired = await emailField.getAttribute('required');
    const emailType = await emailField.getAttribute('type');

    // Check password field attributes
    const passwordRequired = await passwordField.getAttribute('required');
    const passwordType = await passwordField.getAttribute('type');

    console.log('Email field - required:', emailRequired, 'type:', emailType);
    console.log('Password field - required:', passwordRequired, 'type:', passwordType);

    expect(emailRequired).not.toBeNull();
    expect(emailType).toBe('email');
    expect(passwordRequired).not.toBeNull();
  });
});
