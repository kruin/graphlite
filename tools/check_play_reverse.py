from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / "viewer.js").read_text(encoding="utf-8")

errors: list[str] = []

required = [
    "state.projectionBlockUnlocked = maxStep > 0 && state.growthStep >= maxStep;",
    "setGrowthStep(state.growthStep - 1)",
    "const showProjectionPanels = !growthPlan?.active || visibleAt(growthPlan, growthPlan.projectionStep);",
    "const showLexBaseStep = !growthPlan?.active || visibleAt(growthPlan, growthPlan.lexBaseStep);",
    "const showSpaceStep = !growthPlan?.active || visibleAt(growthPlan, growthPlan.spaceStep);",
    "const showLogStep = !growthPlan?.active || visibleAt(growthPlan, growthPlan.logStep);",
    "if (showProjectionPanels)",
    "} else if (showLexBaseStep) {",
    "} else if (showSpaceStep) {",
    "} else if (showLogStep) {",
]
for marker in required:
    if marker not in JS:
        errors.append(f"reverse Play mist {marker!r}")

for stale in [
    "if (state.growthStep >= maxStep && maxStep > 0) state.projectionBlockUnlocked = true;",
    "if (state.growthStep <= 0) state.projectionBlockUnlocked = false;",
]:
    if stale in JS:
        errors.append(f"oude blijvende eindlaag staat nog in viewer.js: {stale}")

order = [
    JS.find("if (showProjectionPanels)"),
    JS.find("} else if (showLexBaseStep) {"),
    JS.find("} else if (showSpaceStep) {"),
    JS.find("} else if (showLogStep) {"),
]
if any(index < 0 for index in order) or order != sorted(order):
    errors.append("renderfasen staan niet in vooruit-/reverse-compatibele volgorde")

if errors:
    print("PLAY-REVERSECHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print("PLAY-REVERSECHECK: OK (eindlaag → LEX → ruimte → LOG → boom)")
