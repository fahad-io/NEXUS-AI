# MARKETPLACE MODULE - TEST CASES

## FRONTEND TEST CASES

### TC-MKT-FE-001: Marketplace Page - Initial Load
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-001 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page |
| **Description** | Verify marketplace page loads successfully with all components |
| **Preconditions** | N/A |
| **Steps** | 1. Navigate to /marketplace page<br>2. Verify page renders without errors<br>3. Verify search bar is visible<br>4. Verify type filter chips are visible<br>5. Verify lab filter pills are visible<br>6. Verify model cards grid is displayed |
| **Expected Result** | Marketplace page loads with search bar, type filters (All, Language, Vision, Code, Image Gen, Audio, Open Source), lab filters, sidebar filters, and model cards |
| **Actual Result** | |

### TC-MKT-FE-002: Marketplace - Search Models
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-002 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Search functionality |
| **Description** | User searches for models by name or description |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Enter search term in "Search models..." input (e.g., "GPT")<br>2. Verify model list filters to matching results<br>3. Check matching models are displayed<br>4. Check non-matching models are hidden |
| **Expected Result** | Model cards grid shows only models matching the search term in name or description |
| **Actual Result** | |

### TC-MKT-FE-003: Marketplace - Clear Search
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-003 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Search functionality |
| **Description** | User clears search to show all models |
| **Preconditions** | User has entered a search term |
| **Steps** | 1. Clear the search input field<br>2. Verify all models are displayed again |
| **Expected Result** | Model cards grid displays all available models when search is cleared |
| **Actual Result** | |

### TC-MKT-FE-004: Marketplace - Type Filter - All
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-004 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Type filter chips |
| **Description** | User selects "All" type filter |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "All" type filter chip<br>2. Verify filter is active (highlighted)<br>3. Verify all models are displayed regardless of type |
| **Expected Result** | "All" chip is highlighted, model cards show all models |
| **Actual Result** | |

### TC-MKT-FE-005: Marketplace - Type Filter - Language
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-005 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Type filter chips |
| **Description** | User filters models by "Language" type |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "Language" type filter chip<br>2. Verify filter is active<br>3. Verify only language models are displayed |
| **Expected Result** | "Language" chip is highlighted, model cards show only language models |
| **Actual Result** | |

### TC-MKT-FE-006: Marketplace - Type Filter - Vision
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-006 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Type filter chips |
| **Description** | User filters models by "Vision" type |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "Vision" type filter chip<br>2. Verify filter is active<br>3. Verify only vision models are displayed |
| **Expected Result** | "Vision" chip is highlighted, model cards show only vision models |
| **Actual Result** | |

### TC-MKT-FE-007: Marketplace - Type Filter - Code
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-007 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Type filter chips |
| **Description** | User filters models by "Code" type |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "Code" type filter chip<br>2. Verify filter is active<br>3. Verify only code models are displayed |
| **Expected Result** | "Code" chip is highlighted, model cards show only code models |
| **Actual Result** | |

### TC-MKT-FE-008: Marketplace - Type Filter - Image Gen
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-008 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Type filter chips |
| **Description** | User filters models by "Image Gen" type |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "Image Gen" type filter chip<br>2. Verify filter is active<br>3. Verify only image generation models are displayed |
| **Expected Result** | "Image Gen" chip is highlighted, model cards show only image generation models |
| **Actual Result** | |

### TC-MKT-FE-009: Marketplace - Type Filter - Audio
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-009 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Type filter chips |
| **Description** | User filters models by "Audio" type |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "Audio" type filter chip<br>2. Verify filter is active<br>3. Verify only audio models are displayed |
| **Expected Result** | "Audio" chip is highlighted, model cards show only audio models |
| **Actual Result** | |

### TC-MKT-FE-010: Marketplace - Type Filter - Open Source
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-010 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Type filter chips |
| **Description** | User filters models by "Open Source" (Free) type |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "Open Source" type filter chip<br>2. Verify filter is active<br>3. Verify only free models are displayed |
| **Expected Result** | "Open Source" chip is highlighted, model cards show only free models |
| **Actual Result** | |

### TC-MKT-FE-011: Marketplace - Lab Filter - All Labs
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-011 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Lab filter pills |
| **Description** | User selects "All Labs" filter |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "All Labs" pill<br>2. Verify filter is active (highlighted)<br>3. Verify models from all labs are displayed |
| **Expected Result** | "All Labs" pill is highlighted, model cards show models from all labs |
| **Actual Result** | |

### TC-MKT-FE-012: Marketplace - Lab Filter - Specific Lab
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-012 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Lab filter pills |
| **Description** | User filters models by specific lab (e.g., OpenAI) |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "OpenAI" lab pill<br>2. Verify filter is active<br>3. Verify only OpenAI models are displayed |
| **Expected Result** | "OpenAI" pill is highlighted, model cards show only OpenAI models |
| **Actual Result** | |

### TC-MKT-FE-013: Marketplace - Lab Filter Toggle
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-013 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Lab filter pills |
| **Description** | User toggles lab filter on and off by clicking same lab |
| **Preconditions** | A specific lab is currently filtered |
| **Steps** | 1. Click on the currently selected lab pill again<br>2. Verify filter is cleared<br>3. Verify all labs are displayed |
| **Expected Result** | Clicking same lab toggles filter off, all models are displayed |
| **Actual Result** | |

### TC-MKT-FE-014: Marketplace - Sidebar Provider Filter
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-014 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Sidebar filters |
| **Description** | User filters by provider using checkbox in sidebar |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Check "OpenAI" checkbox in Provider section<br>2. Verify only OpenAI models are displayed<br>3. Check additional provider checkboxes<br>4. Verify models from multiple providers are displayed |
| **Expected Result** | Checked providers filter the results, showing only models from selected providers |
| **Actual Result** | |

### TC-MKT-FE-015: Marketplace - Sidebar Pricing Filter - Free
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-015 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Sidebar filters |
| **Description** | User filters models by "Free" pricing |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Check "Free" checkbox in Pricing section<br>2. Verify only free models are displayed |
| **Expected Result** | Only free models are displayed |
| **Actual Result** | |

### TC-MKT-FE-016: Marketplace - Sidebar Pricing Filter - Pay-per-use
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-016 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Sidebar filters |
| **Description** | User filters models by "Pay-per-use" pricing |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Check "Pay-per-use" checkbox in Pricing section<br>2. Verify only pay-per-use models are displayed |
| **Expected Result** | Only pay-per-use models are displayed |
| **Actual Result** | |

### TC-MKT-FE-017: Marketplace - Sidebar Pricing Filter - Subscription
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-017 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Sidebar filters |
| **Description** | User filters models by "Subscription" pricing |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Check "Subscription" checkbox in Pricing section<br>2. Verify only subscription-based models are displayed |
| **Expected Result** | Only subscription-based models (with /mo in price) are displayed |
| **Actual Result** | |

### TC-MKT-FE-018: Marketplace - Sidebar Rating Filter
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-018 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Sidebar filters |
| **Description** | User filters models by minimum rating |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "4.5+" rating filter button<br>2. Verify only models with rating >= 4.5 are displayed<br>3. Click "All" to reset |
| **Expected Result** | Only models with rating >= selected threshold are displayed |
| **Actual Result** | |

### TC-MKT-FE-019: Marketplace - Sidebar License Filter - Open Source
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-019 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Sidebar filters |
| **Description** | User filters models by "Open Source" license |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Check "Open Source" checkbox in License section<br>2. Verify only open source models are displayed |
| **Expected Result** | Only open source models are displayed |
| **Actual Result** | |

### TC-MKT-FE-020: Marketplace - Combined Filters
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-020 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Combined filters |
| **Description** | User applies multiple filters simultaneously |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Select "Vision" type filter<br>2. Select "Anthropic" lab filter<br>3. Check "Free" pricing filter<br>4. Verify results match all applied filters |
| **Expected Result** | Only models that match ALL selected filters (Vision AND Anthropic AND Free) are displayed |
| **Actual Result** | |

### TC-MKT-FE-021: Marketplace - No Results Found State
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-021 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Empty state |
| **Description** | Verify empty state when no models match filters |
| **Preconditions** | User applies filters that result in no matches |
| **Steps** | 1. Search for non-existent model name<br>2. OR apply conflicting filters (e.g., Lab=OpenAI AND Lab=Anthropic)<br>3. Verify "No models match your filters" message appears<br>4. Click "Clear all filters" button |
| **Expected Result** | "No models match your filters" message is displayed with "Clear all filters" button |
| **Actual Result** | |

### TC-MKT-FE-022: Marketplace - Clear All Filters
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-022 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Clear filters |
| **Description** | User clears all applied filters |
| **Preconditions** | Multiple filters are applied |
| **Steps** | 1. Click "Clear all filters" button<br>2. Verify search is cleared<br>3. Verify type filter is reset to "All"<br>4. Verify lab filter is reset to "All Labs"<br>5. Verify all sidebar checkboxes are unchecked<br>6. Verify rating filter is reset to "All"<br>7. Verify all models are displayed |
| **Expected Result** | All filters are reset to defaults, all models are displayed |
| **Actual Result** | |

### TC-MKT-FE-023: Marketplace - Model Count Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-023 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Model count |
| **Description** | Verify number of models found is displayed |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Observe model count text above grid<br>2. Apply filters<br>3. Verify count updates |
| **Expected Result** | "X models found" text displays current count matching displayed models |
| **Actual Result** | |

### TC-MKT-FE-024: Marketplace - Model Card Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-024 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Model card |
| **Description** | Verify model card displays correct information |
| **Preconditions** | Models are displayed |
| **Steps** | 1. Verify model name is displayed<br>2. Verify organization name is displayed<br>3. Verify model description is displayed<br>4. Verify model icon is displayed<br>5. Verify tags are displayed<br>6. Verify rating is displayed<br>7. Verify price is displayed |
| **Expected Result** | Model card shows name, org, icon, description, tags (max 4), star rating, and price |
| **Actual Result** | |

### TC-MKT-FE-025: Marketplace - Model Card Badge Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-025 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Model card badges |
| **Description** | Verify model badges (hot, new, beta, open) are displayed correctly |
| **Preconditions** | Models with badges are displayed |
| **Steps** | 1. Find model with "hot" badge<br>2. Verify badge appears with correct color<br>3. Find model with "beta" badge<br>4. Verify badge appears with correct color |
| **Expected Result** | Badges appear with appropriate colors: hot (yellow), new (green), open (blue), beta (cyan) |
| **Actual Result** | |

### TC-MKT-FE-026: Marketplace - Model Card Hover Effect
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-026 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Model card |
| **Description** | Verify hover effects on model cards |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Hover over a model card<br>2. Verify card elevates (translateY)<br>3. Verify shadow increases<br>4. Verify border color changes to accent<br>5. Verify "Use in Chat Hub" button changes style |
| **Expected Result** | On hover, card lifts up with shadow and accent border, CTA button shows gradient background |
| **Actual Result** | |

### TC-MKT-FE-027: Marketplace - Open Model Detail Dialog
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-027 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - ModelDetailDialog |
| **Description** | User opens model detail dialog by clicking CTA button |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "Use in Chat Hub" button on a model card<br>2. Verify modal opens<br>3. Verify model details are displayed |
| **Expected Result** | ModelDetailDialog opens showing model name, description, stats, capabilities, and "Use this model" button |
| **Actual Result** | |

### TC-MKT-FE-028: Marketplace - Use Model from Dialog
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-028 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - ModelDetailDialog |
| **Description** | User selects model from dialog to use in chat |
| **Preconditions** | ModelDetailDialog is open |
| **Steps** | 1. Click "Use this model" button in dialog<br>2. Verify dialog closes<br>3. Verify redirect to /chat with model parameter |
| **Expected Result** | Dialog closes, user is redirected to /chat?model={model_id} |
| **Actual Result** | |

### TC-MKT-FE-029: Marketplace - Close Model Detail Dialog
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-029 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - ModelDetailDialog |
| **Description** | User closes model detail dialog |
| **Preconditions** | ModelDetailDialog is open |
| **Steps** | 1. Click close button (X) or outside modal<br>2. Verify dialog closes |
| **Expected Result** | ModelDetailDialog closes without taking any action |
| **Actual Result** | |

### TC-MKT-FE-030: Marketplace - Browse More Link from Dialog
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-030 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - ModelDetailDialog |
| **Description** | User clicks "Browse more" from model detail dialog |
| **Preconditions** | ModelDetailDialog is open |
| **Steps** | 1. Click "Browse more" button in dialog<br>2. Verify dialog closes<br>3. Verify redirect to /marketplace |
| **Expected Result** | Dialog closes, user is redirected to /marketplace page |
| **Actual Result** | |

### TC-MKT-FE-031: Marketplace - Loading State
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-031 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Loading state |
| **Description** | Verify loading state is displayed while fetching models |
| **Preconditions** | Models are being fetched from API |
| **Steps** | 1. Navigate to /marketplace page<br>2. Observe while API call is in progress<br>3. Verify "Loading models..." or loading indicator appears |
| **Expected Result** | "Loading models..." text or spinner is displayed while models are being fetched |
| **Actual Result** | |

### TC-MKT-FE-032: Marketplace - Fallback Models Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-FE-032 |
| **Module Name** | Marketplace |
| **Type** | Frontend |
| **Page/Component/API** | /marketplace page - Fallback data |
| **Description** | Verify fallback models are displayed when API fails |
| **Preconditions** | API call to fetch models fails or times out |
| **Steps** | 1. Simulate API failure<br>2. Verify FALLBACK_MODELS data is used<br>3. Verify model cards are still displayed |
| **Expected Result** | Fallback models (FALLBACK_MODELS constant) are displayed when API fetch fails |
| **Actual Result** | |

---

## BACKEND TEST CASES

### TC-MKT-BE-001: GET /models - Retrieve All Models
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-BE-001 |
| **Module Name** | Marketplace |
| **Type** | Backend |
| **Page/Component/API** | GET /api/models |
| **Description** | Retrieve list of all available AI models |
| **Preconditions** | N/A |
| **Steps** | 1. Send GET request to /api/models<br>2. Verify response status code<br>3. Verify response body structure |
| **Expected Result** | HTTP 200 OK, response contains array of model objects with id, name, org, description, types, rating, price, etc. |
| **Actual Result** | |

### TC-MKT-BE-002: GET /models - Filter by Type
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-BE-002 |
| **Module Name** | Marketplace |
| **Type** | Backend |
| **Page/Component/API** | GET /api/models?type={type} |
| **Description** | Retrieve models filtered by type |
| **Preconditions** | N/A |
| **Steps** | 1. Send GET request to /api/models?type=language<br>2. Verify response contains only language models |
| **Expected Result** | HTTP 200 OK, response contains array of models where type includes 'language' |
| **Actual Result** | |

### TC-MKT-BE-003: GET /models - Filter by Lab
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-BE-003 |
| **Module Name** | Marketplace |
| **Type** | Backend |
| **Page/Component/API** | GET /api/models?lab={lab} |
| **Description** | Retrieve models filtered by lab/organization |
| **Preconditions** | N/A |
| **Steps** | 1. Send GET request to /api/models?lab=OpenAI<br>2. Verify response contains only OpenAI models |
| **Expected Result** | HTTP 200 OK, response contains array of models where lab matches 'OpenAI' |
| **Actual Result** | |

### TC-MKT-BE-004: GET /models - Search by Name or Description
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-BE-004 |
| **Module Name** | Marketplace |
| **Type** | Backend |
| **Page/Component/API** | GET /api/models?search={query} |
| **Description** | Retrieve models matching search query in name or description |
| **Preconditions** | N/A |
| **Steps** | 1. Send GET request to /api/models?search=GPT<br>2. Verify response contains models with GPT in name or description |
| **Expected Result** | HTTP 200 OK, response contains array of models where name or description includes search term (case-insensitive) |
| **Actual Result** | |

### TC-MKT-BE-005: GET /models - Combined Filters
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-BE-005 |
| **Module Name** | Marketplace |
| **Type** | Backend |
| **Page/Component/API** | GET /api/models?type={type}&lab={lab}&search={query} |
| **Description** | Retrieve models with multiple filters applied |
| **Preconditions** | N/A |
| **Steps** | 1. Send GET request to /api/models?type=vision&lab=Anthropic&search=Claude<br>2. Verify response matches all filters |
| **Expected Result** | HTTP 200 OK, response contains array of models matching type AND lab AND search criteria |
| **Actual Result** | |

### TC-MKT-BE-006: GET /models/:id - Retrieve Single Model
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-BE-006 |
| **Module Name** | Marketplace |
| **Type** | Backend |
| **Page/Component/API** | GET /api/models/:id |
| **Description** | Retrieve a specific model by ID |
| **Preconditions** | Model with ID exists |
| **Steps** | 1. Send GET request to /api/models/{model_id}<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains single model object with all details (id, name, org, description, types, rating, price, context, latency, tags, badge, etc.) |
| **Actual Result** | |

### TC-MKT-BE-007: GET /models/:id - Non-Existent Model
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-BE-007 |
| **Module Name** | Marketplace |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/models/:id |
| **Description** | Attempt to retrieve non-existent model |
| **Preconditions** | N/A |
| **Steps** | 1. Send GET request to /api/models/{non_existent_id}<br>2. Verify response status code |
| **Expected Result** | HTTP 404 Not Found, error message indicating model not found |
| **Actual Result** | |

### TC-MKT-BE-008: GET /models - Empty Results
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-BE-008 |
| **Module Name** | Marketplace |
| **Type** | Backend |
| **Page/Component/API** | GET /api/models with filters |
| **Description** | Verify response when filters result in no matching models |
| **Preconditions** | Filters result in no matches |
| **Steps** | 1. Send GET request to /api/models?search=nonexistent_model_xyz<br>2. Verify response |
| **Expected Result** | HTTP 200 OK, response contains empty array [] |
| **Actual Result** | |

### TC-MKT-BE-009: GET /models - Invalid Type Parameter
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-BE-009 |
| **Module Name** | Marketplace |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/models?type={invalid} |
| **Description** | Attempt to filter by invalid type |
| **Preconditions** | N/A |
| **Steps** | 1. Send GET request to /api/models?type=invalid_type<br>2. Verify response |
| **Expected Result** | HTTP 200 OK with empty array [] (no models match invalid type) or 400 if validation exists |
| **Actual Result** | |

### TC-MKT-BE-010: GET /models - Invalid Lab Parameter
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-BE-010 |
| **Module Name** | Marketplace |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/models?lab={invalid} |
| **Description** | Attempt to filter by invalid lab |
| **Preconditions** | N/A |
| **Steps** | 1. Send GET request to /api/models?lab=nonexistent_lab<br>2. Verify response |
| **Expected Result** | HTTP 200 OK with empty array [] (no models match invalid lab) |
| **Actual Result** | |

---

## INTEGRATION TEST CASES

### TC-MKT-INT-001: Complete Filter Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-INT-001 |
| **Module Name** | Marketplace |
| **Type** | Integration |
| **Page/Component/API** | Frontend filters + Backend API |
| **Description** | Verify complete flow: apply filters in UI, API receives parameters, results update |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Select "Vision" type filter in UI<br>2. Select "Anthropic" lab filter in UI<br>3. Check "Free" pricing filter<br>4. Verify API request is sent to GET /api/models with query parameters<br>5. Verify only matching models are displayed |
| **Expected Result** | API is called with type=vision&lab=Anthropic&search= (or similar), UI displays filtered results |
| **Actual Result** | |

### TC-MKT-INT-002: Search and Filter Integration
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-INT-002 |
| **Module Name** | Marketplace |
| **Type** | Integration |
| **Page/Component/API** | Frontend search + Backend API |
| **Description** | Verify search text is sent to API and results are filtered |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Enter "GPT" in search box<br>2. Verify API request to GET /api/models?search=GPT<br>3. Verify models with GPT in name/description are displayed<br>4. Apply additional filter (e.g., Language type)<br>5. Verify API includes both search and type parameters |
| **Expected Result** | Search and type filters are sent together, results match both criteria |
| **Actual Result** | |

### TC-MKT-INT-003: Model Selection and Chat Navigation
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-INT-003 |
| **Module Name** | Marketplace |
| **Type** | Integration |
| **Page/Component/API** | Marketplace + Chat routes |
| **Description** | Verify clicking "Use in Chat Hub" navigates to chat with model selected |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "Use in Chat Hub" on a model card (e.g., GPT-4o)<br>2. Verify redirect to /chat?model=gpt-4o-mini<br>3. Verify chat page loads with selected model active |
| **Expected Result** | User is redirected to chat page with specified model pre-selected in sidebar |
| **Actual Result** | |

### TC-MKT-INT-004: Model Detail Dialog and Use Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-INT-004 |
| **Module Name** | Marketplace |
| **Type** | Integration |
| **Page/Component/API** | ModelDetailDialog + Chat navigation |
| **Description** | Verify opening model detail, viewing details, and using model in chat |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Click "Use in Chat Hub" to open dialog<br>2. Verify dialog displays model details<br>3. Click "Use this model" button<br>4. Verify navigation to /chat with model parameter<br>5. Verify correct model is active in chat |
| **Expected Result** | Dialog opens with model details, clicking use button navigates to chat with model selected |
| **Actual Result** | |

### TC-MKT-INT-005: API Error Handling - Fallback Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-INT-005 |
| **Module Name** | Marketplace |
| **Type** | Integration (Negative) |
| **Page/Component/API** | Frontend + Backend error |
| **Description** | Verify fallback models are displayed when API fails |
| **Preconditions** | Backend API is unreachable or returning errors |
| **Steps** | 1. Navigate to /marketplace page<br>2. Simulate API failure (network error, server down)<br>3. Verify FALLBACK_MODELS data is used<br>4. Verify models are still displayed |
| **Expected Result** | Fallback models array is used, marketplace page still displays model cards |
| **Actual Result** | |

### TC-MKT-INT-006: Multiple Filter State Management
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-MKT-INT-006 |
| **Module Name** | Marketplace |
| **Type** | Integration |
| **Page/Component/API** | Frontend filter state + API calls |
| **Description** | Verify multiple filters can be applied and cleared correctly |
| **Preconditions** | User is on marketplace page |
| **Steps** | 1. Apply 3 different filters (type, lab, pricing)<br>2. Verify results match all filters<br>3. Clear one filter<br>4. Verify results update<br>5. Clear all filters<br>6. Verify all models are displayed |
| **Expected Result** | Multiple filters work together, clearing individual or all filters updates results correctly |
| **Actual Result** | |
