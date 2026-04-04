# CHAT MODULE - TEST CASES

## FRONTEND TEST CASES

### TC-CHAT-FE-001: Chat Page - Initial Load (No Messages)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-001 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page |
| **Description** | Verify chat page loads with welcome state when no messages exist |
| **Preconditions** | User is authenticated or guest |
| **Steps** | 1. Navigate to /chat page<br>2. Verify page renders without errors<br>3. Verify welcome message "Hello! I'm your AI guide." is displayed<br>4. Verify quick action buttons are displayed |
| **Expected Result** | Chat page loads successfully with 3-column layout, welcome message and quick action prompts visible |
| **Actual Result** | |

### TC-CHAT-FE-002: Chat Page - Send Text Message
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-002 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Message composer |
| **Description** | User sends a text message in the chat |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Enter text in the message input textarea<br>2. Click "Send ->" button or press Enter<br>3. Verify message appears in chat<br>4. Verify assistant response appears |
| **Expected Result** | User message appears on right side, assistant response appears on left side, typing indicator shows during processing |
| **Actual Result** | |

### TC-CHAT-FE-003: Chat Page - Send Empty Message
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-003 |
| **Module Name** | Chat |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /chat page - Message composer |
| **Description** | User attempts to send empty message |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Leave message textarea empty<br>2. Click "Send ->" button |
| **Expected Result** | Send button is disabled (opacity 0.5), no message is sent |
| **Actual Result** | |

### TC-CHAT-FE-004: Chat Page - Send Message with Shift+Enter
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-004 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Message composer |
| **Description** | User creates line break in message using Shift+Enter |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Enter text in the message textarea<br>2. Press Shift+Enter<br>3. Verify cursor moves to new line<br>4. Verify message is not sent |
| **Expected Result** | Cursor moves to new line in textarea, message is not sent |
| **Actual Result** | |

### TC-CHAT-FE-005: Chat Page - Select Model from Sidebar
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-005 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Model sidebar |
| **Description** | User selects a different AI model from the left sidebar |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Click on a different model in the left sidebar<br>2. Verify model is highlighted<br>3. Verify active model name appears in header |
| **Expected Result** | Selected model is highlighted in sidebar, model name and icon appear in chat header |
| **Actual Result** | |

### TC-CHAT-FE-006: Chat Page - Search Models in Sidebar
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-006 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Model sidebar search |
| **Description** | User searches for models in the sidebar |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Enter search term in "Search models..." input<br>2. Verify model list filters<br>3. Click on a model from filtered results |
| **Expected Result** | Model list filters to show matching models, user can select from filtered results |
| **Actual Result** | |

### TC-CHAT-FE-007: Chat Page - Model Insights Panel Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-007 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Model insights panel |
| **Description** | Verify model insights panel displays correct information |
| **Preconditions** | User is on chat page |
| **Steps** | 1. View right sidebar panel<br>2. Verify model name and organization<br>3. Verify model description<br>4. Verify context window size<br>5. Verify latency rating<br>6. Verify overall rating |
| **Expected Result** | Model insights panel shows active model's name, org, description, context window, latency, and rating stats |
| **Actual Result** | |

### TC-CHAT-FE-008: Chat Page - Quick Action Prompts
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-008 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Control panel |
| **Description** | User clicks a quick action prompt to send message |
| **Preconditions** | User is on chat page with control panel visible |
| **Steps** | 1. Click on a quick action prompt button<br>2. Verify message is sent<br>3. Verify assistant responds |
| **Expected Result** | Quick action prompt text is sent as a message, assistant responds to the prompt |
| **Actual Result** | |

### TC-CHAT-FE-009: Chat Page - Control Panel Tabs
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-009 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Control panel tabs |
| **Description** | User switches between control panel tabs |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Click on different tabs (Use Cases, Monitor, Prototype, Business, Create, Analyze, Learn)<br>2. Verify prompts update for each tab |
| **Expected Result** | Clicking a tab shows its corresponding prompts, active tab is highlighted |
| **Actual Result** | |

### TC-CHAT-FE-010: Chat Page - Recent Chats Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-010 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Recent chats list |
| **Description** | Verify recent chats are displayed in the right sidebar |
| **Preconditions** | User has previous chat sessions |
| **Steps** | 1. View "Recent Chats" section in right sidebar<br>2. Verify session titles are listed<br>3. Verify timestamps are displayed |
| **Expected Result** | Recent chat sessions (up to 8) are listed with title and last updated timestamp |
| **Actual Result** | |

### TC-CHAT-FE-011: Chat Page - Select Recent Chat Session
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-011 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Recent chats |
| **Description** | User selects a previous chat session from recent chats list |
| **Preconditions** | User has multiple chat sessions |
| **Steps** | 1. Click on a chat session in "Recent Chats" list<br>2. Verify messages from that session load<br>3. Verify active session is highlighted |
| **Expected Result** | Selected session's messages are displayed in chat area, session is highlighted in list |
| **Actual Result** | |

### TC-CHAT-FE-012: Chat Page - New Chat Button
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-012 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - New chat button |
| **Description** | User starts a new chat session |
| **Preconditions** | User is on chat page with active session |
| **Steps** | 1. Click "New chat" button in model insights panel<br>2. Verify messages are cleared<br>3. Verify new session starts |
| **Expected Result** | Current messages are cleared, new session is started, input is ready for new message |
| **Actual Result** | |

### TC-CHAT-FE-013: Chat Page - Typing Indicator
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-013 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Message display |
| **Description** | Verify typing indicator appears while assistant is generating response |
| **Preconditions** | User sends a message and is waiting for response |
| **Steps** | 1. Send a message to assistant<br>2. Observe chat area while response is being generated<br>3. Verify typing indicator appears |
| **Expected Result** | Typing indicator (3 bouncing dots) appears next to assistant avatar while processing |
| **Actual Result** | |

### TC-CHAT-FE-014: Chat Page - Markdown Rendering
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-014 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Message rendering |
| **Description** | Verify markdown formatting is rendered correctly in messages |
| **Preconditions** | Assistant sends a message with markdown formatting |
| **Steps** | 1. Send a message that will return markdown-formatted response<br>2. Verify bold text (**text**) renders<br>3. Verify line breaks render correctly |
| **Expected Result** | Markdown formatting (bold text, line breaks) is rendered correctly in message display |
| **Actual Result** | |

### TC-CHAT-FE-015: Chat Page - Voice Note Recording Start
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-015 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Voice note recording |
| **Description** | User starts recording a voice note |
| **Preconditions** | User is on chat page with microphone permissions |
| **Steps** | 1. Click the red circle (record) button in composer toolbar<br>2. Verify recording UI appears<br>3. Verify timer starts counting |
| **Expected Result** | Recording indicator appears with red pulsing circle, timer shows elapsed time |
| **Actual Result** | |

### TC-CHAT-FE-016: Chat Page - Voice Note Recording Stop
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-016 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Voice note recording |
| **Description** | User stops recording a voice note |
| **Preconditions** | Voice note is being recorded |
| **Steps** | 1. While recording, click "Stop" button<br>2. Verify audio player appears<br>3. Verify voice note is ready to send |
| **Expected Result** | Recording stops, audio player with controls appears, message can be sent with voice note |
| **Actual Result** | |

### TC-CHAT-FE-017: Chat Page - Voice Note Discard
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-017 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Voice note recording |
| **Description** | User discards a voice note during or after recording |
| **Preconditions** | Voice note is being recorded or is ready |
| **Steps** | 1. While recording or after recording, click "Discard" button<br>2. Verify voice note is removed |
| **Expected Result** | Voice note recording stops (if in progress) and/or ready voice note is cleared |
| **Actual Result** | |

### TC-CHAT-FE-018: Chat Page - Voice Note Maximum Duration
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-018 |
| **Module Name** | Chat |
| **Type** | Frontend (Boundary) |
| **Page/Component/API** | /chat page - Voice note recording |
| **Description** | Verify voice note recording automatically stops at 60 second limit |
| **Preconditions** | User starts recording a voice note |
| **Steps** | 1. Start recording a voice note<br>2. Record for 60 seconds<br>3. Verify recording automatically stops |
| **Expected Result** | Recording automatically stops at 60 seconds, toast message "Voice notes are limited to 60 seconds." appears |
| **Actual Result** | |

### TC-CHAT-FE-019: Chat Page - Voice Typing Start
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-019 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Voice typing |
| **Description** | User starts voice typing (speech-to-text) |
| **Preconditions** | User is on chat page with microphone permissions, browser supports SpeechRecognition |
| **Steps** | 1. Click the microphone icon in composer toolbar<br>2. Speak into microphone<br>3. Verify text appears in textarea |
| **Expected Result** | Microphone icon animates, spoken text is transcribed and entered into message textarea |
| **Actual Result** | |

### TC-CHAT-FE-020: Chat Page - Voice Typing Stop
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-020 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Voice typing |
| **Description** | User stops voice typing |
| **Preconditions** | Voice typing is active |
| **Steps** | 1. Click the microphone icon again<br>2. Verify voice typing stops |
| **Expected Result** | Voice typing stops, microphone icon animation stops |
| **Actual Result** | |

### TC-CHAT-FE-021: Chat Page - Attach File
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-021 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - File attachment |
| **Description** | User attaches a file to a message |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Click the file attachment icon in composer toolbar<br>2. Select a file from file picker<br>3. Verify file uploads<br>4. Verify attachment appears in composer |
| **Expected Result** | File picker opens, file uploads successfully, attachment preview shows with file name |
| **Actual Result** | |

### TC-CHAT-FE-022: Chat Page - Attach Image
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-022 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Image attachment |
| **Description** | User attaches an image to a message |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Click the image attachment icon in composer toolbar<br>2. Select an image file from file picker<br>3. Verify image uploads<br>4. Verify attachment appears in composer |
| **Expected Result** | Image file picker opens (filtered to images), file uploads, attachment preview shows with file name |
| **Actual Result** | |

### TC-CHAT-FE-023: Chat Page - Remove Attachment
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-023 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Attachment management |
| **Description** | User removes an attached file before sending |
| **Preconditions** | A file is attached in the composer |
| **Steps** | 1. Click "x" button on the attachment preview<br>2. Verify attachment is removed |
| **Expected Result** | Attachment is removed from composer, file is no longer attached to message |
| **Actual Result** | |

### TC-CHAT-FE-024: Chat Page - Camera Modal Open
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-024 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Camera modal |
| **Description** | User opens camera modal to capture photo/video |
| **Preconditions** | User is on chat page with camera permissions |
| **Steps** | 1. Click the camera icon in composer toolbar<br>2. Verify camera modal opens |
| **Expected Result** | Camera modal opens showing live camera feed |
| **Actual Result** | |

### TC-CHAT-FE-025: Chat Page - Camera Photo Capture
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-025 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Camera photo capture |
| **Description** | User captures a photo using camera modal |
| **Preconditions** | Camera modal is open in photo mode |
| **Steps** | 1. Ensure "Photo" tab is selected<br>2. Click "Snap" button<br>3. Verify photo is captured and uploaded |
| **Expected Result** | Photo is captured from camera feed, uploaded, and appears as attachment in composer |
| **Actual Result** | |

### TC-CHAT-FE-026: Chat Page - Camera Video Recording Start
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-026 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Camera video recording |
| **Description** | User starts recording a video using camera modal |
| **Preconditions** | Camera modal is open in video mode |
| **Steps** | 1. Ensure "Video" tab is selected<br>2. Click "Record" button<br>3. Verify recording starts and timer shows |
| **Expected Result** | Video recording starts, recording indicator shows, timer displays elapsed time |
| **Actual Result** | |

### TC-CHAT-FE-027: Chat Page - Camera Video Recording Stop
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-027 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Camera video recording |
| **Description** | User stops recording a video |
| **Preconditions** | Video is being recorded |
| **Steps** | 1. While recording, click "Stop" button<br>2. Verify video uploads |
| **Expected Result** | Video recording stops, video uploads and appears as attachment in composer, modal closes |
| **Actual Result** | |

### TC-CHAT-FE-028: Chat Page - Camera Video Maximum Duration
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-028 |
| **Module Name** | Chat |
| **Type** | Frontend (Boundary) |
| **Page/Component/API** | /chat page - Camera video recording |
| **Description** | Verify video recording automatically stops at 30 second limit |
| **Preconditions** | User starts recording a video |
| **Steps** | 1. Start recording a video<br>2. Record for 30 seconds<br>3. Verify recording automatically stops |
| **Expected Result** | Recording automatically stops at 30 seconds, toast message "Video clips are limited to 30 seconds." appears |
| **Actual Result** | |

### TC-CHAT-FE-029: Chat Page - Camera Modal Cancel
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-029 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Camera modal |
| **Description** | User cancels camera modal without capturing |
| **Preconditions** | Camera modal is open |
| **Steps** | 1. Click "Cancel" or "Close" button<br>2. Verify modal closes |
| **Expected Result** | Camera modal closes, no attachment is added to composer |
| **Actual Result** | |

### TC-CHAT-FE-030: Chat Page - Message Display with Voice Attachment
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-030 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Message rendering |
| **Description** | Verify voice message is displayed with audio player |
| **Preconditions** | A message with voice attachment exists in chat |
| **Steps** | 1. View the message with voice attachment<br>2. Verify "Voice message" label appears<br>3. Verify audio player is visible<br>4. Verify duration is shown |
| **Expected Result** | Message shows "Voice message" label with duration, audio player with controls is displayed |
| **Actual Result** | |

### TC-CHAT-FE-031: Chat Page - Message Display with Image Attachment
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-031 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Message rendering |
| **Description** | Verify image attachment is displayed correctly |
| **Preconditions** | A message with image attachment exists in chat |
| **Steps** | 1. View the message with image attachment<br>2. Verify "Photo attachment" label appears<br>3. Verify image is rendered |
| **Expected Result** | Message shows "Photo attachment" label, image is rendered with proper styling |
| **Actual Result** | |

### TC-CHAT-FE-032: Chat Page - Message Display with Video Attachment
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-032 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Message rendering |
| **Description** | Verify video attachment is displayed correctly |
| **Preconditions** | A message with video attachment exists in chat |
| **Steps** | 1. View the message with video attachment<br>2. Verify "Video attachment" label appears<br>3. Verify video player is rendered |
| **Expected Result** | Message shows "Video attachment" label, video player with controls is displayed |
| **Actual Result** | |

### TC-CHAT-FE-033: Chat Page - Message Display with File Attachment
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-033 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Message rendering |
| **Description** | Verify file attachment is displayed correctly |
| **Preconditions** | A message with file attachment exists in chat |
| **Steps** | 1. View the message with file attachment<br>2. Verify "File attachment" label appears<br>3. Verify file name and download link are displayed |
| **Expected Result** | Message shows "File attachment" label with file name as clickable download link |
| **Actual Result** | |

### TC-CHAT-FE-034: Chat Page - Text-to-Speech (TTS)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-034 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - TTS feature |
| **Description** | User plays assistant message using text-to-speech |
| **Preconditions** | Assistant has sent a text message |
| **Steps** | 1. Click "Listen" button on an assistant message<br>2. Verify audio playback starts<br>3. Click "Stop" button while playing |
| **Expected Result** | "Listen" button starts TTS playback, "Stop" button stops playback |
| **Actual Result** | |

### TC-CHAT-FE-035: Chat Page - Auto-scroll to New Messages
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-035 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Message scrolling |
| **Description** | Verify chat auto-scrolls to bottom when new messages arrive |
| **Preconditions** | Chat has scrolled up to view older messages |
| **Steps** | 1. Scroll up in chat to view older messages<br>2. Send a new message<br>3. Verify scroll position changes |
| **Expected Result** | Chat automatically scrolls to bottom showing newest message |
| **Actual Result** | |

### TC-CHAT-FE-036: Chat Page - Usage Overview Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-036 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Usage overview |
| **Description** | Verify usage overview stats are displayed correctly |
| **Preconditions** | User is on chat page with messages |
| **Steps** | 1. View "Usage Overview" section in right sidebar<br>2. Verify requests count<br>3. Verify average latency<br>4. Verify estimated cost |
| **Expected Result** | Usage overview shows: number of user messages sent, average latency (from active model), estimated cost |
| **Actual Result** | |

### TC-CHAT-FE-037: Chat Page - Send Message During Recording
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-037 |
| **Module Name** | Chat |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /chat page - Message composer |
| **Description** | User attempts to send message while voice note is recording |
| **Preconditions** | Voice note recording is in progress |
| **Steps** | 1. Start recording a voice note<br>2. Attempt to click "Send" button<br>3. Verify toast message appears |
| **Expected Result** | Toast message "Stop recording before sending your message." appears, message is not sent |
| **Actual Result** | |

### TC-CHAT-FE-038: Chat Page - Send Message During Camera Recording
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-038 |
| **Module Name** | Chat |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /chat page - Message composer |
| **Description** | User attempts to send message while camera is recording |
| **Preconditions** | Camera video recording is in progress |
| **Steps** | 1. Start recording a video in camera modal<br>2. Attempt to send message from main page<br>3. Verify toast message appears |
| **Expected Result** | Toast message "Stop recording before sending your message." appears, message is not sent |
| **Actual Result** | |

### TC-CHAT-FE-039: Chat Page - Send During Attachment Upload
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-039 |
| **Module Name** | Chat |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /chat page - Message composer |
| **Description** | User attempts to send message while attachment is uploading |
| **Preconditions** | Attachment upload is in progress |
| **Steps** | 1. Attach a file<br>2. While "Uploading attachment..." is showing, click "Send" button<br>3. Verify toast message appears |
| **Expected Result** | Toast message "Wait for attachment upload to finish before sending." appears, message is not sent |
| **Actual Result** | |

### TC-CHAT-FE-040: Chat Page - Chat History Sync Indicator
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-FE-040 |
| **Module Name** | Chat |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Chat history |
| **Description** | Verify sync indicator appears when fetching chat history for authenticated user |
| **Preconditions** | Authenticated user navigates to chat page |
| **Steps** | 1. Login as authenticated user<br>2. Navigate to /chat<br>3. Observe header area |
| **Expected Result** | "Syncing history..." text appears in header while chat history is being fetched |
| **Actual Result** | |

---

## BACKEND TEST CASES

### TC-CHAT-BE-001: POST /chat/send - Successful Message (Authenticated)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-001 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Authenticated user sends a text message |
| **Preconditions** | User is authenticated with valid JWT token |
| **Steps** | 1. Send POST request to /api/chat/send with Authorization: Bearer {token}<br>2. Body: { "message": "Hello", "modelId": "gpt-4o-mini", "sessionId": "session-id", "type": "text" }<br>3. Verify response |
| **Expected Result** | HTTP 200 OK, response contains { "reply": "string", "sessionId": "string", "session": { messages, title, etc. } } |
| **Actual Result** | |

### TC-CHAT-BE-002: POST /chat/send - Successful Message (Guest)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-002 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Guest user sends a text message with session ID header |
| **Preconditions** | Guest session exists (not authenticated) |
| **Steps** | 1. Send POST request to /api/chat/send with header: x-session-id: {guest_session_id}<br>2. Body: { "message": "Hello", "modelId": "gpt-4o-mini", "sessionId": "session-id", "type": "text" }<br>3. Verify response |
| **Expected Result** | HTTP 200 OK, response contains { "reply", "sessionId", "session" } |
| **Actual Result** | |

### TC-CHAT-BE-003: POST /chat/send - Missing Message Field
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-003 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Attempt to send message without message field |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "modelId": "gpt-4o-mini" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: message is required |
| **Actual Result** | |

### TC-CHAT-BE-004: POST /chat/send - Empty Message
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-004 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Attempt to send empty message |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "", "modelId": "gpt-4o-mini" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: message must be at least 1 character |
| **Actual Result** | |

### TC-CHAT-BE-005: POST /chat/send - Message Below Minimum (0 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-005 |
| **Module Name** | Chat |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Attempt to send message with 0 characters |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "", "modelId": "gpt-4o-mini" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: message must be at least 1 character |
| **Actual Result** | |

### TC-CHAT-BE-006: POST /chat/send - Message At Minimum (1 char)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-006 |
| **Module Name** | Chat |
| **Type** | Backend (Boundary) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Send message with exactly 1 character |
| **Preconditions** | User is authenticated or guest |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "A", "modelId": "gpt-4o-mini" }<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, message is processed and response returned |
| **Actual Result** | |

### TC-CHAT-BE-007: POST /chat/send - Message Above Maximum (10001 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-007 |
| **Module Name** | Chat |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Attempt to send message more than 10000 characters (10001 chars) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "A".repeat(10001), "modelId": "gpt-4o-mini" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: message must not exceed 10000 characters |
| **Actual Result** | |

### TC-CHAT-BE-008: POST /chat/send - Message At Maximum (10000 chars)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-008 |
| **Module Name** | Chat |
| **Type** | Backend (Boundary) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Send message with exactly 10000 characters |
| **Preconditions** | User is authenticated or guest |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "A".repeat(10000), "modelId": "gpt-4o-mini" }<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, message is processed and response returned |
| **Actual Result** | |

### TC-CHAT-BE-009: POST /chat/send - Missing ModelId
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-009 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Attempt to send message without modelId |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "Hello" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: modelId is required |
| **Actual Result** | |

### TC-CHAT-BE-010: POST /chat/send - Invalid Type Value
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-010 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Attempt to send message with invalid type value |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "Hello", "modelId": "gpt-4o-mini", "type": "invalid" }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: type must be 'text' or 'voice' |
| **Actual Result** | |

### TC-CHAT-BE-011: POST /chat/send - Voice Message with AudioUrl
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-011 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Send voice message with audio URL |
| **Preconditions** | User is authenticated or guest |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "Voice message", "modelId": "gpt-4o-mini", "type": "voice", "audioUrl": "data:audio/webm;base64,...", "audioDurationMs": 5000 }<br>2. Verify response |
| **Expected Result** | HTTP 200 OK, voice message is processed, response contains assistant reply |
| **Actual Result** | |

### TC-CHAT-BE-012: POST /chat/send - Message with Attachments
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-012 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Send message with file attachments |
| **Preconditions** | User is authenticated or guest, files have been uploaded |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "Check this file", "modelId": "gpt-4o-mini", "attachments": [{ "name": "file.pdf", "url": "/uploads/uuid.pdf", "mimeType": "application/pdf", "kind": "file", "size": 1024 }] }<br>2. Verify response |
| **Expected Result** | HTTP 200 OK, message with attachments is processed, response contains assistant reply |
| **Actual Result** | |

### TC-CHAT-BE-013: POST /chat/send - Invalid Attachment Kind
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-013 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Attempt to send message with invalid attachment kind |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "Hello", "modelId": "gpt-4o-mini", "attachments": [{ "name": "file.pdf", "url": "/uploads/file.pdf", "mimeType": "application/pdf", "kind": "invalid" }] }<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, validation error: kind must be 'image', 'video', or 'file' |
| **Actual Result** | |

### TC-CHAT-BE-014: POST /chat/send - New Session Creation
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-014 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Send first message to create new session (no sessionId provided) |
| **Preconditions** | User is authenticated or guest |
| **Steps** | 1. Send POST request to /api/chat/send with body: { "message": "First message", "modelId": "gpt-4o-mini" } (no sessionId)<br>2. Verify response contains new sessionId |
| **Expected Result** | HTTP 200 OK, new session is created with unique sessionId in response |
| **Actual Result** | |

### TC-CHAT-BE-015: POST /chat/session - Create New Session (Authenticated)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-015 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | POST /api/chat/session |
| **Description** | Authenticated user creates a new chat session |
| **Preconditions** | User is authenticated with valid JWT token |
| **Steps** | 1. Send POST request to /api/chat/session with Authorization: Bearer {token}<br>2. Body: { "modelId": "gpt-4o-mini", "title": "Support Chat" }<br>3. Verify response |
| **Expected Result** | HTTP 201 Created, response contains { "sessionId": "string", "session": { id, title, modelId, messages, createdAt, updatedAt } } |
| **Actual Result** | |

### TC-CHAT-BE-016: POST /chat/session - Create Session with Optional Fields
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-016 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | POST /api/chat/session |
| **Description** | Create session without optional modelId and title |
| **Preconditions** | User is authenticated |
| **Steps** | 1. Send POST request to /api/chat/session with body: {}<br>2. Verify response |
| **Expected Result** | HTTP 201 Created, session is created with default modelId and auto-generated title |
| **Actual Result** | |

### TC-CHAT-BE-017: GET /chat/session/:id - Get User Session
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-017 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | GET /api/chat/session/:id |
| **Description** | Retrieve a specific chat session by ID |
| **Preconditions** | User is authenticated, session exists and belongs to user |
| **Steps** | 1. Send GET request to /api/chat/session/{session_id} with Authorization: Bearer {token}<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains full session object with messages, title, modelId, timestamps |
| **Actual Result** | |

### TC-CHAT-BE-018: GET /chat/session/:id - Get Non-Existent Session
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-018 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/chat/session/:id |
| **Description** | Attempt to retrieve non-existent session |
| **Preconditions** | User is authenticated |
| **Steps** | 1. Send GET request to /api/chat/session/{non_existent_id} with Authorization: Bearer {token}<br>2. Verify response status code |
| **Expected Result** | HTTP 404 Not Found, error message "Session not found or access denied" |
| **Actual Result** | |

### TC-CHAT-BE-019: GET /chat/session/:id - Get Other User's Session
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-019 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/chat/session/:id |
| **Description** | Attempt to retrieve session owned by different user |
| **Preconditions** | User A is authenticated, session exists but belongs to user B |
| **Steps** | 1. Send GET request to /api/chat/session/{other_user_session_id} with user A's token<br>2. Verify response status code |
| **Expected Result** | HTTP 404 Not Found or 403 Forbidden, error message "Session not found or access denied" |
| **Actual Result** | |

### TC-CHAT-BE-020: DELETE /chat/session/:id - Delete Session
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-020 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | DELETE /api/chat/session/:id |
| **Description** | Delete a specific chat session |
| **Preconditions** | User is authenticated, session exists and belongs to user |
| **Steps** | 1. Send DELETE request to /api/chat/session/{session_id} with Authorization: Bearer {token}<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains { "success": true }, session is deleted |
| **Actual Result** | |

### TC-CHAT-BE-021: DELETE /chat/session/:id - Delete Non-Existent Session
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-021 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | DELETE /api/chat/session/:id |
| **Description** | Attempt to delete non-existent session |
| **Preconditions** | User is authenticated |
| **Steps** | 1. Send DELETE request to /api/chat/session/{non_existent_id} with Authorization: Bearer {token}<br>2. Verify response status code |
| **Expected Result** | HTTP 404 Not Found, error message "Session not found or access denied" |
| **Actual Result** | |

### TC-CHAT-BE-022: GET /chat/history - Get Chat History (Authenticated)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-022 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | GET /api/chat/history |
| **Description** | Retrieve paginated chat history for authenticated user |
| **Preconditions** | User is authenticated with valid JWT token |
| **Steps** | 1. Send GET request to /api/chat/history?page=1&limit=20 with Authorization: Bearer {token}<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains { "data": [session objects...], pagination info } |
| **Actual Result** | |

### TC-CHAT-BE-023: GET /chat/history - History with Custom Pagination
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-023 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | GET /api/chat/history |
| **Description** | Retrieve chat history with custom page and limit |
| **Preconditions** | User is authenticated with sufficient sessions |
| **Steps** | 1. Send GET request to /api/chat/history?page=2&limit=10 with Authorization: Bearer {token}<br>2. Verify response |
| **Expected Result** | HTTP 200 OK, response returns page 2 of sessions with 10 items per page |
| **Actual Result** | |

### TC-CHAT-BE-024: GET /chat/history - History Without Auth
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-024 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | GET /api/chat/history |
| **Description** | Attempt to retrieve chat history without authentication |
| **Preconditions** | User is not authenticated |
| **Steps** | 1. Send GET request to /api/chat/history without Authorization header<br>2. Verify response status code |
| **Expected Result** | HTTP 401 Unauthorized, error message indicating authentication required |
| **Actual Result** | |

### TC-CHAT-BE-025: GET /chat/history - Empty History
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-025 |
| **Module Name** | Chat |
| **Type** | Backend |
| **Page/Component/API** | GET /api/chat/history |
| **Description** | Retrieve chat history for user with no sessions |
| **Preconditions** | User is authenticated but has no chat sessions |
| **Steps** | 1. Send GET request to /api/chat/history with Authorization: Bearer {token}<br>2. Verify response |
| **Expected Result** | HTTP 200 OK, response contains { "data": [] } (empty array) |
| **Actual Result** | |

### TC-CHAT-BE-026: POST /chat/send - Guest Without Session Header
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-026 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Guest attempts to send message without X-Session-Id header |
| **Preconditions** | User is not authenticated |
| **Steps** | 1. Send POST request to /api/chat/send without Authorization and X-Session-Id headers<br>2. Body: { "message": "Hello", "modelId": "gpt-4o-mini" }<br>3. Verify response |
| **Expected Result** | HTTP 200 OK (guest is allowed), new session is created automatically |
| **Actual Result** | |

### TC-CHAT-BE-027: POST /chat/send - Guest with Invalid Session
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-BE-027 |
| **Module Name** | Chat |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/chat/send |
| **Description** | Guest attempts to send message with invalid session ID |
| **Preconditions** | User is not authenticated |
| **Steps** | 1. Send POST request to /api/chat/send with header: x-session-id: invalid_id<br>2. Body: { "message": "Hello", "modelId": "gpt-4o-mini", "sessionId": "invalid_id" }<br>3. Verify response |
| **Expected Result** | HTTP 200 OK (new session is created) or 404 (if sessionId validation exists) |
| **Actual Result** | |

---

## INTEGRATION TEST CASES

### TC-CHAT-INT-001: Complete Message Send Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-INT-001 |
| **Module Name** | Chat |
| **Type** | Integration |
| **Page/Component/API** | Frontend chat + Backend send API |
| **Description** | Verify complete message flow from UI send to API response to UI display |
| **Preconditions** | User is on chat page, authenticated or guest |
| **Steps** | 1. Enter text in message textarea<br>2. Click "Send" button<br>3. Verify optimistic message appears immediately in UI<br>4. Verify API request is sent to POST /api/chat/send<br>5. Verify typing indicator shows<br>6. Verify API response is received<br>7. Verify assistant response appears in chat<br>8. Verify session is updated in recent chats list |
| **Expected Result** | Message flow completes: user message displays optimistically, API is called, typing indicator shows, assistant response displays, session updates |
| **Actual Result** | |

### TC-CHAT-INT-002: Chat Session Persistence Across Refresh
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-INT-002 |
| **Module Name** | Chat |
| **Type** | Integration |
| **Page/Component/API** | Chat session management + localStorage |
| **Description** | Verify chat sessions persist across page refresh for authenticated users |
| **Preconditions** | User is authenticated with active chat session containing messages |
| **Steps** | 1. Send messages in chat to create session<br>2. Refresh browser page<br>3. Verify messages are restored<br>4. Verify active session is selected |
| **Expected Result** | Chat session and messages are restored from cache/API after page refresh |
| **Actual Result** | |

### TC-CHAT-INT-003: Guest Session Persistence in Tab
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-INT-003 |
| **Module Name** | Chat |
| **Type** | Integration |
| **Page/Component/API** | Guest session + sessionStorage |
| **Description** | Verify guest session persists in browser tab using sessionStorage |
| **Preconditions** | User is guest with active session |
| **Steps** | 1. Start guest session and send messages<br>2. Navigate to different page within same tab<br>3. Navigate back to /chat<br>4. Verify messages are restored |
| **Expected Result** | Guest session and messages are restored from sessionStorage on return to /chat |
| **Actual Result** | |

### TC-CHAT-INT-004: File Upload and Message Send Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-INT-004 |
| **Module Name** | Chat |
| **Type** | Integration |
| **Page/Component/API** | Upload API + Chat send API |
| **Description** | Verify complete flow: upload file, attach to message, send message |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Click file attachment icon<br>2. Select a file<br>3. Verify upload request to POST /api/upload<br>4. Verify file URL is returned<br>5. Verify attachment preview appears<br>6. Enter text and send message<br>7. Verify chat/send API includes attachment data<br>8. Verify message displays with attachment |
| **Expected Result** | File uploads successfully, attachment is included in message, message with attachment displays correctly |
| **Actual Result** | |

### TC-CHAT-INT-005: Voice Note Recording and Send Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-INT-005 |
| **Module Name** | Chat |
| **Type** | Integration |
| **Page/Component/API** | Voice recording + Chat send API |
| **Description** | Verify complete flow: record voice note, attach to message, send message |
| **Preconditions** | User is on chat page with microphone permissions |
| **Steps** | 1. Click record button<br>2. Record voice for a few seconds<br>3. Click stop button<br>4. Verify audio blob is created and previewed<br>5. Send message with voice note<br>6. Verify API includes type: "voice", audioUrl, audioDurationMs<br>7. Verify message displays with audio player |
| **Expected Result** | Voice note records successfully, is sent with proper metadata, message displays with playable audio |
| **Actual Result** | |

### TC-CHAT-INT-006: API Error Handling - Message Send Failure
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-INT-006 |
| **Module Name** | Chat |
| **Type** | Integration (Negative) |
| **Page/Component/API** | Frontend chat + Backend error |
| **Description** | Verify frontend handles API failure gracefully with fallback response |
| **Preconditions** | Backend API is failing or unreachable |
| **Steps** | 1. Send a message<br>2. Simulate API failure (network error or server error)<br>3. Verify fallback response is displayed<br>4. Verify toast message appears |
| **Expected Result** | Fallback mock response is displayed, toast "Chat sync failed. Your conversation was cached locally." appears |
| **Actual Result** | |

### TC-CHAT-INT-007: Model Selection and Message Send Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-INT-007 |
| **Module Name** | Chat |
| **Type** | Integration |
| **Page/Component/API** | Model selection + Chat send |
| **Description** | Verify selected model is used in API request |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Click on a different model in sidebar (e.g., Claude Opus)<br>2. Verify modelId in header updates<br>3. Send a message<br>4. Verify API request includes correct modelId in request body |
| **Expected Result** | Selected model's ID is sent in the API request, response uses that model |
| **Actual Result** | |

### TC-CHAT-INT-008: Chat History Fetch on Page Load
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-INT-008 |
| **Module Name** | Chat |
| **Type** | Integration |
| **Page/Component/API** | Chat page load + History API |
| **Description** | Verify chat history is fetched and displayed for authenticated user on page load |
| **Preconditions** | User is authenticated with previous chat sessions |
| **Steps** | 1. Navigate to /chat page<br>2. Verify "Syncing history..." indicator shows<br>3. Verify API request to GET /api/chat/history<br>4. Verify history loads and populates recent chats list |
| **Expected Result** | Chat history is fetched from API, recent chats are displayed in right sidebar |
| **Actual Result** | |

### TC-CHAT-INT-009: Session Creation with URL Parameter
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-INT-009 |
| **Module Name** | Chat |
| **Type** | Integration |
| **Page/Component/API** | URL parameters + Session API |
| **Description** | Verify navigating to /chat?session={id} loads that specific session |
| **Preconditions** | User is authenticated, session with ID exists |
| **Steps** | 1. Navigate directly to /chat?session={existing_session_id}<br>2. Verify API call to GET /api/chat/session/{id}<br>3. Verify session loads with all messages<br>4. Verify messages display in chat area |
| **Expected Result** | Specified session is fetched from API and loaded with all messages displayed |
| **Actual Result** | |

### TC-CHAT-INT-010: Real-time Message Updates (Optimistic UI)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-CHAT-INT-010 |
| **Module Name** | Chat |
| **Type** | Integration |
| **Page/Component/API** | Optimistic UI updates + API responses |
| **Description** | Verify optimistic UI updates for instant feedback while waiting for API |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Enter message and click Send<br>2. Measure time until user message appears<br>3. Measure time until assistant response appears after API returns |
| **Expected Result** | User message appears immediately (optimistic), typing indicator shows, assistant response appears after API completes |
| **Actual Result** | |
