# VideoMan Locked Voice Profiles

## Purpose

This system locks one narrator voice to each YouTube channel and routes all narration through a single central Chatterbox voice service.

Channels covered:
- Operator Logic
- Terminalecho
- Blackledger
- NullSignal

## Rules

- No random voices.
- No per-video voice switching.
- No fallback voices.
- No direct Chatterbox or TTS calls outside `src/audio/chatterbox_voice_service.py`.
- Only licensed, public-domain, or owned reference voice files may be used.

## Directory Layout

- `assets/voices/<channel>/reference.wav` — real approved voice reference file
- `config/voice_profiles/*.json` — locked channel voice definitions
- `src/audio/voice_profile_loader.py` — validates and loads profiles
- `src/audio/chatterbox_voice_service.py` — single narration entrypoint
- `src/audio/voice_audit.py` — compliance checks
- `scripts/test_voice_profiles.py` — profile validation
- `scripts/audit_voice_pipeline.py` — pipeline audit

## Runtime Contract

All narration generation must call:

```bash
python3 src/audio/chatterbox_voice_service.py \
  --channel "Operator Logic" \
  --text-file /path/to/script.txt \
  --output /path/to/audio.wav
```

If a profile or `reference.wav` is missing, the system fails clearly.

## Adding Reference Audio

1. Put the approved voice file into the correct channel folder as `reference.wav`.
2. Run `scripts/test_voice_profiles.py`.
3. Run `scripts/audit_voice_pipeline.py`.
4. Generate a sample into `outputs/voice_tests/` before using it in production.

## Current State

This scaffolding intentionally does **not** generate fake audio for missing references.
Until each `reference.wav` is added, profile validation will fail by design.
