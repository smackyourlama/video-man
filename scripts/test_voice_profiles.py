#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR / "src" / "audio"))

from voice_profile_loader import VoiceProfileError, load_channel_map, load_voice_profile


def main() -> int:
    results = {}
    exit_code = 0
    for channel in sorted(load_channel_map()):
        try:
            profile = load_voice_profile(channel)
            results[channel] = {
                "status": "ok",
                "voice_profile_id": profile.voice_profile_id,
                "reference_audio_path": str(profile.reference_audio_path),
            }
        except VoiceProfileError as exc:
            results[channel] = {"status": "error", "message": str(exc)}
            exit_code = 1
    print(json.dumps(results, indent=2))
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
