from __future__ import annotations

import json
import shutil
import subprocess
import sys
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")
INDEX = (ROOT / "index.html").read_text(encoding="utf-8")
DOC = (ROOT / "docs" / "SOCIAL_EXPORT.md").read_text(encoding="utf-8")

errors: list[str] = []


def require(source: str, marker: str, label: str) -> None:
    if marker not in source:
        errors.append(f"{label} ontbreekt: {marker!r}")


for marker, label in [
    ("const PLAY_VIDEO_FRAME_RATE = 30;", "vaste framerate"),
    ("function playRecordingFormatCandidates()", "formaatselectie"),
    ("video/mp4;codecs=avc1.424028", "MP4/H.264-voorkeur"),
    ("video/webm;codecs=vp9", "WebM-fallback"),
    ("function createPlayMediaRecorder(stream)", "recorderfallback"),
    ("function canvasRecordingFrameSource(canvas)", "canvas-framebron"),
    ("canvas.captureStream(0)", "handmatige framevangst"),
    ("typeof track.requestFrame === 'function'", "requestFrame-controle"),
    ("function startCanvasRecordingFramePump(", "30-fps-framepomp"),
    ("window.setInterval(requestFrame", "doorlopende framepomp"),
    ("videoBitsPerSecond: 4000000", "LinkedIn-bitrate-doel"),
    ("const height = 628;", "even H.264-beeldhoogte"),
    ("recordParadata('export-play-video'", "algemene video-paradata"),
]:
    require(JS, marker, label)

if "stream = canvas.captureStream(30);" in JS:
    errors.append("oude alleen-bij-canvaswijziging opname staat nog in viewer.js")

require(INDEX, '>Play-video</button>', "algemene Play-videoknop")
for marker, label in [
    ("MP4/H.264", "MP4-uitleg"),
    ("30 fps", "framerate-uitleg"),
    ("10–60 fps", "LinkedIn-framerate-eis"),
    ("WebM", "WebM als fallback"),
]:
    require(DOC, marker, label)


def validate_video(path: Path) -> None:
    if not shutil.which("ffprobe"):
        errors.append("ffprobe ontbreekt voor mediacontrole")
        return
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-count_frames",
            "-show_entries",
            "format=format_name,duration,size,bit_rate:"
            "stream=codec_name,pix_fmt,width,height,r_frame_rate,avg_frame_rate,"
            "duration,bit_rate,nb_read_frames",
            "-of",
            "json",
            str(path),
        ],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode:
        errors.append(f"ffprobe kan {path.name} niet lezen: {result.stderr.strip()}")
        return
    probe = json.loads(result.stdout)
    streams = [stream for stream in probe.get("streams", []) if stream.get("codec_name")]
    if not streams:
        errors.append(f"{path.name} bevat geen videospoor")
        return
    stream = streams[0]
    media_format = probe.get("format", {})
    frame_rate_text = stream.get("avg_frame_rate") or stream.get("r_frame_rate") or "0/1"
    if frame_rate_text == "0/0":
        frame_rate_text = stream.get("r_frame_rate") or "0/1"
    frame_rate = float(Fraction(frame_rate_text))
    duration = float(stream.get("duration") or media_format.get("duration") or 0)
    bit_rate = int(stream.get("bit_rate") or media_format.get("bit_rate") or 0)
    size = int(media_format.get("size") or 0)
    width = int(stream.get("width") or 0)
    height = int(stream.get("height") or 0)

    if stream.get("codec_name") != "h264":
        errors.append(f"{path.name}: codec is {stream.get('codec_name')}, verwacht H.264")
    if not (10 <= frame_rate <= 60):
        errors.append(f"{path.name}: {frame_rate:.2f} fps valt buiten 10–60")
    if duration < 3:
        errors.append(f"{path.name}: duur {duration:.2f}s is korter dan 3s")
    if not (192_000 <= bit_rate <= 30_000_000):
        errors.append(f"{path.name}: bitrate {bit_rate} valt buiten 192 kbps–30 Mbps")
    if size < 75_000:
        errors.append(f"{path.name}: bestand is kleiner dan 75 KB")
    if not (256 <= width <= 4096 and 144 <= height <= 2304):
        errors.append(f"{path.name}: resolutie {width}×{height} valt buiten LinkedIn-eisen")
    if width % 2 or height % 2:
        errors.append(f"{path.name}: H.264-resolutie {width}×{height} is niet even")


if len(sys.argv) > 1:
    validate_video(Path(sys.argv[1]).resolve())

if errors:
    print("LINKEDIN-VIDEO CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

suffix = f"; bestand {Path(sys.argv[1]).name} voldoet" if len(sys.argv) > 1 else ""
print(f"LINKEDIN-VIDEO CHECK: OK (MP4 eerst; vaste 30 fps; WebM-fallback{suffix})")
