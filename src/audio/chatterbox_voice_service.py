from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict

from voice_profile_loader import VoiceProfileError, load_voice_profile

ROOT_DIR = Path(__file__).resolve().parents[2]
DEFAULT_WRAPPER = ROOT_DIR / "chatterbox_wrapper.py"


class ChatterboxVoiceServiceError(RuntimeError):
    pass


class ChatterboxVoiceService:
    """Single allowed entrypoint for all Chatterbox narration in VideoMan."""

    def __init__(self, wrapper_path: Path | None = None) -> None:
        self.wrapper_path = (wrapper_path or DEFAULT_WRAPPER).resolve()
        if not self.wrapper_path.exists():
            raise ChatterboxVoiceServiceError(
                f"Chatterbox wrapper not found: {self.wrapper_path}"
            )

    def generate_from_text_file(
        self,
        *,
        channel_name: str,
        text_file: str | Path,
        output_path: str | Path,
        segment_label: str = "main_narration",
    ) -> Dict[str, Any]:
        profile = load_voice_profile(channel_name)
        text_path = Path(text_file).resolve()
        audio_path = Path(output_path).resolve()

        if not text_path.exists():
            raise ChatterboxVoiceServiceError(f"Narration text file missing: {text_path}")

        audio_path.parent.mkdir(parents=True, exist_ok=True)
        command = [
            sys.executable,
            str(self.wrapper_path),
            "--text_file",
            str(text_path),
            "--output",
            str(audio_path),
            "--voice_profile_json",
            str(profile.source_path),
            "--reference_audio",
            str(profile.reference_audio_path),
            "--channel",
            channel_name,
            "--segment_label",
            segment_label,
        ]

        try:
            subprocess.run(command, check=True)
        except subprocess.CalledProcessError as exc:
            raise ChatterboxVoiceServiceError(
                f"Chatterbox narration failed for channel '{channel_name}' using locked profile '{profile.voice_profile_id}'"
            ) from exc

        return {
            "channel": channel_name,
            "voice_profile_id": profile.voice_profile_id,
            "reference_audio_path": str(profile.reference_audio_path),
            "output_path": str(audio_path),
            "segment_label": segment_label,
        }


def main() -> int:
    parser = argparse.ArgumentParser(description="Central locked Chatterbox voice service")
    parser.add_argument("--channel", required=True, help="Exact channel name from channel_voice_map.json")
    parser.add_argument("--text-file", required=True, help="Narration text file path")
    parser.add_argument("--output", required=True, help="Destination audio path")
    parser.add_argument("--segment-label", default="main_narration", help="Segment label for auditing")
    parser.add_argument("--print-json", action="store_true", help="Print result JSON")
    args = parser.parse_args()

    try:
        result = ChatterboxVoiceService().generate_from_text_file(
            channel_name=args.channel,
            text_file=args.text_file,
            output_path=args.output,
            segment_label=args.segment_label,
        )
    except (VoiceProfileError, ChatterboxVoiceServiceError) as exc:
        print(f"[voice-service] {exc}", file=sys.stderr)
        return 1

    if args.print_json:
        print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
