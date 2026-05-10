from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List

from voice_profile_loader import ROOT_DIR, VoiceProfileError, load_channel_map, load_voice_profile

VOICE_SERVICE_IMPORT = "src/audio/chatterbox_voice_service.py"
FORBIDDEN_PATTERNS = [
    re.compile(r"chatterbox_wrapper\.py"),
    re.compile(r"edge-tts"),
    re.compile(r"google-tts-api"),
]
SKIP_DIR_NAMES = {"node_modules", ".git", "processed", "outputs", "uploads", "__pycache__"}
ALLOWED_DIRECT_WRAPPER_FILES = {
    str((ROOT_DIR / "chatterbox_wrapper.py").resolve()),
    str((ROOT_DIR / "src" / "audio" / "chatterbox_voice_service.py").resolve()),
    str((ROOT_DIR / "src" / "audio" / "voice_audit.py").resolve()),
}


def iter_source_files() -> List[Path]:
    files: List[Path] = []
    for path in ROOT_DIR.rglob("*"):
        if not path.is_file():
            continue
        if any(part in SKIP_DIR_NAMES for part in path.parts):
            continue
        if path.name.endswith('.orig') or path.name.endswith('.bak'):
            continue
        if path.suffix.lower() not in {".js", ".py", ".md", ".sh", ".json"}:
            continue
        files.append(path)
    return files


def audit_profiles() -> List[str]:
    findings: List[str] = []
    channel_map = load_channel_map()
    for channel_name in sorted(channel_map):
        try:
            load_voice_profile(channel_name)
        except VoiceProfileError as exc:
            findings.append(str(exc))
    return findings


def audit_direct_tts_usage() -> List[str]:
    findings: List[str] = []
    for path in iter_source_files():
        resolved = str(path.resolve())
        if resolved in ALLOWED_DIRECT_WRAPPER_FILES:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for pattern in FORBIDDEN_PATTERNS:
            if pattern.search(text):
                findings.append(f"Forbidden direct TTS reference in {path}: {pattern.pattern}")
    return findings


def build_report() -> Dict[str, List[str]]:
    return {
        "profile_findings": audit_profiles(),
        "direct_tts_findings": audit_direct_tts_usage(),
    }


def main() -> int:
    report = build_report()
    print(json.dumps(report, indent=2))
    return 1 if any(report.values()) else 0


if __name__ == "__main__":
    raise SystemExit(main())
