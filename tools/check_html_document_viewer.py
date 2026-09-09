from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []


def read(relative: str) -> str:
    path = ROOT / relative
    if not path.is_file():
        errors.append(f"ontbreekt: {relative}")
        return ""
    return path.read_text(encoding="utf-8")


viewer = read("docs/view.html")
router = read("docs/html-doc-links.js")

for marker in (
    "renderMarkdown(source)",
    "connectLinks(documentUrl)",
    "url.pathname.startsWith(siteRoot.pathname)",
    "fetch(documentUrl.href,{cache:'no-store'})",
    "Alle documenten",
    "@media(max-width:600px)",
):
    if marker not in viewer:
        errors.append(f"HTML-documentweergave mist {marker!r}")

for marker in ("routeMarkdownLinks()", "/\\.md$/i", "siteRoot.pathname", "view.html"):
    if marker not in router:
        errors.append(f"Markdown-linkrouter mist {marker!r}")

html_with_markdown_links = []
for path in ROOT.rglob("*.html"):
    relative = path.relative_to(ROOT).as_posix()
    if relative == "docs/view.html":
        continue
    source = path.read_text(encoding="utf-8", errors="ignore")
    if re.search(r'href="[^"]*\.md(?:[?#][^"]*)?"', source):
        html_with_markdown_links.append(relative)
        expected = "html-doc-links.js" if relative.startswith("docs/") else "docs/html-doc-links.js"
        if expected not in source:
            errors.append(f"{relative} opent Markdown nog zonder HTML-router")

if len(html_with_markdown_links) < 8:
    errors.append(f"te weinig gekoppelde detailschermen gecontroleerd: {html_with_markdown_links!r}")

if errors:
    print("HTML DOCUMENT VIEWER CHECK: FOUT")
    for error in errors:
        print("-", error)
    raise SystemExit(1)

print(f"HTML DOCUMENT VIEWER CHECK: OK ({len(html_with_markdown_links)} detailschermen; interne .md-links blijven HTML)")
