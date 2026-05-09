# VideoMan 2.0 - Core Upgrades Blueprint

## UPGRADE 1: ANALYTICS FEEDBACK LOOP
- **Goal:** Collect performance data (24h, 72h, 7d, 30d) to identify winning topics, titles, and thumbnails.
- **Components:** `analytics_feedback.py`, new SQLite tables (`youtube_analytics`, `video_performance_scores`).
- **Scoring:** 0-100 based on CTR, retention, subscribers, affiliate clicks, revenue.
- **Reporting:** Auto-generate recommendations (e.g., "Make more Terminalecho videos about password managers").

## UPGRADE 2: SHORTS TESTING SYSTEM
- **Goal:** Use 30-45s vertical Shorts as cheap market tests before rendering full 7-minute videos.
- **Components:** `shorts_testing.py`, config `shorts.yaml`.
- **Workflow:** Generate 10 ideas -> Score -> Script -> Render -> Analyze -> Promote to full video if metrics hit threshold.
- **Format:** Vertical 9:16, strong 2-second hook, fast pacing, captions required.

## UPGRADE 3: AFFILIATE CONVERSION TRACKING
- **Goal:** Connect specific videos/topics to actual affiliate revenue.
- **Components:** `affiliate_tracking.py`, config `affiliate_tracking.yaml`, link validation.
- **Tracking Structure:** Inject UTMs (`utm_source=youtube&utm_campaign={channel}_{slug}`). 
- **Amazon Rules:** Preserve Associate IDs (`nicco00a-20`), ensure FTC disclosures are enforced.

## UPGRADE 4: CHANNEL STYLE BIBLE SYSTEM
- **Goal:** Enforce strict brand identities (Voice, Visuals, Thumbnails, Titles, Affiliates) so channels don't bleed together.
- **Components:** `channel_style_bible.py`, `brand_qa.py`, config `channel_style_bibles.yaml`.
- **Brand QA:** Blocks upload if the script/thumbnail scores below 80 on brand alignment.
  - **Operator Logic:** Tactical, smart-money, business acquisitions.
  - **Terminal Echo:** Sharp, cyber analyst, OSINT, privacy.
  - **Black Ledger:** Dark finance documentary, market control.
  - **Null Signal:** Cinematic, surveillance economy, hidden systems.

## ARCHITECTURE INTEGRATION
These 4 modules will wrap around the core Generation pipeline (Orchestration Layer).
The pipeline will now:
1. Pull topics from Analytics/Shorts winners.
2. Enforce Style Bible during Script/Thumbnail generation.
3. Attach Tracked Affiliate Links during Description building.
4. Run Brand QA + Normal QA before gating the upload.

*(Full specifications stored in agent memory for execution.)*