from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

from normalize_text_files import normalized_bytes


ROOT = Path(__file__).resolve().parents[1]
PUBLISH = (ROOT / "publish_checked.bat").read_text(encoding="utf-8")
stage_command = "git add -A -- ."
renormalize_command = "git add --renormalize -- ."

if PUBLISH.find(stage_command) < 0 or PUBLISH.find(renormalize_command) < 0:
    raise SystemExit("GIT PUBLISH STAGING: FOUT - staging of renormalisatie ontbreekt")
if PUBLISH.index(stage_command) >= PUBLISH.index(renormalize_command):
    raise SystemExit("GIT PUBLISH STAGING: FOUT - stage verwijderde paden vóór renormalisatie")

if shutil.which("git") is None:
    print("GIT PUBLISH STAGING: OVERGESLAGEN (Git niet beschikbaar buiten publicatie)")
    raise SystemExit(0)


def run(repo: Path, *args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        ["git", *args], cwd=repo, text=True, capture_output=True, check=False
    )
    if check and result.returncode:
        raise AssertionError(f"git {' '.join(args)}: {result.stderr.strip()}")
    return result


with tempfile.TemporaryDirectory(prefix="ogn-publish-staging-") as temporary:
    repo = Path(temporary)
    run(repo, "init", "--quiet")
    run(repo, "config", "user.name", "OpenGraph staging regression")
    run(repo, "config", "user.email", "opengraph-staging@example.invalid")
    (repo / ".gitattributes").write_text("*.md text eol=lf\n", encoding="utf-8")
    missing = repo / "CONFIG_UI_EXPLANATION_STANDARD.md"
    missing.write_text("# Tracked document\n", encoding="utf-8")
    survivor = repo / "README.md"
    survivor.write_text("# Original\n", encoding="utf-8")
    run(repo, "add", "-A", "--", ".")
    run(repo, "commit", "--quiet", "-m", "Initial regression fixture")

    missing.unlink()
    survivor.write_text("# Updated  \n", encoding="utf-8")

    old_order = run(repo, "add", "--renormalize", "--", ".", check=False)
    if old_order.returncode == 0:
        raise AssertionError("oude renormalisatievolgorde reproduceert de fout niet")
    if "CONFIG_UI_EXPLANATION_STANDARD.md" not in old_order.stderr:
        raise AssertionError(f"onverwachte Git-fout: {old_order.stderr.strip()}")

    run(repo, "add", "-A", "--", ".")
    run(repo, "add", "--renormalize", "--", ".")
    dirty_diff = run(repo, "diff", "--cached", "--check", check=False)
    if dirty_diff.returncode == 0 or "trailing whitespace" not in dirty_diff.stdout:
        raise AssertionError("Git signaleert de verwachte trailing whitespace niet")

    survivor.write_bytes(normalized_bytes(survivor, survivor.read_bytes()))
    run(repo, "add", "-A", "--", ".")
    run(repo, "add", "--renormalize", "--", ".")
    run(repo, "diff", "--cached", "--check")
    staged = run(repo, "diff", "--cached", "--name-status").stdout.splitlines()
    if "D\tCONFIG_UI_EXPLANATION_STANDARD.md" not in staged:
        raise AssertionError("verdwenen gevolgd document is niet veilig gestaged")
    if "M\tREADME.md" not in staged:
        raise AssertionError("bestaand document is niet gerenormaliseerd")

print("GIT PUBLISH STAGING: OK (eerst git add -A; verdwenen paden en trailing whitespace blokkeren publicatie niet)")
