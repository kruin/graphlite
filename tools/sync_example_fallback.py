#!/usr/bin/env python3
"""Synchroniseer de ingebouwde file://-fallback mechanisch met examples-input.html."""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "examples-input.html").read_text(encoding="utf-8")
JS_PATH = ROOT / "viewer.js"


def attrs(tag: str) -> dict[str, str]:
    return {key: html.unescape(value) for key, value in re.findall(r'data-([\w-]+)="([^"]*)"', tag)}


def text(fragment: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", fragment))).strip()


records = []
for match in re.finditer(r'(<article class="example-input"[^>]*>)(.*?)</article>', HTML, re.S):
    data = attrs(match.group(1))
    body = match.group(2)
    sentence_match = re.search(r'<p class="sentence"[^>]*>(.*?)</p>', body, re.S)
    if not sentence_match:
        continue
    sentence_html = sentence_match.group(1).strip()
    lex_items = []
    for token in re.finditer(r'(<li class="[^"]*\blex-token\b[^"]*"[^>]*>)(.*?)</li>', body, re.S):
        token_data = attrs(token.group(1))
        lex_items.append({
            "id": token_data.get("id") or f"lex-{len(lex_items) + 1}",
            "label": text(token.group(2)),
            "source": token_data.get("source"),
            "slot": token_data.get("slot"),
            "role": token_data.get("role"),
            "thematicRole": token_data.get("thematic-role"),
            "lexeme": token_data.get("lexeme"),
        })
    if not lex_items:
        continue
    insertions = []
    for token in re.finditer(r'(<li class="lex-insertion"[^>]*>)(.*?)</li>', body, re.S):
        item = attrs(token.group(1))
        insertions.append({
            "id": item.get("id", ""), "text": item.get("text", ""),
            "host": item.get("host", "VP"), "defaultHost": item.get("default-host", item.get("host", "VP")),
            "category": item.get("category", "BIJWOORD"), "marking": item.get("marking", "functional:default-host"),
            "scope": item.get("scope", ""), "linear": item.get("linear", ""),
            "logInterval": item.get("log-interval", ""), "logAfter": item.get("log-after", ""), "logBefore": item.get("log-before", ""),
            "order": int(item.get("order", len(insertions) + 1)), "group": item.get("group", item.get("id", "")),
            "lemma": item.get("lemma", ""), "construction": item.get("construction", ""),
            "usageProfile": item.get("usage-profile", ""), "origin": item.get("origin", "LOG"),
            "originComponents": item.get("origin-components", ""), "analysisStatus": item.get("analysis-status", "resolved"),
            "candidateProfiles": item.get("candidate-profiles", "").split(), "ambiguityAffects": item.get("ambiguity-affects", "").split(),
        })
    subject = next((item["label"] for item in lex_items if item["role"] == "subject"), data.get("implicit-subject", "HOND"))
    object_ = next((item["label"] for item in lex_items if item["role"] == "object"), "")
    record = {
        "id": data.get("id", ""), "title": text(sentence_html).upper(), "phase": data.get("phase", "Fase"),
        "sentenceType": data.get("sentence-type", ""), "lexRule": data.get("lex-rule", "hoofdzininvariant"),
        "sentence": text(sentence_html).upper(), "sentenceHtml": sentence_html,
        "subjectDefault": subject.upper(), "objectDefault": object_.upper(), "predicate": data.get("predicate", "BIJT").upper(),
        "tenseFamily": data.get("tense-family", ""), "defaultTense": data.get("default-tense", "ott"),
        "utteranceType": data.get("utterance-type", ""),
        "utteranceKernels": json.loads(data.get("utterance-kernels", "[]")),
        "utteranceRelations": json.loads(data.get("utterance-relations", "[]")),
        "implicitSubject": data.get("implicit-subject", ""), "lexInsertions": insertions, "lexItems": lex_items,
    }
    records.append(record)

source = JS_PATH.read_text(encoding="utf-8")
marker = "  let EXAMPLES = "
start = source.index(marker) + len(marker)
depth = 0
quote = None
escaped = False
end = None
for index in range(start, len(source)):
    char = source[index]
    if quote:
        if escaped:
            escaped = False
        elif char == "\\":
            escaped = True
        elif char == quote:
            quote = None
        continue
    if char in "\"'`":
        quote = char
    elif char == "[":
        depth += 1
    elif char == "]":
        depth -= 1
        if depth == 0:
            end = index + 1
            break
if end is None:
    raise RuntimeError("Fallback-array niet afgesloten")
replacement = json.dumps(records, ensure_ascii=False, indent=4)
JS_PATH.write_text(source[:start] + replacement + source[end:], encoding="utf-8")
print(f"Fallback gesynchroniseerd: {len(records)} voorbeelden.")
