#!/usr/bin/env python3
"""Eenmalige migratie: losse tijdsvormen samenvoegen tot minimale zinsfamilies."""
from __future__ import annotations

import json
import re
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXAMPLES = ROOT / "examples-input.html"
DB = ROOT / "data" / "testmateriaal.sqlite"

KEEP = [
    "jan-wast-zichzelf",
    "jan-slaat-jek-omdat-die-hem-beet",
    "jan-beloonde-jek-omdat-die-het-bot-terugbracht",
    "ken-uzelf",
    "hond-bijt-man",
    "muziek-ontroert-anna",
    "bijt-hond-man-vraag",
    "dat-hond-man-bijt",
    "omdat-hond-man-bijt",
    "vrouw-breit-trui",
]


def add_attrs(article: str, **attrs: str) -> str:
    additions = ""
    for name, value in attrs.items():
        attribute = f'data-{name.replace("_", "-")}'
        if re.search(rf'\s{re.escape(attribute)}="[^"]*"', article.split(">", 1)[0]):
            article = re.sub(rf'(\s{re.escape(attribute)}=")[^"]*(")', rf'\g<1>{value}\g<2>', article, count=1)
        else:
            additions += f' {attribute}="{value}"'
    return article.replace(">", additions + ">", 1)


def migrate_html() -> None:
    source = EXAMPLES.read_text(encoding="utf-8")
    articles = {
        match.group(1): match.group(0)
        for match in re.finditer(r'<article class="example-input"[^>]*data-id="([^"]+)"[^>]*>.*?</article>', source, re.S)
    }
    selected = []
    for item_id in KEEP:
        article = articles[item_id]
        if item_id in {"hond-bijt-man", "dat-hond-man-bijt", "omdat-hond-man-bijt"}:
            article = add_attrs(article, tense_family="bijten", default_tense="ott")
        elif item_id == "vrouw-breit-trui":
            article = add_attrs(article, tense_family="breien", default_tense="ott")
        selected.append(article)

    selected.append('''<article class="example-input" data-id="hond-valt" data-sentence-type="main-declarative" data-lex-rule="hoofdzininvariant" data-phase="Zijn-perfectum · Thema" data-predicate="VALT" data-tense-family="vallen" data-default-tense="ott">
<p class="sentence" title="Intransitieve tijdsfamilie met ZIJN als perfectumauxiliair"><strong data-role="subject" data-thematic-role="thema">HOND</strong> VALT</p>
<p class="meta">intransitief · subject=thema · OTT VALT · OVT VIEL · VTT IS GEVALLEN · VVT WAS GEVALLEN</p>
<ol aria-label="LEX-volgorde" class="lex-sequence">
<li class="lex-token" data-id="subject-hond-valt" data-lexeme="hond" data-role="subject" data-source="subject" data-thematic-role="thema"><strong data-role="subject" data-thematic-role="thema">HOND</strong></li>
<li class="lex-token" data-id="pred-valt" data-lexeme="vallen" data-role="predicate" data-source="predicate">VALT</li>
</ol>
</article>''')

    selected.append('''<article class="example-input" data-id="de-hond-bijt-de-man-misschien-wel-vaak" data-sentence-type="main-declarative" data-lex-rule="hoofdzininvariant" data-phase="Meervoudige LEX-insertie" data-predicate="BIJT">
<p class="sentence" title="MISSCHIEN WEL is één insertiegroep; VAAK is een tweede insertie"><strong data-role="subject" data-thematic-role="agens">DE HOND</strong> BIJT <em data-role="object" data-thematic-role="patiens">DE MAN</em> MISSCHIEN WEL VAAK</p>
<p class="meta">hoofdzin · twee zelfstandige LEX-inserties · geen tweede tijdsvormtest</p>
<ol aria-label="Structurele LEX-bronnen zonder externe inserties" class="lex-sequence">
<li class="lex-token" data-id="subject-hond-adv" data-lexeme="hond" data-role="subject" data-source="subject" data-thematic-role="agens"><strong data-role="subject" data-thematic-role="agens">DE HOND</strong></li>
<li class="lex-token" data-id="pred-bijt-adv" data-lexeme="bijten" data-role="predicate" data-source="predicate">BIJT</li>
<li class="lex-token" data-id="object-man-adv" data-lexeme="man" data-role="object" data-source="object" data-thematic-role="patiens"><em data-role="object" data-thematic-role="patiens">DE MAN</em></li>
</ol>
<ol aria-label="Externe lexicale insertiegroepen" class="lex-insertions">
<li class="lex-insertion" data-ambiguity-affects="origin log-projection scope components" data-analysis-status="ask" data-candidate-profiles="mixed-modal-particle group-modal-log group-lexical-particle" data-category="MODALITEIT" data-construction="misschien-wel" data-default-host="VP" data-group="modal-group" data-host="VP" data-id="misschien-wel" data-lemma="misschien wel" data-linear="post-object" data-order="1" data-origin="LOG+LEX" data-origin-components="misschien:LOG wel:LEX" data-scope="propositie" data-text="MISSCHIEN WEL" data-usage-profile="mixed-modal-particle">MISSCHIEN WEL — MODALITEIT</li>
<li class="lex-insertion" data-analysis-status="resolved" data-category="FREQUENTIE" data-default-host="VP" data-group="frequency-group" data-host="VP" data-id="vaak" data-lemma="vaak" data-linear="post-object" data-order="2" data-origin="LOG" data-scope="gebeurtenis" data-text="VAAK" data-usage-profile="frequency-event">VAAK — FREQUENTIE</li>
</ol>
</article>''')

    opening = re.search(r'<section aria-label="Uitingen en voorbeeldzinnen" id="opengraph-example-input">', source)
    if not opening:
        raise RuntimeError("Voorbeeldsectie ontbreekt")
    start = opening.end()
    end = source.index("</section>", start)
    source = source[:start] + "\n" + "\n".join(selected) + "\n" + source[end:]
    source = re.sub(r"<title>.*?</title>", "<title>OpenGraph voorbeeldzinnen · minimale tijdsfamilies</title>", source, count=1)
    EXAMPLES.write_text(source, encoding="utf-8")


def migrate_db() -> None:
    con = sqlite3.connect(DB)
    con.execute("PRAGMA foreign_keys=ON")
    remove = (120, 130, 150, 230, 240, 250, 260, 270, 280, 410, 440, 470)
    with con:
        for table in ("relations", "placement_rules", "kernels", "input_segments", "source_aliases", "revisions"):
            con.executemany(f"DELETE FROM {table} WHERE input_number=?", ((number,) for number in remove))
        con.executemany("DELETE FROM inputs WHERE number=?", ((number,) for number in remove))

        canonical_sources = {
            110: "example:hond-bijt-man",
            140: "example:vrouw-breit-trui",
            220: "example:omdat-hond-man-bijt",
        }
        for number, source_id in canonical_sources.items():
            con.execute("DELETE FROM source_aliases WHERE input_number=?", (number,))
            con.execute("INSERT INTO source_aliases(input_number,source_id) VALUES(?,?)", (number, source_id))

        for number in (110, 140, 220, 420, 450):
            row = con.execute("SELECT features_json FROM inputs WHERE number=?", (number,)).fetchone()
            features = json.loads(row[0]) if row else []
            if "tijdsfamilie" not in features:
                features.append("tijdsfamilie")
            con.execute("UPDATE inputs SET features_json=?, internal_note=trim(internal_note || ' Tijdsvormen worden uit één canonieke familie gegenereerd.') WHERE number=?", (json.dumps(features, ensure_ascii=False), number))

        con.execute("UPDATE inputs SET original_input=?, features_json=?, internal_note=? WHERE number=180", (
            "DE HOND BIJT DE MAN MISSCHIEN WEL VAAK",
            json.dumps(["context", "LEX-insertie"], ensure_ascii=False),
            "Meervoudige insertie; bewust geen afzonderlijke perfectumtest."
        ))
        con.execute("UPDATE input_segments SET text=? WHERE input_number=180", ("DE HOND BIJT DE MAN MISSCHIEN WEL VAAK",))
        con.execute("DELETE FROM source_aliases WHERE input_number=180")
        con.execute("INSERT INTO source_aliases(input_number,source_id) VALUES(180,?)", ("example:de-hond-bijt-de-man-misschien-wel-vaak",))

        if not con.execute("SELECT 1 FROM inputs WHERE number=200").fetchone():
            con.execute("INSERT INTO inputs(number,original_input,category_code,sort_order,status,completion,form,features_json,analysis_status,revision,internal_note,publication_phase,platforms_json,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (
                200, "HOND VALT", 100, 200, "OK", "AF", "simplex",
                json.dumps(["basis", "tijdsfamilie", "zijn-perfectum", "thema"], ensure_ascii=False),
                "GOEDGEKEURD", 1, "Canonieke intransitieve familie: VALT/VIEL/IS GEVALLEN/WAS GEVALLEN.", None, "[]", ""
            ))
            con.execute("INSERT INTO source_aliases(input_number,source_id) VALUES(200,'example:hond-valt')")
            con.execute("INSERT INTO input_segments(input_number,segment_no,text) VALUES(200,1,'HOND VALT')")
            con.execute("INSERT INTO kernels(input_number,kernel_no,text,analysis_status) VALUES(200,1,'HOND VALT','GOEDGEKEURD')")
    con.close()


if __name__ == "__main__":
    migrate_html()
    migrate_db()
    print("Tijdsfamilies gemigreerd: 12 zichtbare voorbeelden; redundante DB-items verwijderd.")
