# DISCOVER MODULE - TEST CASES

## FRONTEND TEST CASES

### TC-DSC-FE-001: Discover Page - Initial Load
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-001 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page |
| **Description** | Verify discover page loads successfully |
| **Preconditions** | N/A |
| **Steps** | 1. Navigate to /discover page<br>2. Verify page renders without errors<br>3. Verify header section is visible<br>4. Verify research feed items are displayed<br>5. Verify "Load more articles" button is visible |
| **Expected Result** | Discover page loads with header showing "Live Research Feed" badge, title, and description, and list of research articles |
| **Actual Result** | |

### TC-DSC-FE-002: Discover Page - Header Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-002 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page header |
| **Description** | Verify header section displays correctly |
| **Preconditions** | User is on discover page |
| **Steps** | 1. Verify "📡 Live Research Feed" badge is visible with blue background<br>2. Verify "AI Research Feed" title is displayed<br>3. Verify description text is displayed |
| **Expected Result** | Header shows badge with icon, title "AI Research Feed", and description "Stay up to date with latest AI research, model releases, and benchmarks." |
| **Actual Result** | |

### TC-DSC-FE-003: Discover Page - Research Item Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-003 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Research items |
| **Description** | Verify individual research item displays correctly |
| **Preconditions** | User is on discover page |
| **Steps** | 1. Verify date is visible (day and month)<br>2. Verify category badge is visible<br>3. Verify category badge color matches category type<br>4. Verify title is displayed<br>5. Verify description is displayed<br>6. Verify "Read more →" link is visible |
| **Expected Result** | Each item shows date (e.g., "26 MAR"), colored category badge, title, description, and "Read more →" link |
| **Actual Result** | |

### TC-DSC-FE-004: Discover Page - Benchmark Category Badge
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-004 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Category badges |
| **Description** | Verify Benchmark category badge displays with correct styling |
| **Preconditions** | Research items with Benchmark category exist |
| **Steps** | 1. Find research item with "Benchmark" category<br>2. Verify badge text is "Benchmark"<br>3. Verify badge background is #EDE9FE (light purple)<br>4. Verify badge text color is #5B21B6 (dark purple) |
| **Expected Result** | "Benchmark" badge displays with purple background and dark purple text |
| **Actual Result** | |

### TC-DSC-FE-005: Discover Page - Research Category Badge
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-005 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Category badges |
| **Description** | Verify Research category badge displays with correct styling |
| **Preconditions** | Research items with Research category exist |
| **Steps** | 1. Find research item with "Research" category<br>2. Verify badge text is "Research"<br>3. Verify badge background is #DCFCE7 (light green)<br>4. Verify badge text color is #166534 (dark green) |
| **Expected Result** | "Research" badge displays with green background and dark green text |
| **Actual Result** | |

### TC-DSC-FE-006: Discover Page - Model Category Badge
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-006 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Category badges |
| **Description** | Verify Model category badge displays with correct styling |
| **Preconditions** | Research items with Model category exist |
| **Steps** | 1. Find research item with "Model" category<br>2. Verify badge text is "Model"<br>3. Verify badge background is #FEF3C7 (light amber)<br>4. Verify badge text color is #92400E (dark amber) |
| **Expected Result** | "Model" badge displays with amber background and dark amber text |
| **Actual Result** | |

### TC-DSC-FE-007: Discover Page - Read More Link
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-007 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Read more links |
| **Description** | User clicks "Read more →" link on a research item |
| **Preconditions** | User is on discover page |
| **Steps** | 1. Click "Read more →" link on a research article<br>2. Verify link behavior (currently # placeholder) |
| **Expected Result** | Link opens (currently links to "#", may open external article in production) |
| **Actual Result** | |

### TC-DSC-FE-008: Discover Page - Load More Button
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-008 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Load more |
| **Description** | User clicks "Load more articles" button |
| **Preconditions** | User is on discover page, scrolled to bottom |
| **Steps** | 1. Scroll to bottom of research feed<br>2. Click "Load more articles" button<br>3. Verify button action (currently button exists but functionality may be simulated) |
| **Expected Result** | "Load more articles" button is clickable and should trigger loading more articles (currently displays button only) |
| **Actual Result** | |

### TC-DSC-FE-009: Discover Page - Research Item Hover Effect
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-009 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Research items |
| **Description** | Verify hover effects on research items |
| **Preconditions** | User is on discover page |
| **Steps** | 1. Hover over a research item card<br>2. Verify box-shadow transition<br>3. Verify shadow increases on hover |
| **Expected Result** | On hover, research item card shows enhanced box-shadow effect |
| **Actual Result** | |

### TC-DSC-FE-010: Discover Page - Date Format Consistency
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-010 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Date formatting |
| **Description** | Verify dates are formatted consistently across items |
| **Preconditions** | User is on discover page |
| **Steps** | 1. Check all research items<br>2. Verify date format is consistent (day number + 3-letter month abbreviation)<br>3. Verify months are in uppercase<br>4. Verify chronological order (newest first) |
| **Expected Result** | All dates display as "DD MMM" format (e.g., "26 MAR", "22 MAR"), in uppercase, in chronological order |
| **Actual Result** | |

### TC-DSC-FE-011: Discover Page - Title Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-011 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Item titles |
| **Description** | Verify research item titles are displayed with correct styling |
| **Preconditions** | User is on discover page |
| **Steps** | 1. Verify item titles use Syne font<br>2. Verify font weight is 700<br>3. Verify font color matches text color<br>4. Verify line-height is appropriate |
| **Expected Result** | Item titles display with Syne font, bold weight, proper color and line height |
| **Actual Result** | |

### TC-DSC-FE-012: Discover Page - Description Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-012 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Item descriptions |
| **Description** | Verify research item descriptions are displayed with correct styling |
| **Preconditions** | User is on discover page |
| **Steps** | 1. Verify descriptions use appropriate font size (0.83rem)<br>2. Verify text color is var(--text2)<br>3. Verify line-height is 1.55<br>4. Verify margin-bottom is 0.6rem |
| **Expected Result** | Item descriptions display with proper font size, color, line height, and spacing |
| **Actual Result** | |

### TC-DSC-FE-013: Discover Page - Responsive Layout
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-FE-013 |
| **Module Name** | Discover |
| **Type** | Frontend |
| **Page/Component/API** | /discover page - Responsive design |
| **Description** | Verify page layout responds correctly to different screen sizes |
| **Preconditions** | User is on discover page |
| **Steps** | 1. Resize browser window to mobile width (<768px)<br>2. Verify content adapts to single column<br>3. Resize to tablet width (768px-1024px)<br>4. Verify content layout adjusts<br>5. Resize to desktop width (>1024px)<br>6. Verify full content is visible |
| **Expected Result** | Page layout adapts responsively with appropriate padding and column layout for each screen size |
| **Actual Result** | |

---

## BACKEND TEST CASES

### TC-DSC-BE-001: Discover Page Data Source
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-BE-001 |
| **Module Name** | Discover |
| **Type** | Backend |
| **Page/Component/API** | /discover page (static data) |
| **Description** | Verify discover page uses static data (no backend API) |
| **Preconditions** | N/A |
| **Steps** | 1. Check frontend code for /discover page<br>2. Verify no API calls are made to fetch research items<br>3. Verify RESEARCH_ITEMS constant is used |
| **Expected Result** | Discover page uses hardcoded RESEARCH_ITEMS array, no backend API endpoints for research data |
| **Actual Result** | |

---

## INTEGRATION TEST CASES

### TC-DSC-INT-001: Discover Page Navigation
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-INT-001 |
| **Module Name** | Discover |
| **Type** | Integration |
| **Page/Component/API** | /discover page + Site navigation |
| **Description** | Verify discover page is accessible from navigation |
| **Preconditions** | User is on any page of the site |
| **Steps** | 1. Click "Discover New" link in navbar<br>2. Verify navigation to /discover page<br>3. Verify page loads correctly |
| **Expected Result** | Clicking "Discover New" in navbar navigates to /discover page which loads successfully |
| **Actual Result** | |

### TC-DSC-INT-002: Research Feed Scroll Behavior
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-INT-002 |
| **Module Name** | Discover |
| **Type** | Integration |
| **Page/Component/API** | /discover page scroll behavior |
| **Description** | Verify research feed scrolls smoothly and properly |
| **Preconditions** | User is on discover page with many articles |
| **Steps** | 1. Scroll down through research feed<br>2. Verify smooth scrolling<br>3. Verify all items are accessible<br>4. Scroll back to top<br>5. Verify header is still visible |
| **Expected Result** | Research feed scrolls smoothly, all items are accessible, header remains visible at top |
| **Actual Result** | |

### TC-DSC-INT-003: Category Badge Color Consistency
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-DSC-INT-003 |
| **Module Name** | Discover |
| **Type** | Integration |
| **Page/Component/API** | /discover page - Category colors |
| **Description** | Verify category badge colors are consistent and distinguishable |
| **Preconditions** | User is on discover page |
| **Steps** | 1. Check all Benchmark category items<br>2. Verify all have same purple color scheme<br>3. Check all Research category items<br>4. Verify all have same green color scheme<br>5. Check all Model category items<br>6. Verify all have same amber color scheme |
| **Expected Result** | All items of same category have consistent color styling for visual consistency |
| **Actual Result** | |

---

## NOTE: The Discover module is currently a static content page with hardcoded research items. No backend API endpoints were found for research data. The page serves as an information showcase for AI research news.
