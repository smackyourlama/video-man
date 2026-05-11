# Project Name: Video Man

## Mission
To build a comprehensive video processing and publishing platform that integrates AI for script/title generation, utilizes FFmpeg for video processing, and automates YouTube uploads.

## Detailed Layout

### 1. Architecture Overview
Client-server architecture with a web-based frontend dashboard and a Node.js/Express backend handling API requests, file uploads, video processing tasks, and third-party integrations (AI and YouTube).

### 2. Module Breakdown
*   **Backend API:** Handles requests, file routing.
*   **Frontend Dashboard:** UI for users to upload video, input topics, and manage uploads.
*   **AI Integration:** Module to generate video scripts and titles based on topics.
*   **Video Processing:** FFmpeg wrapper to apply transformations or process video files.
*   **YouTube Uploader:** Module utilizing YouTube Data API to upload processed videos.

### 3. Key Features and Implementation Details
*   **Feature 1: Script & Title Generation**
    *   **Description:** AI generates script and title.
    *   **Implementation:** Mocked or OpenAI API (depending on env vars).
*   **Feature 2: Video Processing**
    *   **Description:** Process uploaded videos.
    *   **Implementation:** Fluent-FFmpeg to process video (e.g., adding text, resizing, or converting).
*   **Feature 3: YouTube Upload**
    *   **Description:** Direct upload to YouTube.
    *   **Implementation:** YouTube Data API integration.

### 4. Technology Stack
*   **Backend:** Node.js, Express, Multer
*   **Frontend:** HTML, CSS, JavaScript
*   **Other Tools/Libraries:** FFmpeg (fluent-ffmpeg), Axios, dotenv

### 5. Deployment Considerations
*   **Environment:** Local development or VPS.

### 6. Testing Strategy
*   **Unit Tests:** Test individual API endpoints via demo scripts.

### 7. Security Considerations
*   Environment variables for API keys.
*   Input validation for uploads.

## Progress Notes

### 2026-04-30 10:30 EDT - Initial Plan and Setup
*   Created mission plan.
*   Reviewed existing `server.js` mocks.
*   Next steps: Implement actual FFmpeg processing and ensure frontend dashboard exists.

## Dependencies/Prerequisites
*   FFmpeg installed on the system.
*   Node.js modules installed.

## Acceptance Criteria
*   Backend API running.
*   Video processed correctly with FFmpeg.
*   Demo job executed successfully (without actual YouTube upload).

### 2026-04-30 10:35 EDT - Completion
* Implemented FFmpeg processing.
* Fixed demo job to run properly.
* Verified demo job runs without errors and skips YouTube upload.

### 2026-05-10 20:58 EDT - Continuous 1000-upload scheduler
* Added a persistent scheduler state layer in `scheduler_state.js` backed by `data/scheduler_state.json`.
* Reworked `scheduler.js` into a resumable sequential loop that creates, uploads, and schedules videos one at a time until the configured target is reached.
* Scheduler now stores `currentJob`, `completedUploads`, `failedUploads`, `nextPublishAt`, and job history so it can resume after interruptions.
* Updated `run.js` to return structured job results and throw real errors so scheduler retries/failures can be tracked correctly.
* Updated `video_processor.js` so uploads can be scheduled with YouTube `publishAt` instead of only immediate public publishing.
* Added `npm run scheduler:start` for launching the continuous scheduler.
* Current default cadence is controlled by `VIDEOMAN_PUBLISH_INTERVAL_MINUTES` and defaults to 60 minutes unless overridden.
