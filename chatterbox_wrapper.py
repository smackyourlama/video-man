import argparse
import json
import os
import subprocess
import sys
from pathlib import Path


def _load_profile(profile_json_path: str | None) -> dict:
    if not profile_json_path:
        raise RuntimeError("Missing --voice_profile_json. Direct ad-hoc voices are not allowed.")
    path = Path(profile_json_path).resolve()
    if not path.exists():
        raise RuntimeError(f"Voice profile JSON not found: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def _validate_reference_audio(reference_audio_path: str | None) -> Path:
    if not reference_audio_path:
        raise RuntimeError("Missing --reference_audio. Locked reference audio is required.")
    path = Path(reference_audio_path).resolve()
    if not path.exists():
        raise RuntimeError(f"Reference audio file not found: {path}")
    return path


def _find_chatterbox_command() -> list[str]:
    env_command = os.getenv("CHATTERBOX_TTS_COMMAND", "").strip()
    if env_command:
        return env_command.split()
    raise RuntimeError(
        "No Chatterbox runtime configured. Set CHATTERBOX_TTS_COMMAND to the real Chatterbox inference command. "
        "Fallback TTS providers are intentionally disabled."
    )


def generate_audio(text_file, output_audio_path, voice_profile_json, reference_audio_path, channel, segment_label):
    """Strict wrapper around the real Chatterbox runtime. No fallback voices allowed."""
    print(f"[Chatterbox] Loading text from: {text_file}")
    with open(text_file, 'r', encoding='utf-8') as f:
        script_text = f.read().strip()

    if not script_text:
        raise RuntimeError(f"Narration text file is empty: {text_file}")

    profile = _load_profile(voice_profile_json)
    reference_audio = _validate_reference_audio(reference_audio_path)
    chatterbox_command = _find_chatterbox_command()

    cmd = [
        *chatterbox_command,
        "--text",
        script_text,
        "--output",
        str(Path(output_audio_path).resolve()),
        "--reference-audio",
        str(reference_audio),
        "--cfg-weight",
        str(profile["cfg_weight"]),
        "--temperature",
        str(profile["temperature"]),
        "--exaggeration",
        str(profile["exaggeration"]),
        "--language",
        str(profile["language_id"]),
        "--profile-id",
        str(profile["voice_profile_id"]),
        "--channel",
        str(channel),
        "--segment-label",
        str(segment_label),
    ]

    print(f"[Chatterbox] Using locked profile: {profile['voice_profile_id']} for channel: {channel}")
    try:
        subprocess.run(cmd, check=True)
        print(f"[Chatterbox] Successfully synthesized audio to: {output_audio_path}")
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(f"Chatterbox command failed with exit code {exc.returncode}") from exc


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Strict Chatterbox TTS Wrapper")
    parser.add_argument("--text_file", required=True, help="Path to input text file")
    parser.add_argument("--output", required=True, help="Path to output audio file")
    parser.add_argument("--voice_profile_json", required=True, help="Locked voice profile JSON")
    parser.add_argument("--reference_audio", required=True, help="Reference audio WAV path")
    parser.add_argument("--channel", required=True, help="Channel name")
    parser.add_argument("--segment_label", default="main_narration", help="Narration segment label")

    args = parser.parse_args()
    try:
        generate_audio(
            args.text_file,
            args.output,
            args.voice_profile_json,
            args.reference_audio,
            args.channel,
            args.segment_label,
        )
    except Exception as exc:
        print(f"[Chatterbox] Failed to generate audio: {exc}", file=sys.stderr)
        sys.exit(1)
