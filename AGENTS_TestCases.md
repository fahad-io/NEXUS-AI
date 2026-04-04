# AGENTS MODULE - TEST CASES

## FRONTEND TEST CASES

### TC-AGT-FE-001: Agents Page - Initial Load
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-FE-001 |
| **Module Name** | Agents |
| **Type** | Frontend |
| **Page/Component/API** | /agents page |
| **Description** | Verify agents page loads successfully |
| **Preconditions** | N/A |
| **Steps** | 1. Navigate to /agents page<br>2. Verify page renders without errors<br>3. Verify header section is visible<br>4. Verify "Agent Templates" section is visible<br>5. Verify "My Agents" section is visible |
| **Expected Result** | Agents page loads with header, templates grid, and "My Agents" empty state section |
| **Actual Result** | |

### TC-AGT-FE-002: Agents Page - Banner Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-FE-002 |
| **Module Name** | Agents |
| **Type** | Frontend |
| **Page/Component/API** | /agents page - Banner |
| **Description** | Verify helpful banner is displayed on initial load |
| **Preconditions** | User is on agents page for first time |
| **Steps** | 1. Navigate to /agents page<br>2. Verify blue banner with "Not sure where to start?" appears<br>3. Verify "Chat with guide" button is visible |
| **Expected Result** | Blue banner displays with helpful message and "Chat with guide →" button |
| **Actual Result** | |

### TC-AGT-FE-003: Agents Page - Banner Dismiss
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-FE-003 |
| **Module Name** | Agents |
| **Type** | Frontend |
| **Page/Component/API** | /agents page - Banner |
| **Description** | User dismisses the helpful banner |
| **Preconditions** | Banner is displayed on agents page |
| **Steps** | 1. Click "×" close button on banner<br>2. Verify banner disappears |
| **Expected Result** | Banner is hidden from the page |
| **Actual Result** | |

### TC-AGT-FE-004: Agents Page - New Agent Button
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-FE-004 |
| **Module Name** | Agents |
| **Type** | Frontend |
| **Page/Component/API** | /agents page header |
| **Description** | User clicks "+ New Agent" button |
| **Preconditions** | User is on agents page |
| **Steps** | 1. Click "+ New Agent" button in header<br>2. Verify action triggers (current UI shows button but functionality may be pending) |
| **Expected Result** | "+ New Agent" button is clickable and should trigger agent creation flow (currently displays button only) |
| **Actual Result** | |

### TC-AGT-FE-005: Agents Page - Template Card Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-FE-005 |
| **Module Name** | Agents |
| **Type** | Frontend |
| **Page/Component/API** | /agents page - Template cards |
| **Description** | Verify agent template card displays correct information |
| **Preconditions** | User is on agents page |
| **Steps** | 1. Verify Research Agent template card shows:<br>   - Icon (🔍)<br>   - Name "Research Agent"<br>   - Description about autonomous search<br>   - Tags [GPT-5, Web search, Reports]<br>2. Verify Customer Support template card<br>3. Verify Code Review template card<br>4. Verify Data Analysis template card<br>5. Verify Content Writer template card<br>6. Verify Workflow Automator template card<br>7. Verify Build from Scratch template card |
| **Expected Result** | All 7 template cards display with icon, name, description, tags, and "Use template →" link |
| **Actual Result** | |

### TC-AGT-FE-006: Agents Page - Template Card Hover Effect
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-FE-006 |
| **Module Name** | Agents |
| **Type** | Frontend |
| **Page/Component/API** | /agents page - Template cards |
| **Description** | Verify hover effects on template cards |
| **Preconditions** | User is on agents page |
| **Steps** | 1. Hover over a template card<br>2. Verify card elevates (translateY effect)<br>3. Verify shadow increases<br>4. Move mouse away and verify card returns to normal state |
| **Expected Result** | On hover, card lifts up with enhanced shadow; on mouse out, card returns to normal |
| **Actual Result** | |

### TC-AGT-FE-007: Agents Page - Use Template Link
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-FE-007 |
| **Module Name** | Agents |
| **Type** | Frontend |
| **Page/Component/API** | /agents page - Template cards |
| **Description** | User clicks "Use template →" link on a template card |
| **Preconditions** | User is on agents page |
| **Steps** | 1. Click "Use template →" link on Research Agent template card<br>2. Verify model detail dialog opens<br>3. Verify dialog shows GPT-5 model details |
| **Expected Result** | ModelDetailDialog opens showing details of the template's associated model (e.g., GPT-5) |
| **Actual Result** | |

### TC-AGT-FE-008: Agents Page - My Agents Empty State
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-FE-008 |
| **Module Name** | Agents |
| **Type** | Frontend |
| **Page/Component/API** | /agents page - My Agents section |
| **Description** | Verify empty state is displayed when user has no agents |
| **Preconditions** | User has not created any agents yet |
| **Steps** | 1. Scroll to "My Agents" section<br>2. Verify empty state shows emoji 🤖<br>3. Verify "No agents yet" text is displayed<br>4. Verify help text appears<br>5. Verify "Create your first agent" text with link to templates |
| **Expected Result** | Empty state displays with 🤖 emoji, "No agents yet", help text, and link to templates |
| **Actual Result** | |

### TC-AGT-FE-009: Agents Page - My Agents with Agents List
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-FE-009 |
| **Module Name** | Agents |
| **Type** | Frontend |
| **Page/Component/API** | /agents page - My Agents section |
| **Description** | Verify user's created agents are listed when available |
| **Preconditions** | User has created one or more agents |
| **Steps** | 1. Scroll to "My Agents" section<br>2. Verify agents are listed (if implemented)<br>3. Verify each agent shows name, description, and actions |
| **Expected Result** | Created agents are displayed in grid/list format with edit and delete actions (when implemented) |
| **Actual Result** | |

---

## BACKEND TEST CASES

### TC-AGT-BE-001: Agent Templates are Static Data
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-BE-001 |
| **Module Name** | Agents |
| **Type** | Backend |
| **Page/Component/API** | /agents page (data source) |
| **Description** | Verify agent templates are served from frontend static data |
| **Preconditions** | N/A |
| **Steps** | 1. Navigate to /agents page<br>2. Verify templates are displayed without backend API call<br>3. Verify templates match TEMPLATES constant |
| **Expected Result** | Agent templates are hardcoded in frontend and displayed without backend API call |
| **Actual Result** | |

---

## INTEGRATION TEST CASES

### TC-AGT-INT-001: Template to Chat Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-INT-001 |
| **Module Name** | Agents |
| **Type** | Integration |
| **Page/Component/API** | /agents page + ModelDetailDialog + /chat page |
| **Description** | Verify using agent template opens model dialog and allows use in chat |
| **Preconditions** | User is on agents page |
| **Steps** | 1. Click "Use template →" on Code Review template<br>2. Verify ModelDetailDialog opens with Claude Opus model<br>3. Verify "Use this model" button in dialog<br>4. Click "Use this model" button<br>5. Verify navigation to /chat?model=claude-opus-4<br>6. Verify correct model is active in chat |
| **Expected Result** | Template opens model dialog, clicking use navigates to chat with template's model selected |
| **Actual Result** | |

### TC-AGT-INT-002: Chat with Guide Button
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-INT-002 |
| **Module Name** | Agents |
| **Type** | Integration |
| **Page/Component/API** | /agents page banner + /chat page |
| **Description** | Verify "Chat with guide" button navigates to chat with AI guide prompt |
| **Preconditions** | User is on agents page |
| **Steps** | 1. Click "Chat with guide →" button in banner<br>2. Verify navigation to /chat page<br>3. Verify helpful prompt is sent or guide mode is activated |
| **Expected Result** | User is navigated to /chat page where AI guide helps describe what user wants to build |
| **Actual Result** | |

### TC-AGT-INT-003: New Agent Button Navigation
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-INT-003 |
| **Module Name** | Agents |
| **Type** | Integration |
| **Page/Component/API** | /agents page + Agent creation flow |
| **Description** | Verify "+ New Agent" button triggers agent creation (when implemented) |
| **Preconditions** | User is on agents page |
| **Steps** | 1. Click "+ New Agent" button in header<br>2. Verify navigation to agent creation flow or modal opens<br>3. Verify user can configure new agent |
| **Expected Result** | "+ New Agent" button navigates to agent builder or opens creation modal (currently displays button) |
| **Actual Result** | |

### TC-AGT-INT-004: Template Selection and Model Dialog
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-AGT-INT-004 |
| **Module Name** | Agents |
| **Type** | Integration |
| **Page/Component/API** | /agents page templates + ModelDetailDialog |
| **Description** | Verify each template is linked to correct model |
| **Preconditions** | User is on agents page |
| **Steps** | 1. Click "Use template →" on Research Agent (modelId: gpt-5)<br>2. Verify dialog shows GPT-5 details<br>3. Close dialog and click "Use template →" on Content Writer (modelId: claude-sonnet-4)<br>4. Verify dialog shows Claude Sonnet details |
| **Expected Result** | Each template opens the correct associated model's detail dialog |
| **Actual Result** | |

---

## NOTE: The Agents module appears to be a frontend-only template showcase currently. No backend API endpoints for agent management were found in the codebase. The templates are hardcoded in the frontend component and link to the marketplace models for demonstration purposes.
