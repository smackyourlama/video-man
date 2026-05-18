# VideoMan

Automated YouTube video generation pipeline with:
- OpenAI script generation
- locked Chatterbox voice profiles
- Remotion rendering
- optional YouTube upload flow
- optional Express API server

## Quick start

```bash
npm install
cp .env.example .env
npm test
```

Then fill in the values in `.env`.

## Required env vars

- `OPENAI_API_KEY`
- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `PEXELS_API_KEY`
- `GEMINI_API_KEY`
- `CHATTERBOX_TTS_COMMAND`

## Common commands

```bash
npm test
npm run server:start
npm start
npm run scheduler:start
npm run remotion:preview:operator
npm run remotion:render:operator
```

## First-time YouTube auth

After setting `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET`, get an auth code and save tokens with:

```bash
node save_token.js "<authorization-code>"
```

This creates a local `refresh_token.json` file that is intentionally gitignored.

## Notes

- `uploads/` and `processed/` are created automatically at runtime.
- Voice profiles are validated by `npm test`.
- Chatterbox is intentionally strict: no fallback voices are allowed.
- If you only want generation without upload, pass a payload with `"action":"generate_only"` into the workflow.
