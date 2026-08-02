from __future__ import annotations

import argparse
import os
import subprocess
import sys
import time
import webbrowser
from pathlib import Path
from urllib.parse import urlencode

from server_nocache import probe_server_state


ROOT = Path(__file__).resolve().parent
SERVER = ROOT / "server_nocache.py"
VERSION_FILE = ROOT / "VERSION.txt"
SOURCE_BUILD_FILE = ROOT / "SOURCE_BUILD.txt"
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8088


def read_version() -> str:
    if not VERSION_FILE.is_file():
        raise RuntimeError(f"VERSION.txt ontbreekt in {ROOT}")
    version = VERSION_FILE.read_text(encoding="utf-8-sig").strip()
    if not version:
        raise RuntimeError(f"VERSION.txt is leeg in {ROOT}")
    return version


def read_source_build() -> str:
    if not SOURCE_BUILD_FILE.is_file():
        raise RuntimeError(f"SOURCE_BUILD.txt ontbreekt in {ROOT}")
    source_build = SOURCE_BUILD_FILE.read_text(encoding="utf-8-sig").strip()
    if not source_build:
        raise RuntimeError(f"SOURCE_BUILD.txt is leeg in {ROOT}")
    return source_build


def launch_server(port: int) -> subprocess.Popen:
    environment = os.environ.copy()
    environment["PYTHONDONTWRITEBYTECODE"] = "1"
    command = [sys.executable, str(SERVER), str(port)]
    options: dict[str, object] = {
        "cwd": str(ROOT),
        "env": environment,
    }
    if os.name == "nt":
        options["creationflags"] = getattr(subprocess, "CREATE_NEW_CONSOLE", 0)
    else:
        options.update(
            {
                "start_new_session": True,
                "stdout": subprocess.DEVNULL,
                "stderr": subprocess.DEVNULL,
            }
        )
    return subprocess.Popen(command, **options)


def reset_url(host: str, port: int, version: str, source_build: str) -> str:
    query = urlencode(
        {
            "ogv": version,
            "source": source_build,
            "nocache": f"{time.time_ns()}-{os.getpid()}",
        }
    )
    return f"http://{host}:{port}/reset-cache.html?{query}"


def open_reset_page(url: str) -> None:
    if os.name == "nt":
        os.startfile(url)  # type: ignore[attr-defined]
        return
    if not webbrowser.open(url, new=2):
        raise RuntimeError("de standaardbrowser kon niet worden geopend")


def run(
    *,
    host: str = DEFAULT_HOST,
    port: int = DEFAULT_PORT,
    expected_version: str | None = None,
    expected_build: str | None = None,
    allow_start: bool = True,
    open_browser: bool = True,
) -> int:
    try:
        version = expected_version or read_version()
        source_build = expected_build or read_source_build()
    except (OSError, RuntimeError) as exc:
        print(f"FOUT: {exc}", flush=True)
        return 1

    print("", flush=True)
    print("==============================", flush=True)
    print("OpenGraph Lite Viewer - lokaal", flush=True)
    print("==============================", flush=True)
    print("", flush=True)
    print(f"Bronmap    : {ROOT}", flush=True)
    print(f"App-versie: {version}", flush=True)
    print(f"Bronstand  : {source_build}", flush=True)
    print(f"Poort      : {port}", flush=True)
    print(f"Python     : {sys.executable}", flush=True)
    print("", flush=True)

    state, served_version = probe_server_state(
        host,
        port,
        version,
        f"start-{time.time_ns()}",
        source_build,
    )
    if state == "wrong":
        print(f"FOUT: poort {port} bedient een andere OpenGraph-bron.", flush=True)
        print(f"Verwacht : {version} | {source_build}", flush=True)
        print(f"Gevonden : {served_version}", flush=True)
        print('Sluit het oude venster "OpenGraph local server" en start opnieuw.', flush=True)
        return 1

    process: subprocess.Popen | None = None
    if state == "down":
        if not allow_start:
            print(f"FOUT: er reageert geen lokale server op poort {port}.", flush=True)
            return 1
        print("Lokale server wordt in een afzonderlijk venster gestart...", flush=True)
        try:
            process = launch_server(port)
        except OSError as exc:
            print(f"FOUT: lokale server kon niet starten: {exc}", flush=True)
            return 1

        deadline = time.monotonic() + 20
        while time.monotonic() < deadline:
            if process.poll() is not None:
                print(
                    f"FOUT: het serverproces stopte met code {process.returncode}.",
                    flush=True,
                )
                return 1
            time.sleep(0.25)
            state, served_version = probe_server_state(
                host,
                port,
                version,
                f"wait-{time.time_ns()}",
                source_build,
            )
            if state == "ok":
                break
            if state == "wrong":
                print(f"FOUT: poort {port} bedient een andere OpenGraph-bron.", flush=True)
                print(f"Verwacht : {version} | {source_build}", flush=True)
                print(f"Gevonden : {served_version}", flush=True)
                return 1
        else:
            print(
                f"FOUT: de lokale server met {version} reageert niet op poort {port}.",
                flush=True,
            )
            print(f"Handmatige test: http://{host}:{port}/VERSION.txt", flush=True)
            return 1

    url = reset_url(host, port, version, source_build)
    print("Servercontrole: OK", flush=True)
    print("Verplichte cache-reset:", flush=True)
    print(url, flush=True)
    if not open_browser:
        return 0
    try:
        open_reset_page(url)
    except (OSError, RuntimeError) as exc:
        print(f"FOUT: browser kon niet openen: {exc}", flush=True)
        print(f"Open deze URL handmatig: {url}", flush=True)
        return 1
    return 0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Start OpenGraph Lite Viewer lokaal.")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--no-browser", action="store_true")
    parser.add_argument("--no-start", action="store_true")
    arguments = parser.parse_args(argv[1:])
    return run(
        port=arguments.port,
        allow_start=not arguments.no_start,
        open_browser=not arguments.no_browser,
    )


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
