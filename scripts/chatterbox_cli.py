#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

import torch
import torchaudio as ta
import perth

if getattr(perth, "PerthImplicitWatermarker", None) is None:
    perth.PerthImplicitWatermarker = perth.DummyWatermarker

from chatterbox.tts import ChatterboxTTS


def detect_device() -> str:
    if torch.cuda.is_available():
        return "cuda"
    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return "mps"
    return "cpu"


def main() -> int:
    parser = argparse.ArgumentParser(description="VideoMan Chatterbox CLI bridge")
    parser.add_argument("--text", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--reference-audio", required=True)
    parser.add_argument("--cfg-weight", type=float, default=0.5)
    parser.add_argument("--temperature", type=float, default=0.8)
    parser.add_argument("--exaggeration", type=float, default=0.5)
    parser.add_argument("--language", default="en")
    parser.add_argument("--profile-id", default="unknown")
    parser.add_argument("--channel", default="unknown")
    parser.add_argument("--segment-label", default="main_narration")
    args = parser.parse_args()

    output_path = Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    reference_audio = Path(args.reference_audio).resolve()
    if not reference_audio.exists():
        raise FileNotFoundError(f"Reference audio not found: {reference_audio}")

    device = detect_device()
    print(f"[VideoMan Chatterbox CLI] device={device} channel={args.channel} profile={args.profile_id} segment={args.segment_label}")

    model = ChatterboxTTS.from_pretrained(device=device)
    wav = model.generate(
        args.text,
        audio_prompt_path=str(reference_audio),
        exaggeration=args.exaggeration,
        cfg_weight=args.cfg_weight,
        temperature=args.temperature,
    )
    ta.save(str(output_path), wav, model.sr)
    print(f"[VideoMan Chatterbox CLI] wrote {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
