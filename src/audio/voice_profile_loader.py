from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict

ROOT_DIR = Path(__file__).resolve().parents[2]
VOICE_PROFILE_DIR = ROOT_DIR / "config" / "voice_profiles"
CHANNEL_MAP_PATH = VOICE_PROFILE_DIR / "channel_voice_map.json"


class VoiceProfileError(RuntimeError):
    """Raised when a voice profile is missing, malformed, or unsafe."""


@dataclass(frozen=True)
class VoiceProfile:
    voice_profile_id: str
    channel: str
    model: str
    language_id: str
    reference_audio_path: Path
    exaggeration: float
    cfg_weight: float
    temperature: float
    locked: bool
    voice_style: Dict[str, Any]
    sample_test_line: str
    source_path: Path

    def to_chatterbox_options(self) -> Dict[str, Any]:
        return {
            "voice_profile_id": self.voice_profile_id,
            "channel": self.channel,
            "model": self.model,
            "language_id": self.language_id,
            "reference_audio_path": str(self.reference_audio_path),
            "exaggeration": self.exaggeration,
            "cfg_weight": self.cfg_weight,
            "temperature": self.temperature,
            "locked": self.locked,
        }


def _read_json(path: Path) -> Dict[str, Any]:
    if not path.exists():
        raise VoiceProfileError(f"Missing JSON file: {path}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise VoiceProfileError(f"Invalid JSON in {path}: {exc}") from exc


def _safe_reference_path(raw_path: str) -> Path:
    candidate = (ROOT_DIR / raw_path).resolve()
    voices_root = (ROOT_DIR / "assets" / "voices").resolve()
    if voices_root not in candidate.parents:
        raise VoiceProfileError(
            f"Unsafe reference audio path outside assets/voices: {candidate}"
        )
    return candidate


def load_channel_map() -> Dict[str, str]:
    data = _read_json(CHANNEL_MAP_PATH)
    if not isinstance(data, dict) or not data:
        raise VoiceProfileError("channel_voice_map.json must be a non-empty object")
    return {str(k): str(v) for k, v in data.items()}


def resolve_profile_path(channel_name: str) -> Path:
    channel_map = load_channel_map()
    if channel_name not in channel_map:
        known = ", ".join(sorted(channel_map))
        raise VoiceProfileError(
            f"No locked voice profile configured for channel '{channel_name}'. Known channels: {known}"
        )
    profile_id = channel_map[channel_name]
    slug = profile_id.removesuffix("_v1")
    profile_path = VOICE_PROFILE_DIR / f"{slug}.json"
    if not profile_path.exists():
        raise VoiceProfileError(
            f"Channel '{channel_name}' maps to missing profile file: {profile_path}"
        )
    return profile_path


def load_voice_profile(channel_name: str) -> VoiceProfile:
    profile_path = resolve_profile_path(channel_name)
    data = _read_json(profile_path)

    required = [
        "voice_profile_id",
        "channel",
        "model",
        "language_id",
        "reference_audio_path",
        "exaggeration",
        "cfg_weight",
        "temperature",
        "locked",
        "voice_style",
        "sample_test_line",
    ]
    missing = [key for key in required if key not in data]
    if missing:
        raise VoiceProfileError(
            f"Voice profile {profile_path.name} is missing required fields: {', '.join(missing)}"
        )

    reference_audio_path = _safe_reference_path(str(data["reference_audio_path"]))
    if not reference_audio_path.exists():
        raise VoiceProfileError(
            f"Reference audio missing for channel '{channel_name}': {reference_audio_path}. "
            f"Add the real licensed/owned reference.wav before generating narration."
        )

    if data["model"] != "chatterbox":
        raise VoiceProfileError(
            f"Unsupported voice model for channel '{channel_name}': {data['model']}"
        )
    if not bool(data["locked"]):
        raise VoiceProfileError(
            f"Voice profile for channel '{channel_name}' must remain locked=true"
        )

    return VoiceProfile(
        voice_profile_id=str(data["voice_profile_id"]),
        channel=str(data["channel"]),
        model=str(data["model"]),
        language_id=str(data["language_id"]),
        reference_audio_path=reference_audio_path,
        exaggeration=float(data["exaggeration"]),
        cfg_weight=float(data["cfg_weight"]),
        temperature=float(data["temperature"]),
        locked=bool(data["locked"]),
        voice_style=dict(data["voice_style"]),
        sample_test_line=str(data["sample_test_line"]),
        source_path=profile_path,
    )
