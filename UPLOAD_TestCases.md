# UPLOAD MODULE - TEST CASES

## FRONTEND TEST CASES

### TC-UPL-FE-001: File Attachment Button Click
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-FE-001 |
| **Module Name** | Upload |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - File attachment |
| **Description** | User clicks file attachment button to open file picker |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Click file attachment icon (paperclip) in composer toolbar<br>2. Verify file picker dialog opens<br>3. Verify user can select a file |
| **Expected Result** | File picker dialog opens allowing user to select files |
| **Actual Result** | |

### TC-UPL-FE-002: Image Attachment Button Click
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-FE-002 |
| **Module Name** | Upload |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Image attachment |
| **Description** | User clicks image attachment button to open image picker |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Click image attachment icon (image plus) in composer toolbar<br>2. Verify file picker opens with image filter<br>3. Verify only image files can be selected |
| **Expected Result** | File picker opens filtered to accept image files (image/*) |
| **Actual Result** | |

### TC-UPL-FE-003: File Upload - Progress Indicator
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-FE-003 |
| **Module Name** | Upload |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Upload progress |
| **Description** | Verify upload progress is displayed while file is uploading |
| **Preconditions** | User selects a file to upload |
| **Steps** | 1. Select a large file (1MB+)<br>2. Observe while upload is in progress<br>3. Verify "Uploading attachment..." message appears |
| **Expected Result** | "Uploading attachment..." message is displayed during file upload |
| **Actual Result** | |

### TC-UPL-FE-004: File Upload - Success State
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-FE-004 |
| **Module Name** | Upload |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Upload success |
| **Description** | Verify file attachment appears after successful upload |
| **Preconditions** | File upload completes successfully |
| **Steps** | 1. Wait for upload to complete<br>2. Verify "Uploading attachment..." message disappears<br>3. Verify attachment preview appears in composer<br>4. Verify attachment shows file name and kind icon |
| **Expected Result** | Upload completes, attachment preview displays with file name, file kind icon, and remove button |
| **Actual Result** | |

### TC-UPL-FE-005: File Upload - Remove Before Send
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-FE-005 |
| **Module Name** | Upload |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Attachment management |
| **Description** | User removes attached file before sending message |
| **Preconditions** | A file is attached in the composer |
| **Steps** | 1. Click "x" button on attachment preview<br>2. Verify attachment is removed<br>3. Verify file input is cleared |
| **Expected Result** | Attachment preview is removed, file is no longer attached to message |
| **Actual Result** | |

### TC-UPL-FE-006: File Upload - Error Display
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-FE-006 |
| **Module Name** | Upload |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /chat page - Upload error |
| **Description** | Verify error message is displayed when upload fails |
| **Preconditions** | File upload fails (network error or server error) |
| **Steps** | 1. Select a file<br>2. Simulate upload error<br>3. Verify error toast appears |
| **Expected Result** | Toast message "Could not upload {filename}." appears with error styling |
| **Actual Result** | |

### TC-UPL-FE-007: Multiple File Attachments
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-FE-007 |
| **Module Name** | Upload |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Multiple attachments |
| **Description** | User attaches multiple files to a message |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Click file attachment button<br>2. Select first file and verify it uploads<br>3. Click file attachment button again<br>4. Select second file and verify it uploads<br>5. Verify both attachments are displayed |
| **Expected Result** | Multiple file attachments are displayed in composer with previews for each |
| **Actual Result** | |

### TC-UPL-FE-008: Camera Photo Upload Progress
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-FE-008 |
| **Module Name** | Upload |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Camera upload |
| **Description** | Verify upload progress indicator when capturing photo |
| **Preconditions** | Camera modal is open in photo mode |
| **Steps** | 1. Click "Snap" button<br>2. Verify photo is captured<br>3. Verify "Uploading camera attachment..." message appears |
| **Expected Result** | "Uploading camera attachment..." message is displayed while photo uploads |
| **Actual Result** | |

### TC-UPL-FE-009: Camera Video Upload Progress
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-FE-009 |
| **Module Name** | Upload |
| **Type** | Frontend |
| **Page/Component/API** | /chat page - Camera video upload |
| **Description** | Verify upload progress indicator when recording video |
| **Preconditions** | Camera modal is open in video mode, video was recorded |
| **Steps** | 1. After recording, video uploads<br>2. Verify "Uploading camera attachment..." message appears<br>3. Verify modal stays open during upload |
| **Expected Result** | "Uploading camera attachment..." message is displayed while video uploads |
| **Actual Result** | |

### TC-UPL-FE-010: Send Disabled During Upload
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-FE-010 |
| **Module Name** | Upload |
| **Type** | Frontend (Negative) |
| **Page/Component/API** | /chat page - Message composer |
| **Description** | Verify send button is disabled while attachment is uploading |
| **Preconditions** | File attachment is being uploaded |
| **Steps** | 1. Start uploading a file<br>2. Attempt to click "Send" button<br>3. Verify toast message appears<br>4. Verify send button is not functional |
| **Expected Result** | Toast "Wait for attachment upload to finish before sending." appears, send is blocked |
| **Actual Result** | |

---

## BACKEND TEST CASES

### TC-UPL-BE-001: POST /upload - Successful File Upload (Image)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-001 |
| **Module Name** | Upload |
| **Type** | Backend |
| **Page/Component/API** | POST /api/upload |
| **Description** | Upload an image file successfully |
| **Preconditions** | File is a valid image under 50MB |
| **Steps** | 1. Send POST multipart/form-data to /api/upload with file field containing valid JPG image<br>2. Verify response status code<br>3. Verify response body |
| **Expected Result** | HTTP 200 OK, response contains { "url": "/uploads/{uuid}.jpg", "originalName": "filename.jpg", "size": number, "type": "image/jpeg" } |
| **Actual Result** | |

### TC-UPL-BE-002: POST /upload - Successful File Upload (Video)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-002 |
| **Module Name** | Upload |
| **Type** | Backend |
| **Page/Component/API** | POST /api/upload |
| **Description** | Upload a video file successfully |
| **Preconditions** | File is a valid video under 50MB |
| **Steps** | 1. Send POST multipart/form-data to /api/upload with file field containing valid MP4 video<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains { "url": "/uploads/{uuid}.mp4", "originalName": "filename.mp4", "size": number, "type": "video/mp4" } |
| **Actual Result** | |

### TC-UPL-BE-003: POST /upload - Successful File Upload (PDF Document)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-003 |
| **Module Name** | Upload |
| **Type** | Backend |
| **Page/Component/API** | POST /api/upload |
| **Description** | Upload a PDF document successfully |
| **Preconditions** | File is a valid PDF under 50MB |
| **Steps** | 1. Send POST multipart/form-data to /api/upload with file field containing valid PDF<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, response contains { "url": "/uploads/{uuid}.pdf", "originalName": "filename.pdf", "size": number, "type": "application/pdf" } |
| **Actual Result** | |

### TC-UPL-BE-004: POST /upload - Missing File Field
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-004 |
| **Module Name** | Upload |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/upload |
| **Description** | Attempt upload without providing file |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST multipart/form-data to /api/upload without file field<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, error message "No file provided" |
| **Actual Result** | |

### TC-UPL-BE-005: POST /upload - File Above Size Limit (51MB)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-005 |
| **Module Name** | Upload |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/upload |
| **Description** | Attempt upload of file larger than 50MB limit (51MB) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST multipart/form-data to /api/upload with file field containing 51MB file<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, error indicating file size exceeds 50MB limit |
| **Actual Result** | |

### TC-UPL-BE-006: POST /upload - File At Size Limit (50MB)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-006 |
| **Module Name** | Upload |
| **Type** | Backend (Boundary) |
| **Page/Component/API** | POST /api/upload |
| **Description** | Upload file exactly at 50MB limit |
| **Preconditions** | File is exactly 50MB |
| **Steps** | 1. Send POST multipart/form-data to /api/upload with file field containing 50MB file<br>2. Verify response status code and body |
| **Expected Result** | HTTP 200 OK, file is uploaded successfully |
| **Actual Result** | |

### TC-UPL-BE-007: POST /upload - Invalid File Type (EXE)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-007 |
| **Module Name** | Upload |
| **Type** | Backend (Negative) |
| **Page/Component/API** | POST /api/upload |
| **Description** | Attempt upload of unauthorized file type (executable) |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST multipart/form-data to /api/upload with file field containing .exe file<br>2. Verify response status code |
| **Expected Result** | HTTP 400 Bad Request, error message "File type application/x-msdownload is not allowed" |
| **Actual Result** | |

### TC-UPL-BE-008: POST /upload - Valid Image Types
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-008 |
| **Module Name** | Upload |
| **Type** | Backend |
| **Page/Component/API** | POST /api/upload |
| **Description** | Upload valid image files of different formats |
| **Preconditions** | Files are valid images under 50MB |
| **Steps** | 1. Upload JPEG file<br>2. Upload PNG file<br>3. Upload GIF file<br>4. Upload WEBP file<br>5. Verify all succeed |
| **Expected Result** | All image types (image/jpeg, image/png, image/gif, image/webp) upload successfully with HTTP 200 |
| **Actual Result** | |

### TC-UPL-BE-009: POST /upload - Valid Video Types
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-009 |
| **Module Name** | Upload |
| **Type** | Backend |
| **Page/Component/API** | POST /api/upload |
| **Description** | Upload valid video files of different formats |
| **Preconditions** | Files are valid videos under 50MB |
| **Steps** | 1. Upload WEBM file<br>2. Upload MP4 file<br>3. Upload MOV file<br>4. Verify all succeed |
| **Expected Result** | All video types (video/webm, video/mp4, video/quicktime) upload successfully with HTTP 200 |
| **Actual Result** | |

### TC-UPL-BE-010: POST /upload - Valid Audio Types
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-010 |
| **Module Name** | Upload |
| **Type** | Backend |
| **Page/Component/API** | POST /api/upload |
| **Description** | Upload valid audio files of different formats |
| **Preconditions** | Files are valid audio under 50MB |
| **Steps** | 1. Upload WEBM audio file<br>2. Upload OGG audio file<br>3. Upload MPEG audio file<br>4. Upload WAV file<br>5. Upload M4A audio file<br>6. Verify all succeed |
| **Expected Result** | All audio types (audio/webm, audio/ogg, audio/mpeg, audio/wav, audio/mp4) upload successfully with HTTP 200 |
| **Actual Result** | |

### TC-UPL-BE-011: POST /upload - Valid Document Types
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-011 |
| **Module Name** | Upload |
| **Type** | Backend |
| **Page/Component/API** | POST /api/upload |
| **Description** | Upload valid document files of different formats |
| **Preconditions** | Files are valid documents under 50MB |
| **Steps** | 1. Upload PDF file<br>2. Upload TXT file<br>3. Upload HTML file<br>4. Upload CSS file<br>5. Upload CSV file<br>6. Upload Markdown file<br>7. Upload JSON file<br>8. Upload YAML file<br>9. Upload XML file<br>10. Upload JS file<br>11. Verify all succeed |
| **Expected Result** | All document types upload successfully with HTTP 200 |
| **Actual Result** | |

### TC-UPL-BE-012: POST /upload - Empty File (0 bytes)
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-012 |
| **Module Name** | Upload |
| **Type** | Backend (Negative/Boundary) |
| **Page/Component/API** | POST /api/upload |
| **Description** | Attempt upload of empty file |
| **Preconditions** | N/A |
| **Steps** | 1. Send POST multipart/form-data to /api/upload with empty file (0 bytes)<br>2. Verify response status code |
| **Expected Result** | HTTP 200 OK (empty file may be accepted) or 400 with appropriate error |
| **Actual Result** | |

### TC-UPL-BE-013: POST /upload - File Name Generation
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-BE-013 |
| **Module Name** | Upload |
| **Type** | Backend |
| **Page/Component/API** | POST /api/upload |
| **Description** | Verify uploaded file is renamed with UUID |
| **Preconditions** | File is uploaded successfully |
| **Steps** | 1. Upload file named "document.pdf"<br>2. Verify response URL contains UUID<br>3. Verify originalName is preserved in response |
| **Expected Result** | Response contains UUID-based filename (e.g., "550e8400-e29b-41d4-a716-446655440000.pdf") and originalName "document.pdf" |
| **Actual Result** | |

---

## INTEGRATION TEST CASES

### TC-UPL-INT-001: Complete File Upload Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-INT-001 |
| **Module Name** | Upload |
| **Type** | Integration |
| **Page/Component/API** | Frontend upload + Backend upload API |
| **Description** | Verify complete file upload flow from file picker to API response to UI attachment |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Click file attachment icon<br>2. Select a valid file (e.g., PDF)<br>3. Verify upload request to POST /api/upload<br>4. Verify "Uploading attachment..." shows in UI<br>5. Verify API response with file URL<br>6. Verify attachment preview appears<br>7. Send message with attachment<br>8. Verify message displays with attachment |
| **Expected Result** | File uploads successfully, attachment appears in composer, message with attachment sends and displays correctly |
| **Actual Result** | |

### TC-UPL-INT-002: Camera Capture and Upload Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-INT-002 |
| **Module Name** | Upload |
| **Type** | Integration |
| **Page/Component/API** | Camera capture + Backend upload API |
| **Description** | Verify complete camera photo capture flow |
| **Preconditions** | User is on chat page with camera permissions |
| **Steps** | 1. Click camera icon to open modal<br>2. Verify camera feed displays<br>3. Click "Snap" button<br>4. Verify photo is captured<br>5. Verify upload request to POST /api/upload<br>6. Verify "Uploading camera attachment..." shows<br>7. Verify API response with image URL<br>8. Verify attachment appears in composer<br>9. Send message with photo attachment<br>10. Verify message displays with photo |
| **Expected Result** | Photo captures, uploads, attaches to message, sends, and displays correctly |
| **Actual Result** | |

### TC-UPL-INT-003: Camera Video Record and Upload Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-INT-003 |
| **Module Name** | Upload |
| **Type** | Integration |
| **Page/Component/API** | Camera video + Backend upload API |
| **Description** | Verify complete camera video recording flow |
| **Preconditions** | User is on chat page with camera permissions |
| **Steps** | 1. Click camera icon to open modal<br>2. Switch to Video tab<br>3. Click "Record" button<br>4. Record for a few seconds<br>5. Click "Stop" button<br>6. Verify upload request to POST /api/upload<br>7. Verify API response with video URL<br>8. Verify attachment appears in composer<br>9. Send message with video attachment<br>10. Verify message displays with video player |
| **Expected Result** | Video records, uploads, attaches to message, sends, and displays with playable video |
| **Actual Result** | |

### TC-UPL-INT-004: Upload Error Handling
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-INT-004 |
| **Module Name** | Upload |
| **Type** | Integration (Negative) |
| **Page/Component/API** | Frontend + Backend error |
| **Description** | Verify frontend handles upload errors gracefully |
| **Preconditions** | Backend upload fails or returns error |
| **Steps** | 1. Select and upload a file<br>2. Simulate backend error (500 Internal Server Error or 400 Bad Request)<br>3. Verify error toast appears<br>4. Verify attachment is not added to composer |
| **Expected Result** | Toast "Could not upload {filename}." appears, no attachment preview shows |
| **Actual Result** | |

### TC-UPL-INT-005: Multiple Files Upload Flow
| Field | Value |
|-------|-------|
| **TestCase ID** | TC-UPL-INT-005 |
| **Module Name** | Upload |
| **Type** | Integration |
| **Page/Component/API** | Multiple file uploads |
| **Description** | Verify multiple files can be uploaded and attached |
| **Preconditions** | User is on chat page |
| **Steps** | 1. Upload first file (image.jpg)<br>2. Verify first attachment appears<br>3. Upload second file (document.pdf)<br>4. Verify second attachment appears<br>5. Send message<br>6. Verify both attachments display in message |
| **Expected Result** | Both files upload successfully, both attachments appear in composer and in sent message |
| **Actual Result** | |
