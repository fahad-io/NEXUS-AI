# DASHBOARD MODULE - TEST CASES

## FRONTEND TEST CASES

### TC-DASH-FE-001: Dashboard Page - Initial Load
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-001 |
| **Module Name** | Dashboard |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard page |
| **Description** | Verify dashboard overview page loads successfully |
| **Preconditions** | User is authenticated |
| **Steps** | 1. Navigate to /dashboard page<br>2. Verify page renders without errors<br>3. Verify user name is displayed in header<br>4. Verify stats cards are displayed<br>5. Verify charts are rendered |
| **Expected Result** | Dashboard page loads with user's name, stats cards, chat activity line chart, model usage bar chart, and usage by category donut chart |
| **Actual Result** | |

### TC-DASH-FE-002: Dashboard - Unauthorized Access Redirect
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-002 |
| **Module Name** | Dashboard |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /dashboard page |
| **Description** | Unauthenticated user attempts to access dashboard |
| **Preconditions** | User is not logged in |
| **Steps** | 1. Clear localStorage<br>2. Navigate to /dashboard |
| **Expected Result** | User is automatically redirected to /auth/login page |
| **Actual Result** | |

### TC-DASH-FE-003: Dashboard - Stats Cards Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-003 |
| **Module Name** | Dashboard |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard page - Stats section |
| **Description** | Verify stats cards display correct metrics |
| **Preconditions** | User is on dashboard page |
| **Steps** | 1. Verify "Total Requests" card shows count<br>2. Verify "Models Used" card shows count<br>3. Verify "Avg Latency" card shows time<br>4. Verify "Total Cost" card shows amount |
| **Expected Result** | Four stats cards display: Total Requests (142), Models Used (8), Avg Latency (1.2s), Total Cost ($3.40) with proper styling |
| **Actual Result** | |

### TC-DASH-FE-004: Dashboard - Sidebar Navigation
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-004 |
| **Module Name** | Dashboard |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard page - Sidebar |
| **Description** | Verify sidebar navigation links work correctly |
| **Preconditions** | User is on dashboard page |
| **Steps** | 1. Click "💬 Chat History" link<br>2. Verify redirect to /dashboard/history<br>3. Click "⚙️ Settings" link<br>4. Verify redirect to /dashboard/settings<br>5. Click "💳 Billing" link<br>6. Verify redirect to /dashboard/billing<br>7. Click "🚀 Go to Chat Hub" link<br>8. Verify redirect to /chat |
| **Expected Result** | Each sidebar link navigates to its corresponding page |
| **Actual Result** | |

### TC-DASH-FE-005: Dashboard - Quick Start Links
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-005 |
| **Module Name** | Dashboard |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard page - Quick Start section |
| **Description** | Verify quick start links navigate to correct pages |
| **Preconditions** | User is on dashboard page |
| **Steps** | 1. Click "🚀 Open Chat Hub" button<br>2. Verify redirect to /chat<br>3. Click "🛍 Browse Models" button<br>4. Verify redirect to /marketplace<br>5. Click "🤖 Build Agent" button<br>6. Verify redirect to /agents |
| **Expected Result** | Each quick start button navigates to its corresponding page |
| **Actual Result** | |

### TC-DASH-FE-006: Dashboard - Chat Activity Line Chart
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-006 |
| **Module Name** | Dashboard |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard page - Charts |
| **Description** | Verify chat activity line chart is rendered correctly |
| **Preconditions** | User is on dashboard page |
| **Steps** | 1. Verify "Chat Activity" section exists<br>2. Verify line chart with data points is displayed<br>3. Verify x-axis labels (dates) are visible<br>4. Verify y-axis values are scaled correctly<br>5. Verify chart color is accent color |
| **Expected Result** | Line chart displays 7 days of chat activity with proper labels, scaling, and accent color |
| **Actual Result** | |

### TC-DASH-FE-007: Dashboard - Model Usage Bar Chart
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-007 |
| **Module Name** | Dashboard |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard page - Charts |
| **Description** | Verify model usage bar chart is rendered correctly |
| **Preconditions** | User is on dashboard page |
| **Steps** | 1. Verify "Model Usage" section exists<br>2. Verify bar chart with model bars is displayed<br>3. Verify x-axis labels (model names) are visible<br>4. Verify y-axis values are scaled correctly<br>5. Verify chart color is blue |
| **Expected Result** | Bar chart displays per-model usage with proper labels, scaling, and blue color |
| **Actual Result** | |

### TC-DASH-FE-008: Dashboard - Usage by Category Donut Chart
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-008 |
| **Module Name** | Dashboard |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard page - Charts |
| **Description** | Verify usage by category donut chart is rendered correctly |
| **Preconditions** | User is on dashboard page |
| **Steps** | 1. Verify "Usage by Category" section exists<br>2. Verify donut chart with segments is displayed<br>3. Verify center shows total count<br>4. Verify legend shows categories with colors<br>5. Verify segment colors match legend |
| **Expected Result** | Donut chart shows category breakdown (Chat, Vision, Image Gen, Code) with total count in center and color-coded legend |
| **Actual Result** | |

### TC-DASH-FE-009: Dashboard History Page - Initial Load
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-009 |
| **Module Name** | Dashboard - History |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/history page |
| **Description** | Verify chat history page loads successfully |
| **Preconditions** | User is authenticated |
| **Steps** | 1. Navigate to /dashboard/history page<br>2. Verify page renders<br>3. Verify history list is displayed or empty state shown |
| **Expected Result** | History page loads with list of chat sessions or "No chat sessions yet" empty state |
| **Actual Result** | |

### TC-DASH-FE-010: Dashboard History - Session List Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-010 |
| **Module Name** | Dashboard - History |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/history page |
| **Description** | Verify chat sessions are listed with correct information |
| **Preconditions** | User has chat sessions |
| **Steps** | 1. Verify session title is displayed<br>2. Verify model ID is displayed<br>3. Verify message count is displayed<br>4. Verify last updated date is displayed<br>5. Verify "Continue →" and "Delete" buttons exist |
| **Expected Result** | Each session shows title, modelId, message count, last updated date with action buttons |
| **Actual Result** | |

### TC-DASH-FE-011: Dashboard History - Continue Session
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-011 |
| **Module Name** | Dashboard - History |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/history page |
| **Description** | User clicks to continue a chat session |
| **Preconditions** | User is on history page with sessions |
| **Steps** | 1. Click "Continue →" button on a session<br>2. Verify redirect to /chat?session={id} |
| **Expected Result** | User is redirected to chat page with selected session loaded |
| **Actual Result** | |

### TC-DASH-FE-012: Dashboard History - Delete Session
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-012 |
| **Module Name** | Dashboard - History |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/history page |
| **Description** | User deletes a chat session |
| **Preconditions** | User is on history page with sessions |
| **Steps** | 1. Click "Delete" button on a session<br>2. Verify session is removed from list<br>3. Verify API call to DELETE /api/chat/session/{id} |
| **Expected Result** | Session is deleted via API and removed from UI list |
| **Actual Result** | |

### TC-DASH-FE-013: Dashboard History - Empty State
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-013 |
| **Module Name** | Dashboard - History |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/history page |
| **Description** | Verify empty state when user has no chat sessions |
| **Preconditions** | User is authenticated but has no chat history |
| **Steps** | 1. Navigate to /dashboard/history page<br>2. Verify empty state message<br>3. Verify "Start chatting →" link is displayed |
| **Expected Result** | "No chat sessions yet. Start chatting →" message with link to /chat |
| **Actual Result** | |

### TC-DASH-FE-014: Dashboard Settings Page - Initial Load
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-014 |
| **Module Name** | Dashboard - Settings |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/settings page |
| **Description** | Verify settings page loads successfully |
| **Preconditions** | User is authenticated |
| **Steps** | 1. Navigate to /dashboard/settings page<br>2. Verify page renders<br>3. Verify Profile section is visible<br>4. Verify Preferences section is visible<br>5. Verify Danger Zone section is visible |
| **Expected Result** | Settings page loads with Profile, Preferences, and Danger Zone sections |
| **Actual Result** | |

### TC-DASH-FE-015: Dashboard Settings - Save Profile Changes
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-015 |
| **Module Name** | Dashboard - Settings |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/settings page |
| **Description** | User saves profile name and email changes |
| **Preconditions** | User is on settings page |
| **Steps** | 1. Modify full name field<br>2. Modify email field<br>3. Click "Save Changes" button<br>4. Verify loading state<br>5. Verify toast message appears |
| **Expected Result** | Button shows "Saving..." during request, toast "Settings saved successfully!" appears on completion |
| **Actual Result** | |

### TC-DASH-FE-016: Dashboard Settings - Language Selection
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-016 |
| **Module Name** | Dashboard - Settings |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/settings page - Preferences |
| **Description** | User changes language preference |
| **Preconditions** | User is on settings page |
| **Steps** | 1. Click Language dropdown<br>2. Select a different language (e.g., "Español")<br>3. Verify selection is saved |
| **Expected Result** | Language preference is saved and can be changed (actual language switching behavior depends on implementation) |
| **Actual Result** | |

### TC-DASH-FE-017: Dashboard Settings - Email Notifications Toggle
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-017 |
| **Module Name** | Dashboard - Settings |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/settings page - Preferences |
| **Description** | User toggles email notifications on/off |
| **Preconditions** | User is on settings page |
| **Steps** | 1. Click Email Notifications toggle (turn on if off, or off if on)<br>2. Verify toggle state changes visually<br>3. Verify setting is saved |
| **Expected Result** | Toggle switch animates to new state, setting is saved |
| **Actual Result** | |

### TC-DASH-FE-018: Dashboard Settings - Delete Account Button
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-018 |
| **Module Name** | Dashboard - Settings |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/settings page - Danger Zone |
| **Description** | User clicks delete account button |
| **Preconditions** | User is on settings page in Danger Zone |
| **Steps** | 1. Click "Delete Account" button<br>2. Verify toast message appears |
| **Expected Result** | Toast message "Account deletion requested. Our team will follow up within 24 hours." appears |
| **Actual Result** | |

### TC-DASH-FE-019: Dashboard Billing Page - Initial Load
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-019 |
| **Module Name** | Dashboard - Billing |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/billing page |
| **Description** | Verify billing page loads successfully |
| **Preconditions** | User is authenticated |
| **Steps** | 1. Navigate to /dashboard/billing page<br>2. Verify Current Plan section<br>3. Verify Pricing Cards section<br>4. Verify Invoice History section |
| **Expected Result** | Billing page loads with current plan info, pricing upgrade cards, and invoice history |
| **Actual Result** | |

### TC-DASH-FE-020: Dashboard Billing - Current Plan Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-020 |
| **Module Name** | Dashboard - Billing |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/billing page - Current Plan |
| **Description** | Verify current plan details are displayed |
| **Preconditions** | User is on billing page |
| **Steps** | 1. Verify plan name (Free/Pro/Teams) is displayed<br>2. Verify plan limits are shown (API Calls, Models Access, Storage)<br>3. Verify "Upgrade to Pro" button is shown for Free plan |
| **Expected Result** | Current plan shows "Free" with limits: 100/1,000 API calls, 10 models, 100 MB storage |
| **Actual Result** | |

### TC-DASH-FE-021: Dashboard Billing - Pricing Cards Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-021 |
| **Module Name** | Dashboard - Billing |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/billing page - Pricing Cards |
| **Description** | Verify pricing upgrade cards are displayed correctly |
| **Preconditions** | User is on billing page |
| **Steps** | 1. Verify three pricing cards are displayed (Free, Pro, Teams)<br>2. Verify Pro card has "MOST POPULAR" badge<br>3. Verify pricing and features are shown for each<br>4. Verify current plan CTA is disabled |
| **Expected Result** | Three cards with prices, features, and CTAs; Pro card highlighted; Free "Current Plan" disabled |
| **Actual Result** | |

### TC-DASH-FE-022: Dashboard Billing - Invoice History Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-022 |
| **Module Name** | Dashboard - Billing |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard/billing page - Invoices |
| **Description** | Verify invoice history is displayed |
| **Preconditions** | User is on billing page |
| **Steps** | 1. Verify Invoice History section exists<br>2. Verify invoices are listed with date, plan, amount, status<br>3. Verify each invoice shows Paid status in green |
| **Expected Result** | Invoice history shows list of past invoices with date, plan name, amount, and "Paid" status badge |
| **Actual Result** | |

### TC-DASH-FE-023: Dashboard Loading State
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-FE-023 |
| **Module Name** | Dashboard |
| **Type** | Frontend |
| **Page/Component/API** | /dashboard page |
| **Description** | Verify loading state while dashboard data is being fetched |
| **Preconditions** | User navigates to dashboard |
| **Steps** | 1. Navigate to /dashboard page<br>2. Observe while data is loading<br>3. Verify loading indicator appears |
| **Expected Result** | Loading state or spinner is shown while dashboard stats are being fetched |
| **Actual Result** | |

---

## BACKEND TEST CASES

### TC-DASH-BE-001: GET /dashboard/stats - Retrieve User Stats
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-BE-001 |
| **Module Name** | Dashboard |
| **Type** | Backend |
| **Page/Component/API** | GET /api/dashboard/stats |
| **Description** | Retrieve usage statistics for authenticated user |
| **Preconditions** | User is authenticated with valid JWT token |
| **Steps** | 1. Send GET request to /api/dashboard/stats with Authorization: Bearer {token}<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains { totalRequests, modelsUsed, avgLatency, totalCost, usageByModel, usageByCategory } |
| **Actual Result** | |

### TC-DASH-BE-002: GET /dashboard/stats - Without Authentication
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-BE-002 |
| **Module Name** | Dashboard |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/dashboard/stats |
| **Description** | Attempt to retrieve stats without authentication |
| **Preconditions** | User is not authenticated |
| **Steps** | 1. Send GET request to /api/dashboard/stats without Authorization header<br>2. Verify response status code |
| **Expected Result** | HTTP 401 Unauthorized, error message indicating authentication required |
| **Actual Result** | |

### TC-DASH-BE-003: GET /dashboard/history - Retrieve Chat History
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-BE-003 |
| **Module Name** | Dashboard |
| **Type** | Backend |
| **Page/Component/API** | GET /api/dashboard/history |
| **Description** | Retrieve paginated chat history for authenticated user |
| **Preconditions** | User is authenticated with valid JWT token |
| **Steps** | 1. Send GET request to /api/dashboard/history?page=1&limit=20 with Authorization: Bearer {token}<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains { data: [session objects], page, limit, total } |
| **Actual Result** | |

### TC-DASH-BE-004: GET /dashboard/history - Custom Pagination
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-BE-004 |
| **Module Name** | Dashboard |
| **Type** | Backend |
| **Page/Component/API** | GET /api/dashboard/history |
| **Description** | Retrieve chat history with custom page and limit |
| **Preconditions** | User is authenticated |
| **Steps** | 1. Send GET request to /api/dashboard/history?page=2&limit=10 with Authorization: Bearer {token}<br>2. Verify response |
| **Expected Result** | HTTP 200 OK, response returns page 2 of sessions with 10 items per page |
| **Actual Result** | |

### TC-DASH-BE-005: GET /dashboard/history - History Without Auth
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-BE-005 |
| **Module Name** | Dashboard |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/dashboard/history |
| **Description** | Attempt to retrieve history without authentication |
| **Preconditions** | User is not authenticated |
| **Steps** | 1. Send GET request to /api/dashboard/history without Authorization header<br>2. Verify response status code |
| **Expected Result** | HTTP 401 Unauthorized, error message indicating authentication required |
| **Actual Result** | |

### TC-DASH-BE-006: GET /dashboard/billing - Retrieve Billing Info
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-BE-006 |
| **Module Name** | Dashboard |
| **Type** | Backend |
| **Page/Component/API** | GET /api/dashboard/billing |
| **Description** | Retrieve billing information for authenticated user |
| **Preconditions** | User is authenticated with valid JWT token |
| **Steps** | 1. Send GET request to /api/dashboard/billing with Authorization: Bearer {token}<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains { plan, limits, currentUsage, invoices[] } |
| **Actual Result** | |

### TC-DASH-BE-007: GET /dashboard/billing - Billing Without Auth
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-BE-007 |
| **Module Name** | Dashboard |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/dashboard/billing |
| **Description** | Attempt to retrieve billing info without authentication |
| **Preconditions** | User is not authenticated |
| **Steps** | 1. Send GET request to /api/dashboard/billing without Authorization header<br>2. Verify response status code |
| **Expected Result** | HTTP 401 Unauthorized, error message indicating authentication required |
| **Actual Result** | |

---

## INTEGRATION TEST CASES

### TC-DASH-INT-001: Complete Dashboard Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-INT-001 |
| **Module Name** | Dashboard |
| **Type** | Integration |
| **Page/Component/API** | Frontend dashboard + Backend stats API |
| **Description** | Verify complete dashboard flow: login, redirect, load stats |
| **Preconditions** | User is logged in |
| **Steps** | 1. Login with valid credentials<br>2. Verify redirect to /dashboard<br>3. Verify API call to GET /api/dashboard/stats<br>4. Verify stats are displayed in UI |
| **Expected Result** | Dashboard loads with stats fetched from API and displayed in cards and charts |
| **Actual Result** | |

### TC-DASH-INT-002: History Page with API Integration
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-INT-002 |
| **Module Name** | Dashboard - History |
| **Type** | Integration |
| **Page/Component/API** | /dashboard/history + /api/dashboard/history |
| **Description** | Verify history page fetches and displays data from API |
| **Preconditions** | User is authenticated |
| **Steps** | 1. Navigate to /dashboard/history<br>2. Verify API call to GET /api/dashboard/history<br>3. Verify sessions are listed in UI<br>4. Click continue on a session<br>5. Verify navigation to /chat?session={id} |
| **Expected Result** | History is fetched from API, displayed, and sessions can be continued in chat |
| **Actual Result** | |

### TC-DASH-INT-003: Session Delete API Integration
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-INT-003 |
| **Module Name** | Dashboard - History |
| **Type** | Integration |
| **Page/Component/API** | /dashboard/history DELETE /api/chat/session |
| **Description** | Verify session deletion flow from UI to API |
| **Preconditions** | User is on history page |
| **Steps** | 1. Click "Delete" button on a session<br>2. Verify API call to DELETE /api/chat/session/{id}<br>3. Verify session is removed from UI list<br>4. Refresh page<br>5. Verify session is still deleted |
| **Expected Result** | API delete request succeeds, session is removed from UI and API |
| **Actual Result** | |

### TC-DASH-INT-004: Settings Page API Integration
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-INT-004 |
| **Module Name** | Dashboard - Settings |
| **Type** | Integration |
| **Page/Component/API** | /dashboard/settings + Update user profile |
| **Description** | Verify settings page can update user profile (if API endpoint exists) |
| **Preconditions** | User is on settings page |
| **Steps** | 1. Modify name and email fields<br>2. Click "Save Changes"<br>3. Verify update API call (if implemented)<br>4. Verify toast success message |
| **Expected Result** | Settings save with toast message (currently simulates success with timeout) |
| **Actual Result** | |

### TC-DASH-INT-005: Billing Page API Integration
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DASH-INT-005 |
| **Module Name** | Dashboard - Billing |
| **Type** | Integration |
| **Page/Component/API** | /dashboard/billing + /api/dashboard/billing |
| **Description** | Verify billing page fetches and displays billing data from API |
| **Preconditions** | User is authenticated |
| **Steps** | 1. Navigate to /dashboard/billing<br>2. Verify API call to GET /api/dashboard/billing<br>3. Verify current plan displays<br>4. Verify invoice history displays |
| **Expected Result** | Billing data is fetched from API and displayed correctly in UI |
| **Actual Result** | |
