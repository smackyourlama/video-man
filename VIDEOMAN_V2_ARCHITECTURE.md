# VideoMan 2.0 - Production Automation Architecture

## MISSION
Upgrade my existing VideoMan project into a higher-quality automated YouTube video production system.
Turn VideoMan from a basic video generator into a quality-controlled, analytics-driven, self-improving video production machine.

## CORE CHANNELS & VOICES
1. **Operator Logic**: Tactical, calm, business-minded. Niche: Business acquisitions, boring businesses, cash flow.
2. **Terminalecho**: Sharp, technical, cyber analyst. Niche: Cybersecurity, OSINT, privacy, Linux.
3. **Blackledger**: Dark finance documentary, analytical. Niche: Finance, markets, credit, corporate power.
4. **NullSignal**: Mysterious, cinematic, documentary. Niche: Privacy, hidden systems, cyber awareness.

## PRIMARY SYSTEM UPGRADES
1. Topic Scoring Engine
2. Research Brief Generator
3. Multi-Pass Script Generator
4. Hook and Retention Rewrite System
5. Scene Planner for Remotion
6. Channel-Specific Video Template System
7. Thumbnail A/B Generator and Scorer
8. Chatterbox Audio Post-Processing Pipeline
9. Pre-Upload QA Agent
10. YouTube Description + Affiliate Link Mapper
11. Analytics Feedback Loop
12. Monthly Performance Report
13. Configuration-Based Publishing Controls

## TECH STACK
- Node.js / TypeScript for Remotion video rendering
- Python 3.11+ for orchestration, analytics, scoring, QA, and automation
- OpenAI API (gpt-5.4-mini, gpt-image-1-mini, opt: gpt-5.5)
- Chatterbox for TTS voiceover
- FFmpeg for final audio/video assembly
- Google Sheets API for tracking
- YouTube Data API for uploads and analytics
- SQLite for local project state
- dotenv, pydantic/zod

## CRITICAL RULES
- Default mode: dry_run or review_required.
- No automatic uploads unless auto_publish is enabled.
- Videos must be 7m30s (~1050 words).
- Strict QA gating (>= 85 score to upload).
- No placeholder text, broken links, or missing FTC disclosures.
- Do not bypass captchas or scrape paywalled content.

## PHASED BUILD PLAN
- **Phase 1**: Configs, SQLite state tracking, Topic Scoring, QA thresholds.
- **Phase 2**: Research brief, Multi-pass script, Channel voice profiles, Retention rewrite.
- **Phase 3**: Scene planner, Remotion template mapping.
- **Phase 4**: Thumbnail A/B generator & scorer.
- **Phase 5**: Chatterbox audio post-processing & FFmpeg assembly checks.
- **Phase 6**: Pre-upload QA agent, Upload gate, Dry-run mode.
- **Phase 7**: YouTube analytics, Feedback loop, Monthly reports.
- **Phase 8**: Affiliate link mapper, Description builder, UTM tracking.

*(Full specifications stored in agent memory.)*