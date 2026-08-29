#!/usr/bin/env python3
"""Valideer en installeer atomair een lokale testmateriaaldatabase."""
from __future__ import annotations

import os
import shutil
import sqlite3
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "data" / "testmateriaal.sqlite"
BACKUPS = ROOT / "data" / "backups"
REQUIRED_TABLES = {
    "metadata", "categories", "inputs", "source_aliases", "input_segments",
    "kernels", "relations", "placement_rules",
}


def validate(path: Path) -> tuple[int, int]:
    if not path.is_file():
        raise RuntimeError(f"bestand ontbreekt: {path}")
    con = sqlite3.connect(f"file:{path.as_posix()}?mode=ro", uri=True)
    try:
        if con.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
            raise RuntimeError("SQLite-integriteitscontrole mislukt")
        tables = {row[0] for row in con.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        missing = REQUIRED_TABLES - tables
        if missing:
            raise RuntimeError(f"tabellen ontbreken: {', '.join(sorted(missing))}")
        metadata = dict(con.execute("SELECT key,value FROM metadata"))
        if metadata.get("schema") != "opengraph-testmateriaal" or metadata.get("schema_version") != "2":
            raise RuntimeError("verwacht OpenGraph testmateriaal DB-schema 2")
        inputs = con.execute("SELECT count(*) FROM inputs").fetchone()[0]
        kernels = con.execute("SELECT count(*) FROM kernels").fetchone()[0]
        if not inputs or not kernels:
            raise RuntimeError("database bevat geen input of kernzinnen")
        bad_questions = con.execute(
            "SELECT number FROM inputs WHERE category_code=300 "
            "AND (instr(original_input,'?')=0 OR completion<>'AF')"
        ).fetchall()
        if bad_questions:
            raise RuntimeError(f"vraagzincontract mislukt voor: {bad_questions}")
        bad_stories = con.execute(
            "SELECT i.number FROM inputs i WHERE i.category_code=500 AND "
            "((SELECT count(*) FROM kernels k WHERE k.input_number=i.number)<2 OR "
            "NOT EXISTS(SELECT 1 FROM relations r WHERE r.input_number=i.number "
            "AND r.from_kernel<>r.to_kernel))"
        ).fetchall()
        if bad_stories:
            raise RuntimeError(f"Story-contract mislukt voor: {bad_stories}")
        return inputs, kernels
    finally:
        con.close()


def install(source: Path) -> None:
    source = source.resolve()
    if source == TARGET.resolve():
        raise RuntimeError("bron en doel zijn dezelfde database")
    inputs, kernels = validate(source)
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    BACKUPS.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup = BACKUPS / f"testmateriaal-{stamp}.sqlite"
    temporary = TARGET.with_name(f".{TARGET.name}.{os.getpid()}.tmp")
    had_target = TARGET.is_file()
    if had_target:
        shutil.copy2(TARGET, backup)
    try:
        shutil.copy2(source, temporary)
        validate(temporary)
        os.replace(temporary, TARGET)
        subprocess.run([sys.executable, str(ROOT / "tools" / "testmateriaal_db.py"), "export"], check=True)
        subprocess.run([sys.executable, str(ROOT / "tools" / "testmateriaal_db.py"), "verify"], check=True)
    except Exception:
        temporary.unlink(missing_ok=True)
        if had_target and backup.is_file():
            shutil.copy2(backup, TARGET)
            subprocess.run([sys.executable, str(ROOT / "tools" / "testmateriaal_db.py"), "export"], check=False)
        raise
    print("LOKALE DATABASE INGEVOEGD: OK")
    print(f"- bron       : {source}")
    print(f"- doel       : {TARGET}")
    print(f"- inhoud     : {inputs} inputrecords; {kernels} kernzinnen")
    print(f"- reservekopie: {backup if had_target else 'niet nodig'}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit('Gebruik: voeg-lokale-db-in.bat "C:\\pad\\testmateriaal.sqlite"')
    try:
        install(Path(sys.argv[1]))
    except Exception as exc:
        raise SystemExit(f"FOUT: database niet ingevoegd: {exc}") from exc
