from __future__ import annotations

import socket
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import start_local_viewer as launcher


SERVER = ROOT / "server_nocache.py"
VERSION = (ROOT / "VERSION.txt").read_text(encoding="utf-8").strip()
SOURCE_BUILD = (ROOT / "SOURCE_BUILD.txt").read_text(encoding="utf-8").strip()
START_BAT = (ROOT / "start_local_viewer.bat").read_text(encoding="utf-8")


def free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def probe(port: int, expected: str, expected_build: str = SOURCE_BUILD) -> str:
    result = subprocess.run(
        [
            sys.executable,
            str(SERVER),
            "--probe",
            "127.0.0.1",
            str(port),
            expected,
            "local-start-test",
            expected_build,
        ],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
        timeout=5,
    )
    return result.stdout.strip()


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    require("start_local_viewer.py" in START_BAT, "BAT start Python-launcher niet")
    require("for /f" not in START_BAT.lower(), "BAT bevat nog complexe FOR-probelogica")
    require("Invoke-WebRequest" not in START_BAT, "oude PowerShell-probe staat nog in BAT")
    require("Pak de gedownloade ZIP eerst volledig uit" in START_BAT, "uitpakinstructie ontbreekt")
    require(not (ROOT / "startlocalviewer.bat").exists(), "tweede start-BAT bestaat nog")

    port = free_port()
    process = subprocess.Popen(
        [sys.executable, str(SERVER), str(port)],
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )
    try:
        deadline = time.monotonic() + 5
        state = "down|"
        while time.monotonic() < deadline:
            state = probe(port, VERSION)
            if state.startswith("ok|"):
                break
            if process.poll() is not None:
                detail = process.stderr.read() if process.stderr else ""
                raise AssertionError(f"lokale server stopte voortijdig: {detail}")
            time.sleep(0.05)
        identity = f"{VERSION} | {SOURCE_BUILD}"
        require(state == f"ok|{identity}", f"juiste bron niet herkend: {state!r}")
        require(
            launcher.run(
                host="127.0.0.1",
                port=port,
                expected_version=VERSION,
                expected_build=SOURCE_BUILD,
                allow_start=False,
                open_browser=False,
            )
            == 0,
            "Python-launcher accepteert de juiste actieve server niet",
        )

        wrong = probe(port, "v0-test-wrong")
        require(wrong == f"wrong|{VERSION}", f"verkeerde versie niet herkend: {wrong!r}")
        require(
            launcher.run(
                host="127.0.0.1",
                port=port,
                expected_version="v0-test-wrong",
                expected_build=SOURCE_BUILD,
                allow_start=False,
                open_browser=False,
            )
            == 1,
            "Python-launcher blokkeert een verkeerde actieve versie niet",
        )

        wrong_build = probe(port, VERSION, "oude-bronstand")
        require(
            wrong_build == f"wrong|{identity}",
            f"verkeerde bronstand bij dezelfde versie niet herkend: {wrong_build!r}",
        )
        require(
            launcher.run(
                host="127.0.0.1",
                port=port,
                expected_version=VERSION,
                expected_build="oude-bronstand",
                allow_start=False,
                open_browser=False,
            )
            == 1,
            "Python-launcher blokkeert een oude bron met hetzelfde versienummer niet",
        )
    finally:
        process.terminate()
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait(timeout=3)

    down = probe(port, VERSION)
    require(down == "down|", f"gesloten poort niet herkend: {down!r}")

    launched: list[subprocess.Popen] = []
    original_launch_server = launcher.launch_server

    def launch_hidden(test_port: int) -> subprocess.Popen:
        child = subprocess.Popen(
            [sys.executable, str(SERVER), str(test_port)],
            cwd=ROOT,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            text=True,
        )
        launched.append(child)
        return child

    launcher.launch_server = launch_hidden
    new_port = free_port()
    try:
        require(
            launcher.run(
                host="127.0.0.1",
                port=new_port,
                expected_version=VERSION,
                expected_build=SOURCE_BUILD,
                allow_start=True,
                open_browser=False,
            )
            == 0,
            "Python-launcher start en bereikt een nieuwe server niet",
        )
        require(
            probe(new_port, VERSION) == f"ok|{VERSION} | {SOURCE_BUILD}",
            "nieuw gestarte server reageert niet met de juiste bronstand",
        )
    finally:
        launcher.launch_server = original_launch_server
        for child in launched:
            child.terminate()
            try:
                child.wait(timeout=3)
            except subprocess.TimeoutExpired:
                child.kill()
                child.wait(timeout=3)

    print(
        "LOCAL START CHECK: OK "
        "(minimale BAT; Python-launcher; bestaande/nieuwe server; "
        "juiste/verkeerde versie en bronstand; gesloten poort; één starter)"
    )


if __name__ == "__main__":
    main()
